/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@sendgrid/mail";
import { customThrowError } from "./throw.helper";
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from "../constants/response-messages.enum";
import { TOKEN_ROLE } from "../constants/token-role.enum";
import * as handlebars from "handlebars";
import { TemplatesService } from "../modules/email-templates/template.service";

const EMAIL_SUBJECT = {
  VERIFY_EMAIL: "Please verify your email",
  VERIFY_CHANGE_PASSWORD: "Request to reset password",
  VERIFY_CHANGE_EMAIL: "Request to change email",
  VERIFIED_EMAIL: "Your account has been verified",
  WELCOME_EMAIL: "Welcome to Retail System",
  PASSWORD_CHANGED: "Password Changed!",
  TEST: "Test email",
  FORGOT_PASSWORD: "Forgot password mail",
  EMAIL_WELCOME: "Congratulation! Your account have been register successfully",
  SET_PASSWORD: "Set your own password",
};

@Injectable()
export class MailHelper {
  mailService: MailService = new MailService();
  PREFIX_EMAIL_SUBJECT = "";
  from: string;
  to: string;
  frontendHost: string;
  adminFront: string;
  MAIL_FOOTER: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly templatesService: TemplatesService
  ) {
    this.mailService.setApiKey(
      "SG.IgV3UG9XQa2HSqTLz5PueQ.zTkd-jo_g6NHMvKVThmyIAWZb8zTQoikz1fQUVxbLGEE"
    );
    this.from = "kngan30399@gmail.com";
    this.to = "";
    this.frontendHost = "https://retailsystem.herokuapp.com/";
    this.MAIL_FOOTER = `https://warehouse-retail.herokuapp.com/images/footer.jpg`;
  }

  sendVerifyEmail(
    email: string,
    token: string,
    role: TOKEN_ROLE,
    nickname: string
  ): void {
    try {
      const host = this.frontendHost;
      const subject = EMAIL_SUBJECT.VERIFY_EMAIL;
      const templates = this.templatesService.getResource(
        "verify.html",
        host,
        nickname,
        role
      );
      const data = {
        nickname: nickname,
        hyperlink: host + "/account/verify-email/" + token,
      };
      const compileTemplate = handlebars.compile(templates);
      const finalPageHTML = compileTemplate(data);
      this.mailService
        .send({
          from: "kngan30399@gmail.com",
          to: email,
          subject: `${subject}`,
          html: finalPageHTML,
        })
        .then(() => {
          console.log("Verify mail sent");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        error
      );
    }
  }

  sendVerifiedEmail(
    email: string,
    token: string,
    role: TOKEN_ROLE,
    nickname: string
  ): void {
    try {
      const host = this.frontendHost;
      const subject = EMAIL_SUBJECT.VERIFIED_EMAIL;
      const templates = this.templatesService.getResource(
        "verified.html",
        host,
        nickname,
        role
      );
      const data = {
        nickname: nickname,
      };
      const compileTemplate = handlebars.compile(templates);
      const finalPageHTML = compileTemplate(data);
      this.mailService
        .send({
          from: "kngan30399@gmail.com",
          to: email,
          subject: `${subject}`,
          html: finalPageHTML,
        })
        .then(() => {
          console.log("Verified mail sent");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        error
      );
    }
  }

  sendWelcomeMail(email: string, role: TOKEN_ROLE, nickname: string): void {
    try {
      const host = this.frontendHost;
      const subject = EMAIL_SUBJECT.WELCOME_EMAIL;
      const templates = this.templatesService.getResource(
        "welcome.html",
        host,
        nickname,
        role
      );
      const data = {
        nickname: nickname,
      };
      const compileTemplate = handlebars.compile(templates);
      const finalPageHTML = compileTemplate(data);
      this.mailService
        .send({
          from: "kngan30399@gmail.com",
          to: email,
          subject: `${this.PREFIX_EMAIL_SUBJECT}${subject}`,
          html: finalPageHTML,
        })
        .then(() => {
          console.log("Welcome mail sent");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        error
      );
    }
  }

  sendTestEmail(): void {
    try {
      this.mailService
        .send({
          from: "kngan30399@gmail.com",
          to: "ngan.le.bku@hcmut.edu.vn",
          subject: EMAIL_SUBJECT.TEST,
          text: "hello plain text",
          html: "<h1>Hello from the other side</h1>",
        })
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log("bahahh");
      customThrowError("test email failed", -5);
    }
  }
}
