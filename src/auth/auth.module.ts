import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [AccountsModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule { }
