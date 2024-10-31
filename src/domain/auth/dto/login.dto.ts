import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    @AutoMap()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'admin@teste.com' })
    email: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @Length(8, 24)
    @ApiProperty({ example: '12345678' })
    password?: string;
}
