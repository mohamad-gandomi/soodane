import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // If client sent an Authorization header, try extracting the user optionally
      const request = context.switchToHttp().getRequest();
      if (request.headers?.authorization) {
        return super.canActivate(context);
      }
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // For public routes, if authentication fails or token is missing, don't throw; return null
    if (isPublic && (err || !user)) {
      return null;
    }

    if (err || !user) {
      throw err || new UnauthorizedException('لطفاً ابتدا وارد حساب کاربری خود شوید.');
    }

    return user;
  }
}
