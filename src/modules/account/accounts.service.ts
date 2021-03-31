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
import { AccountsFilterRequestDto } from './dto/filter-request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private passwordHelper: PasswordHelper,
    private jwtService: JwtService, //private authService: AuthService,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(username: string): Promise<Account | undefined> {
    return this.accountsRepository.findOne({ Username: username });
  }

  async getAccounts(
    model: AccountsFilterRequestDto,
  ): Promise<[Account[], number]> {
    const { skip, take, searchBy, searchKeyword } = model;
    const order = {};
    const filterCondition = {} as any;
    const where = [];
    let search = '';

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
    console.log(existed_email_account);
    if (existed_email_account) {
      customThrowError(
        RESPONSE_MESSAGES.EMAIL_EXIST,
        HttpStatus.CONFLICT,
        RESPONSE_MESSAGES_CODE.EMAIL_EXIST,
      );
      return;
    }

    const existed_username_account = await this.accountsRepository.findOne({
      Username: model.username.toLowerCase(),
    });

    if (existed_username_account) {
      customThrowError(
        RESPONSE_MESSAGES.USERNAME_EXIST,
        HttpStatus.CONFLICT,
        RESPONSE_MESSAGES_CODE.USERNAME_EXIST,
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

    await this._checkPassword(model.password, account.Password);
    const payload = {
      id: account.Id,
      email: account.Email,
      type: TOKEN_TYPE.USER_LOGIN,
      role: TOKEN_ROLE.USER,
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
}
