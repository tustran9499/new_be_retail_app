import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { Account } from '../../entities/account/account.entity';
import { AccountsController } from './accounts.controller';
import { PasswordHelper } from '../../common/helper/password.helper';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { File } from 'src/entities/file/file.entity';
import { AccountRepository } from './accounts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, File, AccountRepository]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AccountsService, PasswordHelper],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
