import { postProps, userProps } from '@/types/types'
import React from 'react'
import { useSubmitCommentMutation } from '../hooks/submitCommentMutation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HiOutlinePaperAirplane } from 'react-icons/hi2'
import { Loader2 } from 'lucide-react'

type commentInputProps = {
  post: postProps
  currentUser: userProps
}

const CommentInput = ({post, currentUser}: commentInputProps) => {
  const [input, setInput] = React.useState('');

  const mutation = useSubmitCommentMutation(post._id);

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();

    if (!input) {
      return;
    };

    mutation.mutate(
      {
        postId: post._id,
        content: input
      },
      {
        onSuccess: () => setInput('')
      }
    ) 

  }
  return (
    <form className='flex w-full items-center gap-2' onSubmit={handleSubmit}>
      <Input
        placeholder='Write a comment...'
        value={input}
        onChange={(event) => setInput(event.target.value)}
        autoFocus
      />
      <Button type='submit' variant={'ghost'} size={'icon'} disabled={!input.trim() || mutation.isPending}>
        {!mutation.isPending ? <HiOutlinePaperAirplane size={22}/> : <Loader2 className='animate-spin'/>}
      </Button>
    </form>
  )
}

export default CommentInput