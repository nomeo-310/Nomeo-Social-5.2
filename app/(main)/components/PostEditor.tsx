'use client'

import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import starterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { createNewPost } from '../actions/postActions'
import { userProps } from '@/types/types'
import ImageAvatar from './ImageAvatar'
import { Button } from '@/components/ui/button'
import '../extraStyles/styles.css';
import { toast } from 'sonner'

type postEditorProps = {
  currentUser: userProps
}

const PostEditor = ({currentUser} :postEditorProps) => {
  const editor = useEditor({
    extensions: [
      starterKit.configure({
        bold: false, 
        italic: false
      }),
      Placeholder.configure({
        placeholder: "What's on your mind right now?"
      })
    ]
  });
  
  const input = editor?.getText({
    blockSeparator: '\n'
  }) || '';

  const onSubmitPost = async () => {
    await createNewPost(input)
    .then((response) => {

      if (response.success) {
        toast.success(response.success)
      };

      if (response.error) {
        toast.error(response.error)
      };
    })
    editor?.commands.clearContent()
  };

  return (
    <div className='flex flex-col rounded-md bg-card p-4 shadow-sm gap-5'>
      <div className="flex gap-5 ">
        <ImageAvatar imgSrc={currentUser.image} className='hidden sm:inline border flex-none'/>
        <EditorContent editor={editor} className='w-full max-h-[20rem] overflow-y-auto bg-background rounded-md px-4 py-3'/>
      </div>
      <div className="flex justify-end">
        <Button onClick={onSubmitPost} disabled={!input.trim()} className='rounded-full min-w-28'>
          <p className='text-base'>Create post</p>
        </Button>
      </div>
    </div>
  )
}

export default PostEditor