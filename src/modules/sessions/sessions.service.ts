import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Session } from 'src/entities/session/session.entity';
import { CreateSessionDto } from 'src/dto/session/CreateSession.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { Account } from '../../entities/account/account.entity';
import { AccountsService } from '../account/accounts.service';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session) private sessionsRepository: Repository<Session>,
        private accountService: AccountsService,
    ) { }

    async createSession(model: CreateSessionDto): Promise<Session> {
        try {
            const result = await this.sessionsRepository.save(model);
            const real_result = await this.sessionsRepository.findOne(result.SessionId);
            return real_result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async endSession(sessionId: string, id: number): Promise<Session> {
        try {
            const result = await this.sessionsRepository.findOne(sessionId);
            if (result.SaleclerkId == id) {
                const real_result = await this.sessionsRepository.save({ ...result, End: new Date(Date.now()), SessionId: sessionId });
                return real_result;
            }
            else {
                customThrowError("Invalid saleclerk id!", HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async getCashierSession(id: number): Promise<any> {
        try {
            const result = await this.accountService.findOneById(id);
            console.log(result);
            let sessionResult = undefined;
            if (result.Type != 'Salescleck') {
                customThrowError("Invalid saleclerk id!", HttpStatus.BAD_REQUEST);
            }
            else {
                sessionResult = await this.sessionsRepository.findOne({
                    where: { SaleclerkId: result.Id, Start: Not(IsNull()), End: IsNull() },
                })
            }
            return { Salesclerk: result, Session: sessionResult }
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
