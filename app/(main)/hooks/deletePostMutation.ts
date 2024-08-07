import { postProps } from "@/types/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost, getSinglePost } from "../actions/postActions";
import { toast } from "sonner";
import { fetchPostType } from "../posts/components/PostFeeds";


export const useDeletePostMutation = () => {

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: getSinglePost,
    onSuccess: async (postReturned:postProps) => {
      const queryFilter:QueryFilters = {queryKey: ['post-feed']}

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<fetchPostType, number>>(
        queryFilter, 
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              nextPage: page.nextPage,
              posts: page.posts.filter((post) => post._id !== postReturned._id)
            }))
          }
        },
      );

      await deletePost(postReturned._id).then((response) => {
        if (response.success) {
          toast.success('Post successfully deleted');
        }
      })

      if (pathname === `/posts/${postReturned._id}`) {
        router.push(`/users/${postReturned.author.username}`)
      }

    },
    onError(error) {
      console.error(error)
      toast.error('Failed to delete post. Please try again later');
    }
  })

  return mutation;
}