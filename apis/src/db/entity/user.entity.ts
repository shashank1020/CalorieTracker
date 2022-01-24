import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ nullable: false }) isAdmin: boolean;
  @Column() name: string;
  @Column({ type: 'double', default: 2100 }) dailyCalorieLimit: number;
  @Column({ type: 'double', default: 1000 }) monthlyBudget: number;
}
