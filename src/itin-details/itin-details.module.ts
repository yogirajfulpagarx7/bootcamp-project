import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITINTable } from './itin-details.entity';
import { ITINDetailsService } from "./itin-details.service"
import { ITINTableController } from './itin-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ITINTable])],
  providers: [ITINDetailsService],
  controllers: [ITINTableController],
})
export class ITINDetailsModule {}