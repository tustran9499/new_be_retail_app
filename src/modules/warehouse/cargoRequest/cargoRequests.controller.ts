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

  @Get('/fulltimeseries')
  @ApiOkResponse()
  getTimeSeriesSale(): Promise<any> {
    return this.CargoRequestsService.getFullTimeSeriesSale();
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get()
  @ApiOkResponse()
  getProducts(): Promise<any> {
    return this.CargoRequestsService.findAll();
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/paginateProducts')
  async index(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.CargoRequestsService.paginate({
      page,
      limit,
      route: '/api/products/paginateProducts',
    });
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck', 'StoreWarehouseManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/searchProducts')
  async search(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('key') key: string = '',
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.CargoRequestsService.searchProduct(key, {
      page,
      limit,
      route: '/api/products/searchProducts',
    });
  }

  @SetMetadata('roles', ['StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createProduct(@Body() model: CreateProductDto): Promise<Product> {
    return this.CargoRequestsService.createProduct(model);
  }

  @SetMetadata('roles', ['StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UpdateProductDto,
  ): Promise<Product> {
    return this.CargoRequestsService.updateProduct(id, model);
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/:id')
  @ApiOkResponse()
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.CargoRequestsService.findOne(id);
  }

  @SetMetadata('roles', ['StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Delete('/:id')
  @ApiOkResponse()
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.CargoRequestsService.deleteProduct(id);
  }
}
