import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    user.roles = ['USER'];
    user.save();
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user;
  }

  async getUserByLogin(login: string) {
    const user = await this.userModel.findOne({
      login: login,
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userModel.findById(dto.userId);
    const role = dto.value;

    if (user.roles.includes(role))
      throw new HttpException('Данная роль уже есть', HttpStatus.FORBIDDEN);

    if (role && user) {
      await user.roles.push(role);
      await user.save();
      return user;
    }

    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async ban(dto: BanUserDto) {
    const user = await this.userModel.findById(dto.user);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }

}
