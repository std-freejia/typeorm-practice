import { Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
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
    return this.userRepo.save({
      email: "zxqw@gmail.com"
    });
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
      // 조회할 프로퍼티를 지정 (default: 모든 프로퍼티를 조회. 지정한다면 지정한 것 만 조회.)
      select: {
        id: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        // profile 에서 가져올 컬럼을 명시할 수 있다 
        profile: { id: true }
      },
      // 필터링할 조건을 입력하게 된다 
      // where: { // where 내부에는 default로  AND 조건으로 묶인다 
      //   version: 1
      // },
      // where: [ // where 내부에서 or 조건 걸기: []배열 안에 {} 조건 object 나열  
      //   { id: 4 }, { version: 2 }, // where id = 4 or version = 2 ,
      //   {
      //     profile: { id: 3 }
      //   }
      // ],
      // 관계를 가져오기 
      relations: {
        profile: true,
      },
      order: {
        id: 'DESC',
      },
      skip: 0, // 처음 몇 개를 제외할 지 지정한다. (default: 0 제외 안 함)
      take: 0, // 가져올 레코드 개수 (default: 0 존재하는 레코드 전부 조회)
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
