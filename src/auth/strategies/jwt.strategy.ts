import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/schemas/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    if (!this.configService.get<string>('JWT_SECRET')) {
      throw new Error('JWT_SECRET не определен в конфигурации');
    }
  }

  private static extractJWT(req: {
    cookies: Record<string, string | null>;
  }): string | null {
    const tokenName = process.env.TOKEN_NAME || 'access_token';
    if (req?.cookies?.[tokenName]) {
      return req.cookies[tokenName];
    }
    return null;
  }

  validate(payload: JwtPayload): Pick<User, '_id' | 'email'> {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Неверный токен');
    }
    return { _id: payload.sub, email: payload.email };
  }
}
