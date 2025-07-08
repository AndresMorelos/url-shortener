import { PrismaClient } from '@prisma/client';
import {
    filterSoftDeleted,
    softDelete,
    softDeleteMany,
} from './prisma.extensions';

export const customPrismaClient = (prismaClient: PrismaClient) => {
    return prismaClient
        .$extends(softDelete)
        .$extends(softDeleteMany)
        .$extends(filterSoftDeleted);
};

export class PrismaClientExtended extends PrismaClient {
    private _customPrismaClient: CustomPrismaClient;

    get customPrismaClient() {
        if (!this._customPrismaClient) {
            this._customPrismaClient = customPrismaClient(this);
        }
        return this._customPrismaClient;
    }
}

export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;
