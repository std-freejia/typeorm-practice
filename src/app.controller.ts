import { Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>
  ) { }

  @Post('users')
  postUser() {
    return this.userRepo.save({ title: 'hello' });
  }
  @Get('users')
  getUsers() {
    return this.userRepo.find({});// 전부 반환 
    /*  return this.userRepo.find({
        select: { // 가져올 컬럼만 true 
          id: true,
          title: true,
          version: true,
        }
      }); */
  }
  @Patch('users/:id')
  async patchUser(
    @Param('id') id: string
  ) {
    const user = await this.userRepo.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      throw new NotFoundException('입력하신 아이디의 사용자가 없습니다. ')
    }

    return await this.userRepo.save({
      ...user,
      title: user.title + '0',
    })

  }
}
