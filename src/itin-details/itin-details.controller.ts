import { Controller, Get, Put, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import {ITINDetailsService } from "./itin-details.service"
import {ITINTable} from "./itin-details.entity"

@Controller('itin-details')
export class ITINTableController {
  constructor(private readonly ITINDetailsService: ITINDetailsService) {}

  @Put('create')
  async createOrUpdate(
    @Body() body: { profileId: number; itinNumber: string },
  ): Promise<ITINTable> {
    try {
      const { profileId, itinNumber } = body;
      const itinTable = await this.ITINDetailsService.createOrUpdate(profileId, itinNumber);
      return itinTable;
    } catch (error) {
      throw new HttpException('Unable to create or update the profile', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':profileId')
  async findByProfileId(
    @Param('profileId') profileId: number,
  ): Promise<ITINTable> {
    try {
      const ITINTable = await this.ITINDetailsService.findByProfileId(profileId);
      if (!ITINTable) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }
      return ITINTable;
    } catch (error) {
      throw new HttpException('Error fetching profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
