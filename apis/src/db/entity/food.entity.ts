import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('food')
export default class FoodEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() userId: number;
  @Column({ type: 'double' }) calorie: number;
  @Column({ type: 'double' }) price: number;
  @Column() yearMonth: string; // YYYY-MM
  @Column() time: string;
  @Column() date: string; // YYYY-MM-DD
}
