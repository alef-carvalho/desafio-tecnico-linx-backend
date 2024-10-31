import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class ListUserQuery {
    @ApiProperty({ minimum: 1 })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    page: number;

    @ApiProperty({ minimum: 1 })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    size: number;
}
