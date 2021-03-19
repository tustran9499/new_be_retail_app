import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { Account } from '../../entities/account/account.entity';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule { }
