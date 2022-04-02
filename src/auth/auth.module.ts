import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from 'src/account/account.module';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Maintain user Authorization and Authentication
 */
@Module({
  imports: [
    forwardRef(() => AccountModule),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Auth]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
