import { Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepo: Repository<ProfileModel>
  ) { }

  @Post('users')
  postUser() {
    return this.userRepo.save({});
  }
  @Get('users')
  getUsers() {
    // return this.userRepo.find({});// 전부 반환 
    /*  return this.userRepo.find({
        select: { // 가져올 컬럼만 true 
          id: true,
          title: true,
          version: true,
        }
      }); */

    // relation 까지 함께 조회 
    return this.userRepo.find({
      relations: { profile: true }
    })
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
      // title: user.title + '0',
    })
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepo.save({
      email: 'sample@gmail.com'
    })

    await this.profileRepo.save({
      profileImg: 'sampleImg',
      user,
    })

    return user;
  }
}
