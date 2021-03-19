import { Query } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RESPONSE_EXPLAINATION } from 'src/common/constants/response-messages.enum';
import { AccountService } from './account.service';
import { GetRequest } from './dto/GetRequest.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }
    @Get()
    @ApiOkResponse({ description: RESPONSE_EXPLAINATION.TEST})
    getCustomers(@Query() model: GetRequest): Promise<any> {
    //return this.accountService.getCustomers(model);
        return this.accountService.findAll();
  }
}
