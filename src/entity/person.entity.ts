import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class Name { /** entity embedding */

  @Column()
  first: string;

  @Column()
  last: string
}

@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;
  // @Column()
  // firstName: string;

  // @Column()
  // lastName: string;

  @Column()
  class: string;
}

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;
  // @Column()
  // firstName: string;

  // @Column()
  // lastName: string;

  @Column()
  salary: number;
}