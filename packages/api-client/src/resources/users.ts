import {BaseApiClient} from '../base'
import {CreateUserDto, PaginatedResponseDto, PaginationDto, UpdateUserDto, UserResponseDto} from "@repo/shared";


export class UsersApi extends BaseApiClient {
    async getAll(params?: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.request({
            method: 'GET',
            url: '/users',
            params,
        })
    }

    async getById(id: string): Promise<UserResponseDto> {
        return this.request({
            method: 'GET',
            url: `/users/${id}`,
        })
    }

    async create(data: CreateUserDto): Promise<UserResponseDto> {
        return this.request({
            method: 'POST',
            url: '/users',
            data,
        })
    }

    async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
        return this.request({
            method: 'PATCH',
            url: `/users/${id}`,
            data,
        })
    }

    async delete(id: string): Promise<void> {
        return this.request({
            method: 'DELETE',
            url: `/users/${id}`,
        })
    }
}