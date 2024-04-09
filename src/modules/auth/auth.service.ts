import { uuid } from '@libs/constants/uuid.constant';
import { RefreshTokenDto, SignInDto, SignUpDto } from '@libs/dtos/auth';
import { AccessTokenAndRefreshTokenDto } from '@libs/dtos/common';
import { UserEntity } from '@libs/entities/user/user.entity';
import { UserAuthModel } from '@libs/models/active-user-data.model';
import { UpdateResultModel } from '@libs/models/update-result.model';
import { PrismaService } from '@libs/modules/prisma';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { jwtConfig } from 'src/app/config/jwt.config';
import { HashingService } from './hashing/hashing.service';
import { InvalidatedRefreshTokenError } from './refresh-token-ids-storage/invalidated-refresh-token-error.storage';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _hashingService: HashingService,
    private readonly _jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
    private readonly _refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UpdateResultModel> {
    try {
      let user: UserEntity = new UserEntity();
      user.password = await this._hashingService.hash(signUpDto.password + this._jwtConfig.pepper);
      user.username = signUpDto.username;
      // user = await this._prisma.user.create({ data: signUpDto as Prisma.UserCreateInput });
      return { status: !!user };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      else throw new ConflictException('User with this credentials already exists');
    }
  }

  async signIn(signInDto: SignInDto): Promise<AccessTokenAndRefreshTokenDto> {
    // const user = await this._userRepository.findOneBy({
    //   username: signInDto.username,
    // });
    // if (!user) {
    //   throw new UnauthorizedException('User does not exists');
    // }
    // const isEqual = await this._hashingService.compare(
    //   signInDto.password + this._jwtConfig.pepper,
    //   user.password,
    // );
    // if (!isEqual) {
    //   throw new UnauthorizedException('Password does not match');
    // }
    // return this.generateTokens(user);
    return;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AccessTokenAndRefreshTokenDto> {
    try {
      const { sub, refreshTokenId } = await this._jwtService.verifyAsync<
        Pick<UserAuthModel, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this._jwtConfig.secret,
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
      });
      // const user: UserEntity = await this._userRepository.findOneByOrFail({
      //   id: sub,
      // });
      // const isValid: boolean = await this._refreshTokenIdsStorage.validate(user.id, refreshTokenId);
      // if (isValid) {
      //   await this._refreshTokenIdsStorage.invalidate(user.id);
      // } else {
      //   throw new Error('Invalid refresh token');
      // }
      // return this.generateTokens(user);
      return;
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied (Token compromised?)');
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: UserEntity): Promise<AccessTokenAndRefreshTokenDto> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this._signToken<Partial<UserAuthModel>>(user.id, this._jwtConfig.accessTokenTtl, {
        // todo HERE
        // role: user.role.,
        username: user.username,
      }),
      this._signToken(user.id, this._jwtConfig.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this._refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken };
  }

  private async _signToken<T>(userId: uuid, expiresIn: number, payload?: T) {
    return await this._jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
        secret: this._jwtConfig.secret,
        expiresIn,
      },
    );
  }
}
