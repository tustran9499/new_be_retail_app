import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { Account } from '../../entities/account/account.entity';
import { AccountsController } from './accounts.controller';
import { PasswordHelper } from '../../common/helper/password.helper';
import { TokenHelper } from '../../common/helper/token.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService, PasswordHelper, TokenHelper],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule { }
