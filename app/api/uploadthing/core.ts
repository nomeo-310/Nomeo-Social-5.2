import { getCurrentUser } from '@/lib/authAction';
import { connectToMongoDB } from '@/lib/connectToMongoDb';
import User from '@/models/users';
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

export const fileRouter = {
  image: f({
    image: {maxFileSize: '1024KB'}
  })
  .middleware(async () => {
    const currentUser = await getCurrentUser();
    await connectToMongoDB();

    if (!currentUser) throw new UploadThingError('Unauthorized');

    return { currentUser };
  })
  .onUploadComplete(async ({metadata, file}) => {
    const oldImage = metadata.currentUser.image;

    if (oldImage) {
      const key = oldImage.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
      await new UTApi().deleteFiles(key)
    }
    const newImageUrl = file.url.replace(
      "/f/",
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
    );

    const updateData = {image: newImageUrl};

    await User.findOneAndUpdate({_id: metadata.currentUser._id}, updateData)

    return {image: newImageUrl}
  })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter;