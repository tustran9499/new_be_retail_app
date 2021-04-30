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

    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/past')
    async getPastSessions(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Request() req
    ): Promise<Pagination<Session>> {
        return this.SessionsService.getCashierPastSessions(req.user.userId, {
            page,
            limit,
            route: '/api/sessions/past',
        });
    }

}
