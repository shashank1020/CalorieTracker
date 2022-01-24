import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import UserEntity from '../db/entity/user.entity';

export default class AppGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('------------------Can activate');
    const request = context.switchToHttp().getRequest();
    const userId = await this.decodeJwt(request?.headers?.jwt);
    if (userId) {
      let user: UserEntity;
      try {
        user = await UserEntity.findOne(userId);
      } catch (e) {}
      if (user) {
        request.user = user;
        console.log('USER', user);
        return true;
      } else throw new UnauthorizedException();
    } else throw new UnauthorizedException();
  }

  async decodeJwt(jwt) {
    console.log('jwt', jwt);
    try {
      //XXX.X.XXX
      return Number(jwt.split('.')[1]);
      // return Number(jwt) || null;
    } catch (e) {
      return null;
    }
  }
}
