import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GiftCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'text' })
  benefits: string;
}
