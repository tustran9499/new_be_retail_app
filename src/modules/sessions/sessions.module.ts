import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from 'src/entities/session/session.entity';
import { Account } from '../../entities/account/account.entity';
import { AccountsModule } from '../account/accounts.module';
@Module({
  imports: [TypeOrmModule.forFeature([Session]), AccountsModule],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule { }
