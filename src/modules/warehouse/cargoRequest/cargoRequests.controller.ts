import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SetMetadata,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  Res,
  Request,
  UploadedFile,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCargoRequestDto } from 'src/dto/warehouse/CreateCargoRequest.dto';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { CargoRequestsService } from './cargoRequests.service';

@ApiTags('CargoRequest')
@Controller('cargo-requests')
export class CargoRequestsController {
  constructor(private CargoRequestsService: CargoRequestsService) {}

  //@SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
  //@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createCargoRequest(
    @Body() model: CreateCargoRequestDto,
    @Req() req: Request,
  ): Promise<boolean> {
    return this.CargoRequestsService.createCargoRequest(
      model,
      //(req as any).user.id ?? 1,
    );
  }
}
