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
import { CreateCargoRequestDto, UpdateCargoRequestDto } from 'src/dto/warehouse/CreateCargoRequest.dto';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { CargoRequestsService } from './cargoRequests.service';
import { FilterRequestDto } from './dto/filter-request.dto';

@ApiTags('CargoRequest')
@Controller('cargo-requests')
export class CargoRequestsController {
  constructor(private cargoRequestsService: CargoRequestsService) {}

  //@SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
  //@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createCargoRequest(
    @Body() model: CreateCargoRequestDto,
    @Req() req: Request,
  ): Promise<boolean> {
    return this.cargoRequestsService.createCargoRequest(
      model,
      //(req as any).user.id ?? 1,
    );
  }

  @Put('/:id')
  async updateCargoRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UpdateCargoRequestDto,
    @Req() req: Request,
  ): Promise<boolean> {
    return this.cargoRequestsService.updateCargoRequest(
      id,
      model,
      //(req as any).user.id ?? 1,
    );
  }

  //@SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
  //@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('')
  @ApiOkResponse({})
  async getOrders(
    @Req() request: Request,
    @Query() filterRequestDto: FilterRequestDto,
  ): Promise<[CargoRequest[], number]> {
    return await this.cargoRequestsService.getOrders(filterRequestDto);
  }

  //@SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
  //@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.cargoRequestsService.getById(id);
  }

  //@SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
  //@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/:id/:status')
  async setOrderStatus(@Param('id', ParseIntPipe) id: number, @Param('status') status: string): Promise<any> {
    return await this.cargoRequestsService.setOrderStatus(id, status);
  }

  @Delete(':/id')
  async deleteCargoRequest(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.cargoRequestsService.deleteCargoRequest(id);
  }
}
