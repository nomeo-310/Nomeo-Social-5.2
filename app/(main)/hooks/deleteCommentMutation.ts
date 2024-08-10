import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, getSingleComment } from "../actions/commentActions";
import { fetchCommentType } from "../components/CommentSection";
import { commentProps } from "@/types/types";
import { toast } from "sonner";

export const useDeleteCommentMutation = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: getSingleComment,
    onSuccess: async (returnedComment:commentProps) => {
      const queryKey:QueryKey = ['comments', returnedComment.post]

      await queryClient.cancelQueries({queryKey})

      queryClient.setQueryData<InfiniteData<fetchCommentType, number>>(
        queryKey, 
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              comments: page.comments.filter((comment) => comment._id !== returnedComment._id),
              previousPage: page.previousPage,
            }))
          }
        },
      );

      await deleteComment(returnedComment._id).then((response) => {
        if (response.success) {
          toast.success('Comment successfully deleted');
        }
      })
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to delete comment. Please try again later');
    }
  })


  return mutation;
}