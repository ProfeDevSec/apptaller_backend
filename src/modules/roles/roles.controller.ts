import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesUserDto } from './dto/roles-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('update')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async updateUserRoles(
    @GetUser() user: any,
    @Body() rolesUserDto: RolesUserDto,
  ) {
    return await this.rolesService.updateUserRoles(user, rolesUserDto);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async findAll(@GetUser() user: any) {
    return await this.rolesService.findAll(user);
  }
}
