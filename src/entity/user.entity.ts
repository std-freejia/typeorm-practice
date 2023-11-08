import { Column, CreateDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { ProfileModel } from "./profile.entity";
import { profile } from "console";

export enum Role {
  USER = 'user', ADMIN = 'admin',
}
@Entity()
export class UserModel {

  // @PrimaryGeneratedColumn() // int auto increment
  @PrimaryGeneratedColumn() // ('uuid') 사용하면, uuid 가 자동 생성된다 
  id: number;

  @Column({
    type: 'varchar',  // DB 에서 인지하는 칼럼 타입. 자동으로 유추됨. 
    name: 'title', // 컬럼명과, typeorm entity 컬럼 명이 다를 경우에 작성하기. 프로퍼티 명으로 자동 유추됨.
    length: 200,   // type 이 varchar인 경우, length 지원. text인 경우 길이 지정 불가. 
    nullable: true,
    update: true,  // false 인 경우: 초기화만 가능. 초기화 이후에는 값 변경 불가. 
    select: false,  // 기본값이 true. find() 실행 시, 기본으로 값을 불러올지 여부. false 라면, select 문에 컬럼을 명시해야 조회 가능.
    default: 'default value', // 기본 값. 
    unique: false,  // 기본값이 false. 
  })
  title: string; // 제목 

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn() // 레코드가 업데이트 될 때마다 1씩 증가. save()함수가 몇 번 호출됬는지 기억.
  version: number;

  @Column()
  @Generated('uuid') // 데이터를 생성할 때마다 1씩 증가. ('uuid') 가능.
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;
}