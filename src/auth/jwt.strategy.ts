import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AccountService } from 'src/account/account.service';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  /**
   * Given the payload from a JWT token, return a Account. This method is used
   * by the JWTGuard to attached a Account to the request.
   */
  async validate(payload: { sub: string; username: string }) {
    return this.accountService.get(payload.sub);
  }
}
