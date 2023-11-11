import { Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
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
      relations: {
        profile: true,
        posts: true,
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
