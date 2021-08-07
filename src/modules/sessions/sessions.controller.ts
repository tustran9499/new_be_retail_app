import { Controller, Get, Param, ParseIntPipe, Query, SetMetadata, UseGuards, Post, Body, Put, Delete, UseInterceptors, Res, Request, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { Session } from 'src/entities/session/session.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Session')
@Controller('sessions')
export class SessionsController {
    constructor(private SessionsService: SessionsService) { }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createSession(
        @Request() req
    ): Promise<Session> {
        return this.SessionsService.createSession({ SaleclerkId: req.user.userId });
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/past')
    async getPastSessions(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Query('id', ParseIntPipe) id: number,
        @Request() req
    ): Promise<Pagination<Session>> {
        if (req.user.role == "Salescleck") {
            return this.SessionsService.getCashierPastSessions(req.user.userId, {
                page,
                limit,
                route: '/api/sessions/past',
            });
        }
        else {
            return this.SessionsService.getCashierPastSessions(id, {
                page,
                limit,
                route: '/api/sessions/past',
            });
        }
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/multistores')
    async getPastSessionSumByStores(
        @Query('id', ParseIntPipe) id: number,
        @Request() req
    ): Promise<Pagination<Session>> {
        if (req.user.role == "Salescleck") {
            return this.SessionsService.getAllStorePastSessionSum(req.user.userId);
        }
        else {
            return this.SessionsService.getAllStorePastSessionSum(id);
        }
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/allCashiers')
    async getAllCashiers(
        @Request() req
    ): Promise<Pagination<Session>> {
        return await this.SessionsService.getAllCashiers(req);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get(('/:SessionId'))
    async getSessionDetail(
        @Param('SessionId', ParseUUIDPipe) SessionId: string,
        @Request() req
    ): Promise<any> {
        const data = await this.SessionsService.findOne(SessionId);
        const total = await this.SessionsService.getPastSessionSum(SessionId);
        const totalCash = await this.SessionsService.getPastSessionSumCash(SessionId);
        const totalCredit = await this.SessionsService.getPastSessionSumCredit(SessionId);
        const totalVnpay = await this.SessionsService.getPastSessionSumVnpay(SessionId);
        return { data, total, totalCash, totalCredit, totalVnpay };
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post(('/:SessionId'))
    async endSession(
        @Param('SessionId', ParseUUIDPipe) SessionId: string,
        @Request() req
    ): Promise<Session> {
        return this.SessionsService.endSession(SessionId, req.user.userId);
    }

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get()
    async getCashierSession(
        @Request() req
    ): Promise<Session> {
        return this.SessionsService.getCashierSession(req.user.userId);
    }

}
