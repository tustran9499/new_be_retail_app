import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/account/accounts.module';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    "type": "mssql",
    "host": "tunganthesis.mssql.somee.com",
    "port": 1433,
    "database": "tunganthesis",
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "synchronize": false,
    "logging": true,
    "extra": {
      "driver": "msnodesqlv8",
      "options": {
        "trustedConnection": true
      }
    },
    "entities": [
      "dist/**/*.entity.js"
    ],
    "migrations": [
      "dist/database/migrations/*.js"
    ],
    "subscribers": [
      "dist/database/subscriber/*.js"
    ],
    "cli": {
      "migrationsDir": "src/database/migrations"
    }
  }), AccountsModule, AuthModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
