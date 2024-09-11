import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangeRoleDto, UpdatePersonUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async findAll(@GetUser() user: any) {
    return await this.usersService.findAll(user);
  }

  @Post('change-role')
  @UseGuards(AuthGuard())
  async chageRoleByUser(@Body() changeRoleDto: ChangeRoleDto) {
    return await this.usersService.changeRoleByUser(changeRoleDto);
  }

  @Get(':nid')
  @UseGuards(AuthGuard())
  async findOne(@GetUser() user: any, nid: string) {
    return await this.usersService.findUserById(user, nid);
  }

  @Delete(':nid')
  @UseGuards(AuthGuard())
  async deleteOne(@GetUser() user: any, nid: string) {
    return await this.usersService.deleteUserById(user, nid);
  }

  @Patch(':nid')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() user: any,
    nid: string,
    @Body() newUser: UpdatePersonUserDto,
  ) {
    return await this.usersService.update(user, nid, newUser);
  }

  @Patch('changeState/:nid')
  @UseGuards(AuthGuard())
  async changeState(nid: string, @Body() newState: { newState: number }) {
    return await this.usersService.changeState(nid, newState.newState);
  }

  @Post('create/')
  @UseGuards(AuthGuard())
  async createUser(@GetUser() user: any, @Body() newUser: UpdatePersonUserDto) {
    return await this.usersService.create(user, newUser);
  }
}
