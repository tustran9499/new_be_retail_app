import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { UserNotification } from 'src/entities/notification/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsService } from '../account/accounts.service';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Cron, Interval } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(UserNotification)
        private usernotificationsRepository: Repository<UserNotification>,
        private accountService: AccountsService,
        private productService: ProductsService,
        private sessionService: SessionsService,
    ) { }

    private readonly logger = new Logger(NotificationsService.name);

    @Cron('45 * * * * *')
    handleCron() {
        this.logger.debug('Called when the current second is 45');
    }

    @Cron('45 * * * * *')
    async handleSalePredictCron() {
        this.logger.debug('Called');
        const storeIds = await this.accountService.getAllStore();
        for (let storeId of storeIds) {
            const message = await this.productService.getAllProductMessagesInNeed(storeId);
            console.log(message)
            if (message && (message.length > 0)) {
                const storeProductManagerIds = await this.accountService.getStoreProductManager(storeId);
                storeProductManagerIds.map((storeProductManagerId) => {
                    this.usernotificationsRepository.save({
                        'Title': 'Warning: Some product is going to run out soon!',
                        'Message': '; Item Id: ' + message.join('; Item Id: '),
                        'AccountId': storeProductManagerId,
                        'CreatedAt': new Date(),
                        'IsRead': false
                    })
                })
            }
        }
    }

    // @Cron('0 30 11 * * 1-5')
    // async handleSessionCron() {
    //     const cashierIds = await this.accountService.getAllSalesclerks();
    //     cashierIds.map(async (cashierId) => {
    //         const session = await this.sessionService.checkCashierSession(cashierId);
    //         if (session) {
    //             this.usernotificationsRepository.save({
    //                 'Title': 'May be you have forgot to end today session!',
    //                 'Message': 'Session Id:' + session.SessionId,
    //                 'AccountId': cashierId,
    //                 'CreatedAt': new Date(),
    //                 'IsRead': false
    //             })
    //         }
    //     });
    // }

    async getNotifications(id: number): Promise<UserNotification[]> {
        try {
            return await this.usernotificationsRepository.find({ where: { AccountId: id }, order: { CreatedAt: 'DESC', } });
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async countNotifications(id: number): Promise<number> {
        try {
            return await this.usernotificationsRepository.createQueryBuilder('notifications').select("COUNT(notifications.message)", "count").where({ AccountId: id }).getRawOne();
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
