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
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { CreateProductDto } from 'src/dto/product/CreateProduct.dto';
import { UpdateProductDto } from 'src/dto/product/UpdateProduct.dto.';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  csvFileFilter,
  imageFileFilter,
} from '../../common/helper/helper';
import { CategoriesService } from '../categories/categories.service';
import { Category } from 'src/entities/product/category.entity';
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const sharp = require('sharp');

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  constructor(private ProductsService: ProductsService) { }

  @Get('/fulltimeseries')
  @ApiOkResponse()
  getFullTimeSeriesSale(): Promise<any> {
    return this.ProductsService.getFullTimeSeriesSale();
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/timeseries/:id')
  @ApiOkResponse()
  getTimeSeriesSale(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<any> {
    return this.ProductsService.getTimeSeriesSale(req.user.userId, id);
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager', 'StoreStaff', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/categories')
  @ApiOkResponse()
  getAllCategories(): Promise<Category[]> {
    return this.ProductsService.findAllCategories();
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get()
  @ApiOkResponse()
  getProducts(): Promise<any> {
    return this.ProductsService.findAll();
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/paginateProducts')
  async index(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.ProductsService.paginate({
      page,
      limit,
      route: '/api/products/paginateProducts',
    });
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager', 'StoreStaff', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/searchProducts')
  async search(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('key') key: string = '',
    @Request() req,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.ProductsService.searchProduct(req.user.userId, key, {
      page,
      limit,
      route: '/api/products/searchProducts',
    });
  }

  @SetMetadata('roles', ['StoreManager', 'StoreStaff'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/searchNotAddedProducts')
  async searchAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('key') key: string = '',
    @Request() req,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.ProductsService.searchNotAddedProduct(req.user.userId, key, {
      page,
      limit,
      route: '/api/products/searchNotAddedProducts',
    });
  }

  @SetMetadata('roles', ['StoresManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createProduct(@Body() model: CreateProductDto): Promise<Product> {
    return this.ProductsService.createProduct(model);
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager', 'StoreStaff'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Put('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UpdateProductDto,
    @Request() req,
  ): Promise<Product> {
    if (req.user.role == 'StoresManager') {
      return this.ProductsService.updateProductByAdmin(req.user.userId, id, model);
    }
    else {
      return this.ProductsService.updateProductByStore(req.user.userId, id, model);
    }
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/:id')
  @ApiOkResponse()
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.ProductsService.findOne(id);
  }

  @SetMetadata('roles', ['StoresManager', 'StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Delete('/:id')
  @ApiOkResponse()
  deleteProduct(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<any> {
    return this.ProductsService.deleteProduct(req.user.userId, id);
  }

  @SetMetadata('roles', ['StoresManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post('/avatar/:id')
  @UseInterceptors(
    // AmazonS3FileInterceptor('file', {
    //   resizeMultiple: [
    //     { suffix: 'sm', width: 200, height: 200 },
    //     { suffix: 'md', width: 300, height: 300 },
    //     { suffix: 'lg', width: 400, height: 400 },
    //   ],
    // }),
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async importUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req1,
    @UploadedFile() file,
  ) {
    try {
      sharp(req1.file.path)
        .resize(50, 50)
        .toFile(
          `./files/` + 'thumbnails-' + req1.file.filename,
          (err, resizeImage) => {
            if (err) {
              console.log(err);
            } else {
              console.log(resizeImage);
            }
          },
        );
    } catch (error) {
      console.error(error);
    }
    const productdata = await this.ProductsService.findOne(id);
    console.log(file.filename);
    this.ProductsService.updateProductImg(id, file.filename);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    if (productdata.PhotoURL !== null) {
      unlinkAsync(`./files` + `/${productdata.PhotoURL}`);
      unlinkAsync(`./files/` + 'thumbnails-' + `${productdata.PhotoURL}`);
    }
    return response;
    // return this.service.importServer(file)
  }

  @Get('/img/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @Get('/img/thumbnails/:imgpath')
  seeThumbFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(`thumbnails-${image}`, { root: './files' });
  }

  @SetMetadata('roles', ['StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post('barcode/:id/:code')
  @ApiOkResponse()
  addBarcode(
    @Param('id', ParseIntPipe) id: number,
    @Param('code') code: string,
  ): Promise<any> {
    return this.ProductsService.addBarcode(id, code);
  }
}
