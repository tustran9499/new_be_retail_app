import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/account/accounts.module';

import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AccountsModule, AuthModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
