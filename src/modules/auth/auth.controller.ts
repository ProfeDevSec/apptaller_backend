import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RecoverDto } from './dto/recover.dto';
import { ChangePwdDto } from './dto/change-pwd.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Login success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.signIn(loginUserDto);
  }

  @Get('refresh')
  @UseGuards(AuthGuard())
  async refresh(@GetUser() user: any) {
    return await this.authService.refresh(user);
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async signOut() {
    return await this.authService.signOut();
  }

  // recover password
  @Post('recover')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async recover(@Body() recoverDto: RecoverDto) {
    return await this.authService.recover(recoverDto);
  }

  // change password
  @Post('changepwd')
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard())
  async changePassword(
    @GetUser() user: any,
    @Body() changePwdDto: ChangePwdDto,
  ) {
    return await this.authService.changePassword(user, changePwdDto);
  }

  @Get('user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getUser(@GetUser() user: any) {
    return await this.authService.getUser(user);
  }
}
