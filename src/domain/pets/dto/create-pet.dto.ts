import { Type } from 'class-transformer';
import { PetType } from '@prisma/client';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePetDTO {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    @ApiProperty({ example: 'Amora' })
    name: string;

    @AutoMap()
    @IsNotEmpty()
    @IsEnum(PetType)
    @ApiProperty({ example: PetType.DOG })
    type: PetType;

    @AutoMap()
    @Type(() => Date)
    @IsDate()
    @ApiProperty({ example: new Date() })
    birth_date: Date;
}
