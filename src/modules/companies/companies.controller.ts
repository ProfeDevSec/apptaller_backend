import { Controller, Get, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async findOne(@GetUser() user: any) {
    return await this.companiesService.findOne(user);
  }
}
