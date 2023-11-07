import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class UserModel {

  // @PrimaryGeneratedColumn() // int auto increment
  @PrimaryGeneratedColumn() // ('uuid') 사용하면, uuid 가 자동 생성된다 
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn() // 레코드가 업데이트 될 때마다 1씩 증가. save()함수가 몇 번 호출됬는지 기억.
  version: number;

  @Column()
  @Generated('uuid') // 데이터를 생성할 때마다 1씩 증가. ('uuid') 가능.
  additionalId: number;
}