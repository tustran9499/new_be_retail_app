import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from "src/common/constants/response-messages.enum";
import { TOKEN_ROLE } from "src/common/constants/token-role.enum";
import { TOKEN_TYPE } from "src/common/constants/token-types.enum";
import { PasswordHelper } from "src/common/helper/password.helper";
import { customThrowError } from "src/common/helper/throw.helper";
import { TokenHelper } from "src/common/helper/token.helper";
import { CreateAccountDto } from "src/dto/account/CreateAccount.dto";
import { LoginAccountDto } from "src/dto/account/LoginAccount.dto";
import { LoginResponseDto } from "src/dto/account/LoginResponse.dto";
import { UpdateAccountDto } from "src/dto/account/UpdateAccount.dto.";
import {
  Connection,
  FindManyOptions,
  getConnection,
  getCustomRepository,
  Like,
  Raw,
  Repository,
  UpdateResult,
} from "typeorm";
import { Account } from "../../entities/account/account.entity";
import { AccountsFilterRequestDto } from "./dto/filter-request.dto";
import { JwtService } from "@nestjs/jwt";
import { MailHelper } from "src/common/helper/mail.helper";
import { getNickname } from "src/common/helper/utility.helper";
import { ConfigService } from "@nestjs/config";
import { TemplatesService } from "src/common/modules/email-templates/template.service";
import { File } from "../../entities/file/file.entity";
import * as mimeTypes from "mime-types";
import { AccountRepository } from "./accounts.repository";
import { Warehouse } from "src/entities/warehouse/warehouse.entity";
import { Store } from "src/entities/store/store.entity";
import { FilterRequestDto } from "../warehouse/cargoRequest/dto/filter-request.dto";
import { CreateWarehouseDto } from "src/dto/warehouse/CreateWarehouse.dto";
import { UpdateWarehouseDto } from "src/dto/warehouse/UpdateWarehouse.dto";
import { CreateStoreDto } from "src/dto/store/CreateStore.dto";
import { UpdateStoreDto } from "src/dto/store/UpdateStore.dto";
import { ResetPassword } from "./dto/ResetPassword.dto";
import * as bcrypt from "bcrypt";
import {
  CreateThrowProductsRequest,
  GetThrowProductsRequest,
} from "src/dto/throwProducts/CreateThrowProductsRequest.dto";

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private jwtService: JwtService, //private readonly mailHelper: MailHelper, //private readonly tokenHelper: TokenHelper, //private authService: AuthService,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private passwordHelper: PasswordHelper
  ) { }

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async _createHash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  async _checkHash(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async findAllCashier(storeId: number): Promise<Account[]> {
    return await this.accountsRepository
      .createQueryBuilder("accounts")
      .where("accounts.StoreId = :StoreId", { StoreId: storeId })
      .andWhere("accounts.Type = :Type", { Type: "Salescleck" })
      .getMany();
  }

  async findAllCashierOfStoreManager(storeManagerId: number): Promise<Account[]> {
    const manager = await this.findOneById(storeManagerId);
    if (manager && manager.Type == "StoreManager" && manager.StoreId) {
      return await this.accountsRepository
        .createQueryBuilder("accounts")
        .where("accounts.StoreId = :StoreId", { StoreId: manager.StoreId })
        .andWhere("accounts.Type = :Type", { Type: "Salescleck" })
        .getMany();
    }
    else {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, "Error on finding cashiers!");
    }
  }

  async findOne(username: string): Promise<Account | undefined> {
    return this.accountsRepository.findOne({ Username: username });
  }

  async setThrowProductsStatus(id: number, status: string): Promise<any> {
    let result;
    if (status === "Thrown") {
      result = await Promise.all([
        getConnection().query(
          `UPDATE "account_products__product"
          SET status = '${status}', ThrownAt = GETDATE()
          WHERE Id = ${id}
          `,
          [id, status]
        ),
      ]);
      return result;
    }
    result = await Promise.all([
      getConnection().query(
        `UPDATE "account_products__product"
        SET status = '${status}'
        WHERE Id = ${id}
        `,
        [id, status]
      ),
    ]);
    return result;
  }

  async getThrowProductsStatus(id: number): Promise<any> {
    const result = await Promise.all([
      getConnection().query(
        `SELECT status FROM "account_products__product"
        WHERE Id = ${id}
        `,
        [id]
      ),
    ]);
    return result;
  }

  async getThrowProductsReq(
    filterOptionsModel: FilterRequestDto
  ): Promise<[any[], number]> {
    let userId = filterOptionsModel.userId;

    return await this._getThrowProductsReq(filterOptionsModel);
  }

  async _getThrowProductsReq(
    filterOptionsModel: FilterRequestDto
  ): Promise<[any[], number]> {
    const { skip, take, searchBy, searchKeyword } = filterOptionsModel;
    const order = {};
    const filterCondition = {} as any;
    const where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).CreatedAt = "DESC";
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    let search = "";

    let orders = [];
    let count;
    try {
      const tmp = await Promise.all([
        getConnection().query(
          `select app.*, a.FName, a.LName, a.Email , p.ProductName 
          from account_products__product app join Account a on app.accountId = a.Id 
          join Product p on app.productId = p.Id 
          where app.storeId = ${filterOptionsModel.storeId}
          ORDER BY createdAt DESC
          OFFSET ${filterOptionsModel.skip} ROWS FETCH NEXT ${filterOptionsModel.take} ROWS ONLY`
        ),
        [filterOptionsModel.storeId],
      ]);
      const count2 = await Promise.all([
        getConnection().query(
          `select count(*) as Count
          from account_products__product app join Account a on app.accountId = a.Id 
          join Product p on app.productId = p.Id 
          where app.storeId = ${filterOptionsModel.storeId}`
        ),
        [filterOptionsModel.storeId],
      ]);
      orders = tmp;
      count = count2;
      console.log(orders[0]);
      console.log(count[0]);
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
    // return [modifiedOrders, count];
    return [orders[0], count[0][0].Count];
  }

  async getAccounts(
    model: AccountsFilterRequestDto
  ): Promise<[Account[], number]> {
    const { skip, take, searchBy, searchKeyword } = model;
    const order = {};
    const filterCondition = {} as any;
    let where = [];
    let search = "";

    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).createdDate = "DESC";
    }

    where = searchKeyword
      ? [
        //@ts-ignore
        {
          Email: Like(`%${searchKeyword.toLowerCase()}%`),
        },
        //@ts-ignore
        {
          FName: Like(`%${searchKeyword.toLowerCase()}%`),
        },
        //@ts-ignore
        {
          LName: Like(`%${searchKeyword.toLowerCase()}%`),
        },
        //@ts-ignore
        {
          Id: Like(`%${searchKeyword.toLowerCase()}%`),
        },
      ]
      : [];
    const options: FindManyOptions<Account> = {
      select: [
        "Id",
        "FName",
        "LName",
        "Email",
        "Title",
        "TitleOfCourtesy",
        "ReportsTo",
        "Username",
        "Birthday",
        "HireDate",
        "Homephone",
        "Extension",
        "PhotoURL",
        "Notes",
        "Type",
        "Country",
        "PostalCode",
        "Region",
        "City",
        "Address",
        "EmailVerified",
        "AdminVerified",
        "StoreId",
        "WarehouseId",
      ],
      where: where,
      skip: skip,
      take: take,
    };

    const [Accounts, number] = await this.accountsRepository.findAndCount(
      options
    );
    return [Accounts, number];
  }

  async getAllStore(): Promise<any> {
    const result = await this.accountsRepository
      .createQueryBuilder("accounts")
      .select("StoreId")
      .where("accounts.StoreId IS NOT NULL")
      .andWhere("accounts.Id <= 50")
      .distinct(true)
      .getRawAndEntities();
    var lst = [];
    result.raw.map((item) => {
      lst.push(item.StoreId);
    });
    return lst;
  }

  async getAllStoreByUser(id: number): Promise<any> {
    const result = await this.accountsRepository
      .createQueryBuilder("accounts")
      .select("StoreId")
      .where({ Id: id })
      .andWhere("accounts.StoreId IS NOT NULL")
      .distinct(true)
      .getRawAndEntities();
    var lst = [];
    result.raw.map((item) => {
      lst.push(item.StoreId);
    });
    return lst;
  }

  async getAllSalesclerks(): Promise<any> {
    const result = await this.accountsRepository
      .createQueryBuilder("accounts")
      .select("Id")
      .where("accounts.Type = 'Salescleck'")
      .andWhere("accounts.Id < 40")
      .distinct(true)
      .getRawAndEntities();
    var lst = [];
    result.raw.map((item) => {
      lst.push(item.Id);
    });
    return lst;
  }

  async getStoreProductManager(storeId: number): Promise<any> {
    const result = await this.accountsRepository
      .createQueryBuilder("accounts")
      .select("Id")
      .where("accounts.Type = 'StoreManager'")
      .andWhere("accounts.StoreId IS NOT NULL")
      .andWhere("accounts.StoreId = :storeId", { storeId: storeId })
      .distinct(true)
      .getRawAndEntities();
    var lst = [];
    result.raw.map((item) => {
      lst.push(item.Id);
    });
    return lst;
  }

  async getAccountDetail(id: number): Promise<Account> {
    const account = await this.accountsRepository.findOne(id);
    if (!account) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }

    return account;
  }

  private async _createAccount(model: any): Promise<Account> {
    try {
      const account = new Account();
      account.Username = model.username;
      account.Email = model.email;
      account.Password = model.password;
      account.HashedPW = await this._createHash(model.password);
      account.FName = model.fName;
      account.LName = model.lName;
      account.Title = model.title;
      account.TitleOfCourtesy = model.titleOfCourtesy;
      account.ReportsTo = model.reportsTo;
      account.Birthday = model.birthday;
      account.HireDate = model.hireDate;
      account.Homephone = model.homephone;
      account.Extension = model.extension;
      account.PhotoURL = model.photoURL;
      account.Notes = model.notes;
      account.Type = model.type;
      account.Country = model.country;
      account.PostalCode = model.postalCode;
      account.Region = model.region;
      account.City = model.city;
      account.Address = model.address;
      const result = await this.accountsRepository.save(account);
      const tokenData = {
        id: result.Id,
        role: TOKEN_ROLE.ADMIN,
        type: TOKEN_TYPE.VERIFY,
      };
      const mailHelper = new MailHelper(
        new ConfigService(),
        new TemplatesService()
      );
      const tokenHelper = new TokenHelper(new ConfigService());
      const verifyToken = tokenHelper.createToken(tokenData);
      await mailHelper.sendWelcomeMail(
        result.Email,
        TOKEN_ROLE.ADMIN,
        getNickname(result)
      );
      mailHelper.sendVerifyEmail(
        result.Email,
        verifyToken,
        TOKEN_ROLE.ADMIN,
        getNickname(result)
      );
      // mailHelper.sendTestEmail();
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async findOneById(id: number): Promise<Account | undefined> {
    return this.accountsRepository
      .createQueryBuilder("accounts")
      .where({ Id: id })
      .leftJoinAndSelect("accounts.Store", "Store")
      .getOne();
  }

  async createAccount(model: CreateAccountDto): Promise<any> {
    const existed_email_account = await this.accountsRepository.findOne({
      Email: model.email.toLowerCase(),
    });
    if (existed_email_account) {
      customThrowError(
        RESPONSE_MESSAGES.EMAIL_EXIST,
        HttpStatus.CONFLICT,
        RESPONSE_MESSAGES_CODE.EMAIL_EXIST
      );
      return;
    }
    await this._createAccount(model);
  }

  private async _changeVerifyStatus(
    id: number,
    isEmailVerified: boolean
  ): Promise<boolean> {
    const user = await this.accountsRepository.findOne(id);

    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.ACCOUNT_NOT_FOUND
      );
    }

    user.EmailVerified = isEmailVerified;
    await this.accountsRepository.save(user);
    return true;
  }

  async updateAccount(id: number, model: UpdateAccountDto): Promise<any> {
    const account = await this.accountsRepository.findOne(id);
    const keys = Object.keys(model);
    keys.forEach((key) => {
      account[key] = model[key];
    });

    await this.accountsRepository.save(account);
    return this.getAccountDetail(id);
  }

  async deleteAccount(id: number, currentAccountId: number): Promise<boolean> {
    const account = await this.accountsRepository.findOne(id);

    if (!account) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
      return;
    }

    if (id === currentAccountId) {
      customThrowError(
        RESPONSE_MESSAGES.SELF_DELETE,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.SELF_DELETE
      );
      return;
    }

    await this.accountsRepository.softDelete(id);
    return true;
  }

  private async _checkPassword(plain, hash) {
    let matched;
    if (hash) {
      matched = await this._checkHash(plain, hash);
    } else {
      customThrowError(
        "Please check the hashed field",
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL
      );
    }

    //if (plain != hash) {
    if (!matched) {
      customThrowError(
        RESPONSE_MESSAGES.LOGIN_FAIL,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL
      );
    }
    return true;
  }

  async login(model: LoginAccountDto): Promise<LoginResponseDto> {
    const account = await this.accountsRepository.findOne({
      where: { Email: model.email },
    });
    console.log(!account);
    if (!account) {
      customThrowError(
        RESPONSE_MESSAGES.LOGIN_FAIL,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL
      );
    }

    // if (account.DeletedAt) {
    //   customThrowError(
    //     RESPONSE_MESSAGES.DELETED_ACCOUNT,
    //     HttpStatus.NOT_FOUND,
    //     RESPONSE_MESSAGES_CODE.DELETED_ACCOUNT,
    //   );
    // }

    // if (!account.EmailVerified) {
    //   customThrowError(
    //     RESPONSE_MESSAGES.EMAIL_NOT_VERIFY,
    //     HttpStatus.UNAUTHORIZED,
    //     RESPONSE_MESSAGES_CODE.EMAIL_NOT_VERIFY,
    //   );
    // }

    await this._checkPassword(model.password, account.HashedPW);
    const payload = {
      id: account.Id,
      email: account.Email,
      type: TOKEN_TYPE.USER_LOGIN,
      role: account.Type,
    };
    const token = this.jwtService.sign(payload);

    const result: LoginResponseDto = new LoginResponseDto({
      token: token,
      ...account,
    });
    return result;
  }

  async getAccountRole(id: number): Promise<any> {
    const account = await this.accountsRepository.findOne(id);
    if (account) {
      return account.Type;
    }
    return null;
  }

  async verifyAccount(token: string): Promise<any> {
    const tokenHelper = new TokenHelper(new ConfigService());
    const data = tokenHelper.verifyToken(token, TOKEN_TYPE.VERIFY);
    const { role, id } = data;

    await this.accountsRepository.update({ Id: id }, { EmailVerified: true });
    const email = await this.accountsRepository.findOne(id, {
      select: ["Id", "Email"],
    });
    return email;
  }

  async verifyByAdmin(id: number): Promise<any> {
    const result = await this.accountsRepository.update(id, {
      AdminVerified: true,
    });
    return result;
  }

  async uploadFile(
    file: Express.Multer.File,
    targetId: number,
    currentUserId: number,
    referenceType: number
  ): Promise<boolean> {
    try {
      await this.fileRepository.delete({
        ReferenceId: targetId,
        ReferenceType: referenceType,
      });

      const extension = mimeTypes.extension(file.mimetype);

      const newFile = new File();

      newFile.Id = file.filename.split(".")[0];
      let fileName = "";
      if (file.originalname) {
        fileName = file.originalname;
      }
      newFile.FileName = fileName;
      newFile.ReferenceType = referenceType;
      newFile.ReferenceId = targetId;
      newFile.Extension = extension;

      await this.fileRepository.save(newFile);

      // this.fileHelper.writeFile(`${fileRecord.id}.${extension}`, file);
      return true;
    } catch (e) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        e
      );
    }
  }

  async deleteFile(
    targetId: number,
    type: number,
    requestUserId: number
  ): Promise<boolean> {
    const targetUser = await this.accountsRepository.findOne(targetId, {
      select: ["Id", "Type"],
    });

    const requestUser = await this.accountsRepository.findOne(requestUserId, {
      select: ["Id", "Type"],
    });
    if (targetId !== requestUserId) {
      // if (requestUser.companyId !== targetUser.companyId) {
      //   customThrowError(
      //     RESPONSE_MESSAGES.ERROR,
      //     HttpStatus.UNAUTHORIZED,
      //     RESPONSE_MESSAGES_CODE.ERROR,
      //   );
      // }
      // if (
      //   requestUser.accountRole !== ACCOUNT_ROLE.OWNER &&
      //   requestUser.accountRole !== ACCOUNT_ROLE.ADMIN
      // ) {
      //   customThrowError(
      //     RESPONSE_MESSAGES.ERROR,
      //     HttpStatus.UNAUTHORIZED,
      //     RESPONSE_MESSAGES_CODE.ERROR,
      //   );
      // }
      this._deleteFile(targetId, type);
      return true;
    }
    this._deleteFile(targetId, type);
    return true;
  }

  private async _deleteFile(referenceId: number, referenceType: number) {
    await this.fileRepository.delete({
      ReferenceId: referenceId,
      ReferenceType: referenceType,
    });
    return true;
  }

  async restoreAccount(id: number): Promise<boolean> {
    await this.accountsRepository.restore(id);
    return true;
  }

  async getDeletedAccounts(
    model: AccountsFilterRequestDto
  ): Promise<[Account[], number]> {
    const { skip, take, searchBy, searchKeyword } = model;

    let search = "";

    if (searchBy && searchKeyword) {
      search = `AND "${searchBy}" like '%${searchKeyword.toLowerCase()}%'`;
    }
    const customAccountsRepository = getCustomRepository(AccountRepository);
    return await customAccountsRepository.getDeletedAccounts({
      take,
      skip,
      search,
    });
  }

  //WAREHOUSE
  async getWarehouses(
    filterOptionsModel: FilterRequestDto
  ): Promise<[Warehouse[], number]> {
    return await this._getListWarehouse(filterOptionsModel);
  }

  async getWarehousesAllDb(): Promise<[Warehouse[], number]> {
    const res = await this.warehouseRepository.find();
    return [res, res.length];
  }

  async _getListWarehouse(
    filterOptionsModel: FilterRequestDto
  ): Promise<[Warehouse[], number]> {
    const {
      skip,
      take,
      searchBy,
      searchKeyword,
      order: filterOrder,
    } = filterOptionsModel;
    const order = {};
    const filterCondition = {} as any;
    const where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).Id = "ASC";
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    where.push({ ...filterOrder, ...filterCondition });
    let search = "";
    if (searchBy === "userEmail") {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<Warehouse> = {
        where: search,
        skip,
        take,
        order,
      };
      const [orders, count] = await this.warehouseRepository.findAndCount(
        options
      );
      return [orders, count];
    }

    const options: FindManyOptions<Warehouse> = {
      where,
      skip,
      take,
      order,
    };

    const [orders, count] = await this.warehouseRepository.findAndCount(
      options
    );
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getWarehousesDetail(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne(id);

    if (!warehouse) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }

    return warehouse;
  }

  async createWarehouse(
    model: CreateWarehouseDto,
    requestId?: number
  ): Promise<Warehouse> {
    try {
      const warehouse = new Warehouse();

      const keys = Object.keys(model);
      keys.forEach((key) => {
        warehouse[key] = model[key];
      });

      const result = await this.warehouseRepository.save(warehouse);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async updateWarehouse(
    id: number,
    model: UpdateWarehouseDto,
    requestId?: number
  ): Promise<UpdateResult> {
    try {
      const warehouse = new Warehouse();
      Object.keys(model).forEach((key) => {
        warehouse[key] = model[key];
      });
      const result = await this.warehouseRepository.update(id, warehouse);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async deleteWarehouse(
    id: number,
    currentAccountId: number
  ): Promise<boolean> {
    const warehouse = await this.warehouseRepository.findOne(id);

    if (!warehouse) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
      return;
    }

    await this.warehouseRepository.softDelete(id);
    return true;
  }

  //STORE
  async getStores(
    filterOptionsModel: FilterRequestDto
  ): Promise<[Store[], number]> {
    return await this._getListStore(filterOptionsModel);
  }

  async _getListStore(
    filterOptionsModel: FilterRequestDto
  ): Promise<[Store[], number]> {
    const {
      skip,
      take,
      searchBy,
      searchKeyword,
      order: filterOrder,
    } = filterOptionsModel;
    const order = {};
    const filterCondition = {} as any;
    const where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).Id = "ASC";
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    where.push({ ...filterOrder, ...filterCondition });
    let search = "";
    if (searchBy === "userEmail") {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<Store> = {
        where: search,
        skip,
        take,
        order,
      };
      const [orders, count] = await this.storeRepository.findAndCount(options);
      return [orders, count];
    }

    const options: FindManyOptions<Store> = {
      where,
      skip,
      take,
      order,
    };

    const [orders, count] = await this.storeRepository.findAndCount(options);
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getStoresAllDb(): Promise<[Store[], number]> {
    const res = await this.storeRepository.find();
    return [res, res.length];
  }

  async getStoreDetail(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne(id);

    if (!store) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }

    return store;
  }

  async createStore(model: CreateStoreDto, requestId?: number): Promise<Store> {
    try {
      const store = new Store();

      const keys = Object.keys(model);
      keys.forEach((key) => {
        store[key] = model[key];
      });

      const result = await this.storeRepository.save(store);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async updateStore(
    id: number,
    model: UpdateStoreDto,
    requestId?: number
  ): Promise<UpdateResult> {
    try {
      const store = new Store();

      const keys = Object.keys(model);
      keys.forEach((key) => {
        store[key] = model[key];
      });
      const result = await this.storeRepository.update(id, store);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async deleteStore(id: number, currentAccountId: number): Promise<boolean> {
    const store = await this.storeRepository.findOne(id);

    if (!store) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
      return;
    }

    await this.storeRepository.softDelete(id);
    return true;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.accountsRepository.findOne({
      where: { Email: email.toLowerCase() },
      select: ["Id", "Email", "FName"],
    });
    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }
    const tokenHelper = new TokenHelper(new ConfigService());
    const token = tokenHelper.createToken({
      id: user.Id,
      email: user.Email.toLowerCase(),
      type: TOKEN_TYPE.FORGOT_PASSWORD,
    });
    const mailHelper = new MailHelper(
      new ConfigService(),
      new TemplatesService()
    );
    mailHelper.sendForgotPassword(
      token,
      user.Email.toLowerCase(),
      TOKEN_ROLE.USER,
      getNickname(user)
    );

    return true;
  }

  async resetPassword(model: ResetPassword): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000) * 1000;
    const tokenHelper = new TokenHelper(new ConfigService());
    const data = tokenHelper.verifyToken(
      model.token,
      TOKEN_TYPE.FORGOT_PASSWORD
    );
    const user = await this.accountsRepository.findOne(
      {
        Email: data.email,
        Id: data.id,
      }
      // { select: ['id'] },
    );

    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }

    user.Password = model.password;
    user.HashedPW = await this._createHash(model.password);
    //user.passwordChangedAt = new Date(now);
    await this.accountsRepository.save(user);
    const logUser = {
      id: user.Id,
      email: user.Email,
      role: TOKEN_ROLE.USER,
    };
    return true;
  }

  async hashBulkPassword() {
    // const users = await this.accountsRepository.find({
    //   where: { HashedPW: null },
    // });
    // let userList = [];
    // users.map((user) => {
    //   return userList.push(user.Id);
    // });
    // userList.map(async (item) => {
    //   let curUser = await this.accountsRepository.findOne({
    //     where: { Id: 1 },
    //   });
    //   curUser.HashedPW = await this._createHash(curUser.Password);
    //   await this.accountsRepository.save(curUser);
    // });
    let curUser = await this.accountsRepository.findOne({
      where: { Id: 4 },
    });
    curUser.HashedPW = await this._createHash(curUser.Password);
    await this.accountsRepository.save(curUser);
  }

  async createThrowProductsReq(
    model: CreateThrowProductsRequest
  ): Promise<boolean> {
    try {
      const tmp = await Promise.all([
        getConnection().query(
          `INSERT INTO "account_products__product"
        (accountId, productId, quantity, status, storeId, createdAt)
        VALUES (${model.accountId}, ${model.productId}, ${
            model.quantity
          }, '${"Pending"}', ${model.storeId}, GETDATE())`,
          [model.accountId, model.productId, model.quantity, model.storeId]
        ),
      ]);
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }
}
