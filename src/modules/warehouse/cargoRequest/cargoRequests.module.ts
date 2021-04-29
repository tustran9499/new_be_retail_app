import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { AccountsModule } from 'src/modules/account/accounts.module';
import { CargoRequestsController } from './cargoRequests.controller';
import { CargoRequestsService } from './cargoRequests.service';
@Module({
  imports: [TypeOrmModule.forFeature([CargoRequest]), AccountsModule],
  controllers: [CargoRequestsController],
  providers: [CargoRequestsService]
})
export class CargoRequestsModule { }
