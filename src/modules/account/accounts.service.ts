import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from 'src/common/constants/response-messages.enum';
import { TOKEN_ROLE } from 'src/common/constants/token-role.enum';
import { TOKEN_TYPE } from 'src/common/constants/token-types.enum';
import { PasswordHelper } from 'src/common/helper/password.helper';
import { customThrowError } from 'src/common/helper/throw.helper';
import { TokenHelper } from 'src/common/helper/token.helper';
import { CreateAccountDto } from 'src/dto/account/CreateAccount.dto';
import { LoginAccountDto } from 'src/dto/account/LoginAccount.dto';
import { LoginResponseDto } from 'src/dto/account/LoginResponse.dto';
import { UpdateAccountDto } from 'src/dto/account/UpdateAccount.dto.';
import { Connection, FindManyOptions, Raw, Repository } from 'typeorm';
import { Account } from '../../entities/account/account.entity';
import { File } from '../../entities/file/file.entity';
import { AccountsFilterRequestDto } from './dto/filter-request.dto';
import { JwtService } from '@nestjs/jwt';
import { MailHelper } from 'src/common/helper/mail.helper';
import { getNickname } from 'src/common/helper/utility.helper';
import { ConfigService } from '@nestjs/config';
import { TemplatesService } from 'src/common/modules/email-templates/template.service';
import * as mimeTypes from 'mime-types';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private passwordHelper: PasswordHelper,
    private jwtService: JwtService, //private authService: AuthService,
  ) { }

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(username: string): Promise<Account | undefined> {
    return this.accountsRepository.findOne({ Username: username });
  }

  async findOneById(id: number): Promise<Account | undefined> {
    return this.accountsRepository.findOne({ Id: id });
  }


  async getAccounts(
    model: AccountsFilterRequestDto,
  ): Promise<[Account[], number]> {
    const { skip, take, searchBy, searchKeyword } = model;
    const order = {};
    const filterCondition = {} as any;
    const where = [];
    //let search = '';

    if (model.orderBy) {
      order[model.orderBy] = model.orderDirection;
    } else {
      (order as any).createdDate = 'DESC';
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Raw(
        alias => `LOWER(${alias}) like '%${searchKeyword.toLowerCase()}%'`,
      );
    }

    where.push({ ...filterCondition });
    const options: FindManyOptions<Account> = {
      select: [
        'Id',
        'FName',
        'LName',
        'Email',
        'Title',
        'TitleOfCourtesy',
        'ReportsTo',
        'Username',
        'Birthday',
        'HireDate',
        'Homephone',
        'Extension',
        'PhotoURL',
        'Notes',
        'Type',
        'Country',
        'PostalCode',
        'Region',
        'City',
        'Address',
      ],
      where: where,
      skip: skip,
      take: take,
    };

    const [Accounts, number] = await this.accountsRepository.findAndCount(
      options,
    );
    return [Accounts, number];
  }

  async getAccountDetail(id: number): Promise<Account> {
    const account = await this.accountsRepository.findOne(id);

    if (!account) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
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
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async createAccount(model: CreateAccountDto): Promise<any> {
    const existed_email_account = await this.accountsRepository.findOne({
      Email: model.email.toLowerCase(),
    });
    if (existed_email_account) {
      customThrowError(
        RESPONSE_MESSAGES.EMAIL_EXIST,
        HttpStatus.CONFLICT,
        RESPONSE_MESSAGES_CODE.EMAIL_EXIST,
      );
      return;
    }

    await this._createAccount(model);
  }

  async updateAccount(id: number, model: UpdateAccountDto): Promise<any> {
    const account = await this.accountsRepository.findOne(id);
    const keys = Object.keys(model);
    keys.forEach(key => {
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
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
      return;
    }

    if (id === currentAccountId) {
      customThrowError(
        RESPONSE_MESSAGES.SELF_DELETE,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.SELF_DELETE,
      );
      return;
    }

    await this.accountsRepository.softDelete(id);
    return true;
  }

  private async _checkPassword(plain, hash) {
    // const matched = await this.passwordHelper.checkHash(plain, hash);

    if (plain != hash) {
      customThrowError(
        RESPONSE_MESSAGES.LOGIN_FAIL,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL,
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
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL,
      );
    }
    await this._checkPassword(model.password, account.Password);
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
      select: ['Id', 'Email'],
    });
    return email;
  }

  async uploadFile(
    file: Express.Multer.File,
    targetId: number,
    currentUserId: number,
    referenceType: number,
  ): Promise<boolean> {
    try {
      await this.fileRepository.delete({
        ReferenceId: targetId,
        ReferenceType: referenceType,
      });

      const extension = mimeTypes.extension(file.mimetype);

      const newFile = new File();

      newFile.Id = file.filename.split('.')[0];
      let fileName = '';
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
        e,
      );
    }
  }

  async deleteFile(
    targetId: number,
    type: number,
    requestUserId: number,
  ): Promise<boolean> {
    const targetUser = await this.accountsRepository.findOne(targetId, {
      select: ['Id', 'Type'],
    });

    const requestUser = await this.accountsRepository.findOne(requestUserId, {
      select: ['Id', 'Type'],
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
}
