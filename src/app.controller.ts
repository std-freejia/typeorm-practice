import { Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Between, Equal, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepo: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepo: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepo: Repository<TagModel>,
  ) { }

  @Post('users')
  async postUser() {
    await this.userRepo.save({
      email: `user-sample@google.com`,
    })
  }
  @Get('users')
  getUsers() {
    return this.userRepo.find({
      where: {
        // id: Not(1),             // 아닌 경우 
        // id: LessThan(3),        // 미만 
        // id: LessThanOrEqual(3)  // 이하 
        // id: MoreThan(5),        // 초과 
        // id: MoreThanOrEqual(5), // 이상  
        // id: Equal(5),           // 동일
        // email: Like('%google%'),  // 유사 문자열 Like는 대소문자를 구분한다
        // email: ILike('%GOOGLE%')   // 유사 문자열. ILike 대소문자를 구분 안 함 
        // id: Between(10, 15),       // 이상,이하 사이값 
        // id: In([2, 4, 6]),         // 특정 값 배열을 지정  
        // email: IsNull()            //  email 이 null 인 경우 
      }
    })
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepo.save({
      email: 'postuser@gmail.com',
    })

    const post = await this.postRepo.save({
      title: 'post1',
      author: user,
    })

    await this.postRepo.save({
      title: 'post2',
      author: user,
    })

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() { // N:N 관계인 posts 와 tags 레코드를 생성하고, 참조를 추가하자. 

    const post1 = await this.postRepo.save({
      title: 'tag first',
    });
    const post2 = await this.postRepo.save({
      title: 'tag second',
    });

    const tag1 = await this.tagRepo.save({
      name: 'Javascript',
      posts: [post1, post2],
    })
    const tag2 = await this.tagRepo.save({
      name: 'Typescript',
      posts: [post1],
    })

    const post3 = await this.postRepo.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });
  }

  @Get('posts')
  getPosts() {
    return this.postRepo.find({
      relations: {
        tags: true,
      }
    })
  }

  @Get('tags')
  getTags() {
    return this.tagRepo.find({
      relations: {
        posts: true,
      }
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
      email: user.email + '0',
    })
  }

  @Delete('user/profile/:id')
  async deleteProfile(
    @Param('id') id: string,
  ) {
    await this.profileRepo.delete(Number(id));
  }

  @Post('user/profile')
  async createUserAndProfile() {
    // user 를 저장할 때, profile 도 생성해서 같이 저장해보자. 
    const user = await this.userRepo.save({
      email: 'sample@gmail.com',
      profile: { // user entity의 cascade: true 옵션 지정 해줘야 함.
        profileImg: 'abc.jpg',
      }
    })

    // const user = await this.userRepo.save({
    //   email: 'sample@gmail.com'
    // })

    // await this.profileRepo.save({
    //   profileImg: 'sampleImg',
    //   user,
    // })

    return user;
  }
}
