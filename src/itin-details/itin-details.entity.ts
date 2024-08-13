import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ITINTable {
  @PrimaryColumn()
  profileId: number;  

  @Column({ type: 'varchar', length: 255 })
  itinNumber: string;
}
