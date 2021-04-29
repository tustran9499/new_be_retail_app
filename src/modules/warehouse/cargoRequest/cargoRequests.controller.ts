import { Controller, Get, Param, ParseIntPipe, Query, SetMetadata, UseGuards, Post, Body, Put, Delete, UseInterceptors, Res, Request, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('CargoRequest')
@Controller('cargo-requests')
export class CargoRequestsController {
    constructor(private CargoRequestsService: CargoRequestsService) { }

    // @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    // @Post()
    // async createCargoRequest(
    //     @Request() req
    // ): Promise<CargoRequest> {
    //     return this.CargoRequestsService.createCargoRequest({ SaleclerkId: req.user.userId });
    // }
}
