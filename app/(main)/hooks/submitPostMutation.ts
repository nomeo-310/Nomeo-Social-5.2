import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { createNewPost } from "../actions/postActions"
import { toast } from "sonner"
import { fetchPostType } from "../posts/components/PostFeeds";
import { postProps } from "@/types/types";


export const useSubmitPostMutation = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewPost,
    onSuccess: async (newPost:postProps) => {
      const queryFilter: QueryFilters = {queryKey: ['post-feed', 'all-posts']};
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<fetchPostType, number>>(
        queryFilter, 
        (oldData) => {
          const firstPage = oldData && oldData.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                { posts: [newPost, ...firstPage.posts],
                  nextPage: firstPage.nextPage
                },
                ...oldData.pages.slice(1),
              ]
            }
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data
        }
      });

      toast.success('Post successfully created');
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to create post. Please try again later');
    }
  });

  return mutation;
};