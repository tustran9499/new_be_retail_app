import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
var http = require("http");
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @Cron('0 */5 * * * *')
  handleCron() {
    http.get("http://warehouse-retail.herokuapp.com");
  }

  getHello(): string {
    return 'Hello World!';
  }
}
