// app/api/edgestore/[...edgestore]/route.ts
import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket({
        accept: ['image/*'], // accepte uniquement les images
        maxSize: 1024 * 1024 * 4, // 4MB
    }).beforeUpload(({ ctx, input, fileInfo }) => {
        console.log('beforeUpload', ctx, input, fileInfo);
        return true; // allow upload
    })
        /**
         * return `true` to allow delete
         * This function must be defined if you want to delete files directly from the client.
         */
        .beforeDelete(({ ctx, fileInfo }) => {
            console.log('beforeDelete', ctx, fileInfo);
            return true; // allow delete
        }),

});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;