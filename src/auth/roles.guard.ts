import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    // canActivate(
    //     context: ExecutionContext,
    // ): boolean | Promise<boolean> | Observable<boolean> {
    //     const request = context.switchToHttp().getRequest();
    //     return true;
    // }
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const ctxToken = context.switchToHttp().getRequest().rawHeaders[1];
        // const payload = jwtDecode(ctxToken);
        // if (!payload.role) {
        //     return;
        // }
        // return matchRoles(roles, payload.role);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return roles.includes(user.role);
    }
}