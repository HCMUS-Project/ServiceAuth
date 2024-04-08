import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/core/decorator/role/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get the roles from the decorator
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        // throw an error if the user is not authenticated
        if (!request.headers?.authorization) {
            throw new BadRequestException('Authorization does not provided.');
        }
        // get the user from the request object
        const user: any = JwtService.prototype.decode(request.headers.authorization.split(' ')[1], {
            complete: true,
        });
        return requiredRoles.some(role => user.payload.roles?.includes(role));
    }
}
