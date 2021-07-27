import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('Auth')
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SetMetadata('roles', ['StoreManager'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
