import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export type PrismaTx = Parameters<Parameters<typeof PrismaClient.prototype.$transaction>[0]>[0];
