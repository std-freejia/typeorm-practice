import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";
import { TagModel } from "./tag.entity";

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  /* ManyToOne 애노테이션을 가지고있는 엔티티 쪽에서 FK 컬럼을 가진다 */
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable() // N:N 관계에서, 한쪽 엔티티에 JoinTable 을 붙여줘야한다. 
  tags: TagModel[]

  @Column()
  title: string
}