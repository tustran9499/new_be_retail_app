import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private accountsService: AccountsService, private jwtService: JwtService) { }

    async validateAccount(username: string, pass: string): Promise<any> {
        const account = await this.accountsService.findOne(username);
        if (account && account.Password === pass) {
            const { Password, ...result } = account;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.UserName, sub: user.Id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
