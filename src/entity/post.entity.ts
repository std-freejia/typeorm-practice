import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  /* ManyToOne 애노테이션을 가지고있는 엔티티 쪽에서 FK 컬럼을 가진다 */
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @Column()
  title: string
}