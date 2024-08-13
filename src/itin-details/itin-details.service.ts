import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITINTable } from './itin-details.entity';

@Injectable()
export class ITINDetailsService {
  constructor(
    @InjectRepository(ITINTable)
    private readonly itinRepository: Repository<ITINTable>,  
  ) {}

  async createOrUpdate(profileId: number, itinNumber: string): Promise<ITINTable> {
    const existingRecord = await this.itinRepository.findOneBy({ profileId });

    if (existingRecord) {
      existingRecord.itinNumber = itinNumber;
      return this.itinRepository.save(existingRecord);
    } else {
      const itinRecord = this.itinRepository.create({ profileId, itinNumber });
      return this.itinRepository.save(itinRecord);
    }
  }

  async findByProfileId(profileId: number): Promise<ITINTable> {
    return this.itinRepository.findOneBy({ profileId });
  }
}
