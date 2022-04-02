import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A guard that attaches an Account entity to a request if the user is
 * authenticated
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
