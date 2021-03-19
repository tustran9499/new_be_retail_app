import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { Account } from '../../entities/account/account.entity';
import { AccountFilterRequestDto } from './dto/filter-request.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    findAll(): Promise<Account[]> {
        return this.accountRepository.find();
    }

    /* get All */
    // async getAccounts(
    //     model: AccountFilterRequestDto,
    // ): Promise<[Account[], number]> {
    //     const {
    //     pageNo,
    //     pageSize,
    //     searchBy,
    //     searchKeyword,
    //     } = model;
    //     const order = {};
    //     const filterCondition = {} as any;
    //     const where = [];
    //     let search = '';

    //     if (model.orderBy) {
    //     order[model.orderBy] = model.orderDirection;
    //     } else {
    //     (order as any).createdDate = 'DESC';
    //     }

    //     if (searchBy && searchKeyword) {
    //     filterCondition[searchBy] = Raw(
    //         alias => `LOWER(${alias}) like '%${searchKeyword.toLowerCase()}%'`,
    //     );
    //     }

    //     where.push({ ...filterCondition });
    //     const options: FindManyOptions<Account> = {
    //     select: [
    //         'Id',
    //         'FName',
    //         'LName',
    //         'Email',
    //         'Title',
    //         'TitleOfCourtesy',
    //         'ReportsTo',
    //         'UserName',
    //         'Birthday',
    //         'HireDate',
    //         'Homephone',
    //         'Extension',
    //         'PhotoURL',
    //         'Notes',
    //         'Type',
    //         'Country',
    //         'PostalCode',
    //         'Region',
    //         'City',
    //         'Address',
    //     ],
    //     where: search,
    //     skip,
    //     take,
    //     };

    //     const [account, number] = await this.accountRepository.findAndCount(
    //     options,
    //     );
    //     const modifiedAccounts = account.map(o => new Account(o));
    //     return [modifiedAccounts, number];
    // }
}
