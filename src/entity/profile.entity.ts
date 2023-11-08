import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn() // ('uuid') 사용하면, uuid 가 자동 생성된다 
  id: number;

  @OneToOne(() => UserModel, (user) => user.profile)  // UserModel 과 연결할 프로퍼티 
  @JoinColumn() // join column 을 (참조 컬럼)가지고 있는 쪽에 joinColumn 애노테이션 붙이기 
  user: UserModel;

  @Column()
  profileImg: string
}