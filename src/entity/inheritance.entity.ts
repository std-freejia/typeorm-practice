import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

/** 방식 1 
 * BaseModel 을 상속받는 BookModel, CarModel 
 */
export class BaseModel { // 이것은 상속받을 대상이기 때문에 entity 애노테이션이 필요없다 
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class BookModel extends BaseModel {
  @Column()
  name: string;
}

@Entity()
export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

/** 방식 2 
 * Single entity inheritance 
 * - 다수의 ChildEntity 를 하나의 테이블로 관리하고 싶다면 ? 
 */
@Entity()
@TableInheritance({
  column: { // column 생성: brand 컬럼과 country 컬럼 구분하기 위한 컬럼을 만든다. 
    name: 'type',
    type: 'varchar',
  }
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  brand: string;
}

@ChildEntity()
export class AirplaneModel extends SingleBaseModel {
  @Column()
  country: string;
}