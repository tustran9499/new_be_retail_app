import { HttpStatus, Injectable } from '@nestjs/common';
import fs = require('fs');
import path = require('path');
import { TOKEN_ROLE } from 'src/common/constants/token-role.enum';
import * as handlebars from 'handlebars';
import { customThrowError } from 'src/common/helper/throw.helper';

@Injectable()
export class TemplatesService {
  MAIL_FOOTER: string;
  constructor() {
    this.MAIL_FOOTER = `https://warehouse-retail.herokuapp.com/images/footer.jpg`;
  }
  getResource(
    template: string,
    host?: string,
    nickname?: string,
    role?: TOKEN_ROLE,
  ): any {
    const pathDir = path.join(__dirname, '../../../templates');
    if (!fs.existsSync(`${pathDir}\\${template}`)) {
      customThrowError('Resource not found!', HttpStatus.NOT_FOUND);
    }
    const footer = fs
      .readFileSync(`${pathDir}\\footer.html`, 'utf8')
      .toString();
    const data = footer.replace('{{footer}}', this.MAIL_FOOTER);
    handlebars.registerPartial('footer', data);
    const templates = fs.readFileSync(`${pathDir}\\${template}`).toString();
    return templates;
  }
}
