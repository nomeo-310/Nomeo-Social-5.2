import { useUploadThing } from "@/lib/uploadthing";
import { updateProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "../actions/userActions";
import { toast } from "sonner";
import { fetchPostType } from "../posts/components/PostFeeds";

export const useUpdateUserMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startImageUpload } = useUploadThing("image");
  const mutation = useMutation({
    mutationFn: async ({
      values,
      image,
    }: {
      values: updateProfileValues;
      image?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        image && startImageUpload([image]),
      ]);
    },
    onSuccess: async ([updateData, uploadResult]) => {
      const newImageUrl = uploadResult?.[0].serverData.image;

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<fetchPostType, number>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextPage: page.nextPage,
              posts: page.posts.map((post) => {
                if (post.author._id === updateData._id) {
                  return {
                    ...post,
                    author: {
                      ...updateData,
                      image: newImageUrl || updateData.image,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );
      router.refresh();
      toast.success("Profile successfully updated");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again");
    },
  });

  return mutation;
};
