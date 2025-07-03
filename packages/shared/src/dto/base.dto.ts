import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class PaginationDto {
    @ApiProperty({ required: false, default: 1, minimum: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page?: number = 1

    @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10
}

export class PaginatedResponseDto<T> {
    @ApiProperty()
    data: T[] = []

    @ApiProperty()
    total: number = 0

    @ApiProperty()
    page: number = 1

    @ApiProperty()
    limit: number = 10

    @ApiProperty()
    totalPages: number = 0
}