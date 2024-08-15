import { getCurrentUser } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Attachment from "@/models/attachments";
import User from "@/models/users";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  image: f({
    image: { maxFileSize: "1024KB" },
  })
    .middleware(async () => {
      const currentUser = await getCurrentUser();
      await connectToMongoDB();

      if (!currentUser) throw new UploadThingError("Unauthorized");

      return { currentUser };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldImage = metadata.currentUser.image;

      if (oldImage) {
        const key = oldImage.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];
        await new UTApi().deleteFiles(key);
      }
      const newImageUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      const updateData = { image: newImageUrl };

      await User.findOneAndUpdate(
        { _id: metadata.currentUser._id },
        updateData
      );

      return { image: newImageUrl };
    }),
  attachments: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const url = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      const type = file.type.startsWith("image") ? "image" : "video";

      const mediaData = { url: url, type: type };

      const media = await Attachment.create(mediaData);
      media.save();

      return { attachmentId: JSON.parse(JSON.stringify(media._id)) };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
