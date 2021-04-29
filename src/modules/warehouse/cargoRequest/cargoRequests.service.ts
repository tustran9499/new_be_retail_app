import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { AccountsService } from 'src/modules/account/accounts.service';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';

@Injectable()
export class CargoRequestsService {
    constructor(
        @InjectRepository(CargoRequest) private cargoRequestsRepository: Repository<CargoRequest>,
        private accountService: AccountsService,
    ) { }

    async createCargoRequest(model: any): Promise<CargoRequest> {
        try {
            const result = await this.cargoRequestsRepository.save(model);
            const real_result = await this.cargoRequestsRepository.findOne(result.SessionId);
            return real_result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    
}
