import { followUserInfoProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useFollowerInfo = (userId: string, initialState: followUserInfoProps) => {

  const fetchUserFollowers = async () => {
    try {
      const response = await fetch('/api/followUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      const data:followUserInfoProps = await response.json();
      return data;
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const query = useQuery({
    queryKey: ['follower-info', userId],
    queryFn: fetchUserFollowers,
    initialData: initialState,
    staleTime: Infinity
  })

  return query;
}