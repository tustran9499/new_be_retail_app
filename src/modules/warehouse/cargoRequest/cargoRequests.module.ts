import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CargoRequest } from "src/entities/warehouse/cargorequest.entity";
import { AccountsModule } from "src/modules/account/accounts.module";
import { CargoRequestsController } from "./cargoRequests.controller";
import { CargoRequestsService } from "./cargoRequests.service";
import { CargoRequestRepository } from "./cargoRequests.repository";
import { ReturnedCargoRequest } from "src/entities/warehouse/returnedcargorequest.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([CargoRequest, ReturnedCargoRequest]),
    AccountsModule,
  ],
  controllers: [CargoRequestsController],
  providers: [CargoRequestsService],
})
export class CargoRequestsModule {}
