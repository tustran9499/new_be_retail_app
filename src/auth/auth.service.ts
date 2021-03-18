import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class AuthService {
    constructor(private accountsService: AccountsService) { }

    async validateAccount(username: string, pass: string): Promise<any> {
        const account = await this.accountsService.findOne(username);
        if (account && account.Password === pass) {
            const { Password, ...result } = account;
            return result;
        }
        return null;
    }
}
