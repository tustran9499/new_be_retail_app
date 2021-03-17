import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) { }
    @Get()
    findAll() {
        return this.accountsService.findAll();
    }
}
