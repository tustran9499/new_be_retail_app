import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { Account } from '../../entities/account/account.entity';
import { AccountsController } from './accounts.controller';
import { PasswordHelper } from '../../common/helper/password.helper';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService, PasswordHelper /*AuthService*/],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
