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

  @Post('sample')
  async sample() {
    // create: 모델에 해당되는 객체 생성 - DB저장은 안 함. 
    // const user1 = this.userRepo.create({
    //   email: 'test@codefactory.ai',
    // })
    // save: 저장 
    // const user2 = this.userRepo.save({
    //   email: 'test2@codefactory.ai',
    // })

    // preload: id 기반으로 레코드를 조회하고, 해당 레코드의 일부를 업데이트한 객체를 다루고 싶을때.
    //  DB 저장은 안 함! 
    // const user3 = await this.userRepo.preload({
    //   id: 102,
    //   email: 'test2@codefactory.ai'
    // })

    // delete: 삭제하기 
    // await this.userRepo.delete({ id: 101 })

    // increment: 식별 컬럼(id) 를 입력하고, 대상 컬럼을 얼마나 증가시킬지 정의 
    // await this.userRepo.increment({ // id가 2인 레코드의 count 컬럼값을 2 증가시키자. 
    //   id: 2
    // }, 'count', 2);

    // decrement: 식별 컬럼(id) 를 입력하고, 대상 컬럼을 얼마나 감소시킬지 정의 
    // await this.userRepo.decrement({ // id가 2인 레코드의 count 컬럼값을 2 감소시키자. 
    //   id: 2
    // }, 'count', 1);

    // 레코드 개수 카운팅 
    // const count = await this.userRepo.count({
    //   where: {
    //     email: ILike('%0%'),
    //   }
    // })

    // sum 
    // const sum = await this.userRepo.sum('count', // 어떤 프로퍼티를 합칠 지.
    //   { id: LessThan(4) }  // sum 할 레코드들의 조건 
    // )

    // average
    const average = await this.userRepo.average('count',
      { id: LessThan(4) }  // 평균을 구할 레코드들의 조건 
    )

    // 최소값 
    const min = await this.userRepo.minimum('count',
      { id: LessThan(4) }
    )
    // 최대값 
    const max = await this.userRepo.maximum('count',
      { id: LessThan(4) }
    )

    // entity 그리고 조건에 맞는 레코드의 개수. 
    const usersAndCount = await this.userRepo.findAndCount({
      where: { id: LessThan(10) },
      take: 3, // 3개만 조회.
    })

    return usersAndCount;
  }

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
      },
      order: { id: 'ASC', }
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
