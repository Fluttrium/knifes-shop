import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty()
    @IsString()
    name: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}

export class UserResponseDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    email: string

    @ApiProperty()
    name: string

    @ApiProperty()
    createdAt: Date
}

// Утилиты для вариаций
export type CreateUserPayload = Omit<CreateUserDto, 'id' | 'createdAt'>
export type UserListItem = Pick<UserResponseDto, 'id' | 'name' | 'email'>