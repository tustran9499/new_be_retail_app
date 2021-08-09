import { Controller, Post, Param, ParseIntPipe, SetMetadata, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreproductsService } from './storeproducts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@ApiTags('StoreProducts')
@Controller('storeproducts')
export class StoreproductsController {
    constructor(private StoreproductsService: StoreproductsService) { }

    @SetMetadata('roles', ['StoreManager', 'StoreWarehouseManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post('/:id')
    async addProductToStore(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<any> {
        return this.StoreproductsService.addProductToStore(id, req.user.userId);
    }
}
