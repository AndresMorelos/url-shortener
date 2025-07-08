/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Prisma } from '@prisma/client';

//extension for soft delete
export const softDelete = Prisma.defineExtension({
    name: 'softDelete',
    model: {
        $allModels: {
            async softDelete<M, A>(
                this: M,
                where: Prisma.Args<M, 'delete'>['where'],
            ): Promise<Prisma.Result<M, A, 'update'>> {
                const context = Prisma.getExtensionContext(this);

                return (context as any).update({
                    where,
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });
            },
        },
    },
});

//extension for soft delete Many
export const softDeleteMany = Prisma.defineExtension({
    name: 'softDeleteMany',
    model: {
        $allModels: {
            async softDeleteMany<M, A>(
                this: M,
                where: Prisma.Args<M, 'deleteMany'>['where'],
            ): Promise<Prisma.Result<M, A, 'updateMany'>> {
                const context = Prisma.getExtensionContext(this);

                return (context as any).updateMany({
                    where,
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });
            },
        },
    },
});

//extension for filtering soft deleted rows from queries
export const filterSoftDeleted = Prisma.defineExtension({
    name: 'filterSoftDeleted',
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                if (
                    operation === 'findUnique' ||
                    operation === 'findFirst' ||
                    operation === 'findMany'
                ) {
                    args.where = { ...args.where, deleted: false };
                    return query(args);
                }
                return query(args);
            },
        },
    },
});
