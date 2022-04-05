import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return { token: this.generateToken(user), user };
  }

  async registration(userDto: CreateUserDto) {
    {
      const candidate = await this.userService.getUserByEmail(userDto.email);
      if (candidate)
        throw new HttpException(
          'Пользователь с таким email существует',
          HttpStatus.BAD_REQUEST,
        );
    }

    {
      const candidate = await this.userService.getUserByLogin(userDto.login);
      if (candidate)
        throw new HttpException(
          'Пользователь с таким login существует',
          HttpStatus.BAD_REQUEST,
        );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return { token: this.generateToken(user), user };
  }

  private generateToken(user: User) {
    const payload = { email: user.email, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Данного пользователя не существует',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл или пароль',
    });
  }
}
