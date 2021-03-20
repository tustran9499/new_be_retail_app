import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGES, RESPONSE_MESSAGES_CODE } from 'src/common/constants/response-messages.enum';
import { customThrowError } from 'src/common/helper/throw.helper';
import { CreateAccountDto } from 'src/dto/account/CreateAccount.dto';
import { UpdateAccountDto } from 'src/dto/account/UpdateAccount.dto.';
import { Connection, FindManyOptions, Raw, Repository } from 'typeorm';
import { Account } from '../../entities/account/account.entity';
import { AccountFilterRequestDto } from './dto/filter-request.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private connection: Connection,
    ) { }

    findAll(): Promise<Account[]> {
        return this.accountRepository.find();
    }

    async getAccounts(
        model: AccountFilterRequestDto,
    ): Promise<[Account[], number]> {
        const {
        skip,
        take,
        searchBy,
        searchKeyword,
        } = model;
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
        where: where ,
        skip: skip,
        take: take,
        };

        const [accounts, number] = await this.accountRepository.findAndCount(
        options,
        );
        return [accounts, number];
    }

    async getAccountDetail(id: number): Promise<Account> {
        const account = await this.accountRepository.findOne( id );
    
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
          const result = await this.accountRepository.save(account);
          return result;
        } catch (error) {
          customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async createAccount(
        model: CreateAccountDto,
      ): Promise<any> {
        const existed_email_account = await this.accountRepository.findOne({
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

        const existed_username_account = await this.accountRepository.findOne({
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

    async updateAccount(
        id: number,
        model: UpdateAccountDto,
    ): Promise<any> {
        const account = await this.accountRepository.findOne(id);
        const keys = Object.keys(model);
        keys.forEach(key => {
            account[key] = model[key];
        });
    
        await this.accountRepository.save(account);
        return this.getAccountDetail(id);
    }

    async deleteAccount(id: number, currentAccountId: number): Promise<boolean> {
        const account = await this.accountRepository.findOne(id);
    
        if (!account){
            customThrowError(
                RESPONSE_MESSAGES.NOT_FOUND,
                HttpStatus.BAD_REQUEST,
                RESPONSE_MESSAGES_CODE.NOT_FOUND,
            )
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
    
        await this.accountRepository.softDelete(id);
        return true;
      }
}
