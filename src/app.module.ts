import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/account/account.module';

import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
