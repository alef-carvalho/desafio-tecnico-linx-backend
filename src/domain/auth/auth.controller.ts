import { IsPublic } from '@common/decorators';
import { LoginDto } from './dto/login.dto';
import { LocalGuard } from './guards/local.guard';
import { AuthRequest, AuthToken, AuthUser } from './auth.interface';
import { AuthService } from './auth.service';
import { API_V1, SWAGGER_TAG_AUTH } from '@common/constants';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';

@ApiTags(SWAGGER_TAG_AUTH)
@Controller({ path: 'auth', version: API_V1 })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ type: AuthToken })
    @ApiOperation({ summary: 'Authenticate using email and password.' })
    login(@Request() { user }: AuthRequest) {
        return this.authService.login(user);
    }

    @Get('profile')
    profile(@Request() { user }: AuthRequest): AuthUser {
        return user;
    }
}
