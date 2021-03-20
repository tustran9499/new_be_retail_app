import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/modules/account/accounts.service';

@Injectable()
export class AuthService {
    constructor(private AccountsService: AccountsService, private jwtService: JwtService) { }

    async validateAccount(username: string, pass: string): Promise<any> {
        const account = await this.AccountsService.findOne(username);
        if (account && account.Password === pass) {
            const { Password, ...result } = account;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.UserName, sub: user.Id, role: user.Type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
