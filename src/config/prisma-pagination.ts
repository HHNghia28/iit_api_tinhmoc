import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

// pagination for all models
export const extendedPrismaClient = new PrismaClient().$extends(pagination());

export type ExtendedPrismaClient = typeof extendedPrismaClient;
