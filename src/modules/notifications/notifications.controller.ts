import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserNotification } from 'src/entities/notification/notification.entity';

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
}
