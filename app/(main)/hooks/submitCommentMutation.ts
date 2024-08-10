import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { createComment } from "../actions/commentActions";
import { fetchCommentType } from "../components/CommentSection";
import { toast } from "sonner";
import { commentProps } from "@/types/types";

export const useSubmitCommentMutation = (postId: string) => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment:commentProps) => {
      const queryKey: QueryKey = ['comments', postId];
      await queryClient.cancelQueries({queryKey})

      queryClient.setQueryData<InfiniteData<fetchCommentType, number>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData && oldData.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [newComment, ...firstPage.comments],
                  previousPage: firstPage.previousPage, 
                },
                ...oldData.pages.slice(1),
              ]
            };
          }
        }
      );
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data
        }
      });

      toast.success('Comment successfully created');
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to create comment. Please try again later');
    }
  });

  return mutation;
};