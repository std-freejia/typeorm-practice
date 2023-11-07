/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ // forFeature(): entity 추가 
      UserModel,
    ]),
    TypeOrmModule.forRoot({ // forRoot(): connection 정보 
      type: 'postgres',
      host: '127.0.0.1',
      port: 5430,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [
        UserModel,
        StudentModel, TeacherModel
      ],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
