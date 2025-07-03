import { BaseApiClient } from './base'
import { UsersApi } from './resources/users'

export class ApiClient extends BaseApiClient {
    public users: UsersApi

    constructor(baseURL: string) {
        super(baseURL)
        this.users = new UsersApi(baseURL)
    }
}

export const createApiClient = (baseURL: string) => new ApiClient(baseURL)

export type ApiClientType = ApiClient
export * from '@repo/shared'
export { BaseApiClient } from './base'
export { UsersApi } from './resources/users'