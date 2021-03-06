import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Session } from 'src/entities/session/session.entity';
import { CreateSessionDto } from 'src/dto/session/CreateSession.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { Account } from '../../entities/account/account.entity';
import { AccountsService } from '../account/accounts.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
    private accountService: AccountsService,
  ) { }

  findOne(id: string): Promise<Session> {
    return this.sessionsRepository.findOne(id);
  }

  async createSession(model: CreateSessionDto): Promise<Session> {
    try {
      const cashier = await this.accountService.findOneById(model.SaleclerkId);
      if (cashier) {
        // const allSessions = await this.sessionsRepository.find();
        // for (let oldsession of allSessions) {
        //   const storeId = await this.accountService.findOneById(oldsession.SaleclerkId);
        //   if (storeId && storeId.StoreId) {
        //     await this.sessionsRepository.save({ ...oldsession, StoreId: storeId.StoreId });
        //   }
        // }
        const result = await this.sessionsRepository.save({ SaleclerkId: model.SaleclerkId, StoreId: cashier.StoreId });
        const real_result = await this.sessionsRepository.findOne(result.SessionId);
        return real_result;
      }
      else {
        customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, "Account not found!");
      }
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async endSession(sessionId: string, id: number): Promise<Session> {
    try {
      const result = await this.sessionsRepository.findOne(sessionId);
      if (result.SaleclerkId == id) {
        const real_result = await this.sessionsRepository.save({
          ...result,
          End: new Date(Date.now()),
          SessionId: sessionId,
        });
        return real_result;
      } else {
        customThrowError('Invalid saleclerk id!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getCashierSession(id: number): Promise<any> {
    try {
      const result = await this.accountService.findOneById(id);
      let sessionResult = undefined;
      if (result.Type != 'Salescleck') {
        customThrowError('Invalid saleclerk id!', HttpStatus.BAD_REQUEST);
      } else {
        sessionResult = await this.sessionsRepository.findOne({
          where: {
            SaleclerkId: result.Id,
            Start: Not(IsNull()),
            End: IsNull(),
          },
        });
      }
      return { Salesclerk: result, Session: sessionResult };
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async checkCashierSession(id: number): Promise<any> {
    const result = await this.accountService.findOneById(id);
    const sessionResult = await this.sessionsRepository.findOne({
      where: {
        SaleclerkId: result.Id,
        Start: Not(IsNull()),
        End: IsNull(),
      },
    });
    console.log("session")
    console.log(sessionResult)
    return sessionResult;
  }

  async getCashierPastSessions(id: number, options: IPaginationOptions): Promise<Pagination<Session>> {
    try {
      const result = await this.accountService.findOneById(id);
      let queryBuilder = undefined;
      if (result.Type == 'Salescleck') {
        queryBuilder = this.sessionsRepository.createQueryBuilder('sessions').leftJoinAndSelect("sessions.Account", "Account").where({ SaleclerkId: result.Id }).orderBy('sessions.End', 'ASC');
      }
      else {
        customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, "Invalid salescleck identifier");
      }
      return paginate<Session>(queryBuilder, options);
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getAllCashiers(req: any): Promise<any> {
    try {
      if (req.user.role == "Salescleck") {
        return [await this.accountService.findOneById(req.user.userId)];
      }
      else {
        return await this.accountService.findAllCashierOfStoreManager(req.user.userId);
      }
    }
    catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getPastSessionSum(id: string): Promise<any> {
    try {
      const data = await this.sessionsRepository.query("GetPastSessionSum @SessionId=\'" + id + "\'");
      return data;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getAllStoreByUser(id: number): Promise<any> {
    const result = await this.sessionsRepository
      .createQueryBuilder("sessions")
      .select("StoreId")
      .where({
        SaleclerkId: id
      })
      .andWhere("sessions.StoreId IS NOT NULL")
      .distinct(true)
      .getRawAndEntities();
    var lst = [];
    result.raw.map((item) => {
      lst.push(item.StoreId);
    });
    return lst;
  }

  async getAllStorePastSessionSum(id: number): Promise<any> {
    try {
      const storeIds = await this.getAllStoreByUser(id);
      var lst = [];
      for (let storeId of storeIds) {
        const data = await this.sessionsRepository.query("GetPastSessionStore @StoreId=" + storeId + ", @CashierId=" + id);
        lst.push({ StoreId: storeId, FinalTotal: data[0].FinalTotal });
      }
      return lst;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getPastSessionSumCash(id: string): Promise<any> {
    try {
      const data = await this.sessionsRepository.query("GetPastSessionSumCash @SessionId=\'" + id + "\'");
      return data;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getPastSessionSumCredit(id: string): Promise<any> {
    try {
      const data = await this.sessionsRepository.query("GetPastSessionSumCredit @SessionId=\'" + id + "\'");
      return data;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getPastSessionSumVnpay(id: string): Promise<any> {
    try {
      const data = await this.sessionsRepository.query("GetPastSessionSumVnpay @SessionId=\'" + id + "\'");
      return data;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }
}
