import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDTO {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    @ApiProperty({ example: 'Jhon Doe' })
    name: string;

    @AutoMap()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'teste@teste.com.br' })
    email: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @Length(8, 24)
    @ApiProperty({ example: 'abc1245' })
    password: string;

    @AutoMap()
    @IsNotEmpty()
    @IsEnum(UserRole)
    @ApiProperty({ example: 'CLIENT' })
    role: UserRole;
}
