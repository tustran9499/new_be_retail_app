import { Injectable, HttpStatus } from '@nestjs/common';
import { UserNotification } from 'src/entities/notification/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsService } from '../account/accounts.service';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(UserNotification)
        private usernotificationsRepository: Repository<UserNotification>,
        private accountService: AccountsService,
    ) { }

    async getNotifications(id: number): Promise<UserNotification[]> {
        try {
            return this.usernotificationsRepository.find({ where: { AccountId: id }, order: { CreatedAt: 'DESC', } });
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async getNotificationsPagination(id: number, options: IPaginationOptions): Promise<Pagination<UserNotification>> {
        try {
            let queryBuilder = this.usernotificationsRepository.createQueryBuilder('notifications').where({ AccountId: id }).orderBy('notifications.CreatedAt', 'DESC');
            return paginate<UserNotification>(queryBuilder, options);
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
