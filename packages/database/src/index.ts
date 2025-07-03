import { PrismaClient } from './generated'

export const prisma = new PrismaClient()

export * from './generated'
export type { Prisma } from './generated'