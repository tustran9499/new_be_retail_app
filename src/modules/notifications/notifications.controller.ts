import { Controller, UseGuards, Get, Request, Query, ParseIntPipe, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserNotification } from 'src/entities/notification/notification.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly usernotificationsService: NotificationsService) { }

    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/all')
    async getNotifications(
        @Request() req
    ): Promise<UserNotification[]> {
        return this.usernotificationsService.getNotifications(req.user.userId);
    }

    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/count')
    async countNotifications(
        @Request() req
    ): Promise<number> {
        return this.usernotificationsService.countNotifications(req.user.userId);
    }

    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/read/:id')
    async markAsRead(
        @Param("id", ParseIntPipe) id: number,
    ): Promise<boolean> {
        return this.usernotificationsService.markAsRead(id);
    }

    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/pagination')
    async getNotificationsPagination(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 5,
        @Request() req
    ): Promise<Pagination<UserNotification>> {
        return this.usernotificationsService.getNotificationsPagination(req.user.userId, {
            page,
            limit,
            route: '/api/notifications/pagination',
        });
    }
}
