import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import UserEntity from '../db/entity/user.entity';

export default class AppGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = await this.decodeJwt(request?.headers?.jwt);
    if (userId) {
      let user: UserEntity;
      try {
        user = await UserEntity.findOne(userId);
      } catch (e) {}
      if (user) {
        request.user = user;
        return true;
      } else throw new UnauthorizedException();
    } else throw new UnauthorizedException();
  }

  async decodeJwt(jwt) {
    try {
      return Number(jwt) || null;
    } catch (e) {
      return null;
    }
  }
}
