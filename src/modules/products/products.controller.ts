import { Controller, Get, Param, ParseIntPipe, Query, SetMetadata, UseGuards, Post, Body, Put, Delete, UseInterceptors, Res, Request, UploadedFile } from '@nestjs/common';
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
import { editFileName, csvFileFilter, imageFileFilter } from '../../common/helper/helper';
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const sharp = require('sharp');

@ApiTags('Product')
@Controller('products')
export class ProductsController {
    constructor(private ProductsService: ProductsService) { }

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
            route: 'http://localhost:4000/api/products/allProducts',
        });
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/searchProducts')
    async search(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Query('key') key: string = "",
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.ProductsService.searchProduct(key,
            {
                page,
                limit,
                route: 'http://localhost:4000/api/products/allProducts',
            });
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createProduct(
        @Body() model: CreateProductDto,
    ): Promise<Product> {
        return this.ProductsService.createProduct(model);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Put('/:id')
    async updateProduct(@Param('id', ParseIntPipe) id: number,
        @Body() model: UpdateProductDto,
    ): Promise<Product> {
        return this.ProductsService.updateProduct(id, model);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/:id')
    @ApiOkResponse()
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.findOne(id);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Delete('/:id')
    @ApiOkResponse()
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.deleteProduct(id);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
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
    async importUser(@Param('id', ParseIntPipe) id: number, @Request() req1, @UploadedFile() file) {
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
        console.log(file.filename)
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

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/img/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './files' });
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/img/thumbnails/:imgpath')
    seeThumbFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(`thumbnails-${image}`, { root: './files' });
    }
}
