'use client'

import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import starterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { userProps } from '@/types/types'
import ImageAvatar from './ImageAvatar'
import '../extraStyles/styles.css';
import { toast } from 'sonner'
import { useSubmitPostMutation } from '../hooks/submitPostMutation'
import LoadingButton from '@/components/common/LoadingButton'
import { useMediaUploads } from '../hooks/useMediaUpload'
import { Button } from '@/components/ui/button'
import { HiOutlinePhoto, HiXMark } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

type postEditorProps = {
  currentUser: userProps
};

type addAttachmentButtonProps = {
  onFilesSelected: (files: File[]) => void
  disabled: boolean
};

type attachmentProps = {
  file: File
  attachmentId?: string
  isUploading: boolean
};

type attachmentPreviewProps = {
  attachment: attachmentProps,
  onRemoveClick: () => void
};

type attachmentPreviewsProps = {
  attachments: attachmentProps[]
  removeAttachment: (fileName: string) => void
};

const PostEditor = ({currentUser} :postEditorProps) => {
  const mutation = useSubmitPostMutation();

  const { startUpload, attachments, isUploading, uploadProgress, removeAttachment, reset: resetMediaUploads } = useMediaUploads();

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

  const onSubmitPost = () => {
    mutation.mutate({
      content: input,
      attachmentIds: attachments.map(a => a.attachmentId).filter(Boolean) as string[],
    }, {
      onSuccess: () => {
        editor?.commands.clearContent();
        resetMediaUploads()
      }
    });
  };

  const AddAttachmentButton = ({onFilesSelected, disabled}:addAttachmentButtonProps) => {
    const filesInputRef = React.useRef<HTMLInputElement>(null);

    return (
      <React.Fragment>
        <Button 
          variant={'ghost'} 
          size={'icon'} 
          className='text-primary rounded-full' 
          disabled={disabled}
          onClick={() =>filesInputRef.current?.click()}
        >
          <HiOutlinePhoto size={24}/>
        </Button>
        <input 
          type='file' accept='image/*, video/*' 
          multiple ref={filesInputRef} className='hidden sr-only' 
          onChange={(event) => {
          const files = Array.from(event.target.files || [])
          if (files.length) {
            onFilesSelected(files);
            event.target.value = '';
          }
        }}/>
      </React.Fragment>
    )
  };

  const AttachmentPreview = ({attachment, onRemoveClick}:attachmentPreviewProps) => {
    const {file, isUploading, attachmentId} = attachment;
    const src = URL.createObjectURL(file);

    return (
      <div className={cn('relative mx-auto size-fit', isUploading && 'opacity-50')}>
        {file.type.startsWith('image') ? (
          <Image src={src} alt='attachment_preview' width={500} height={500} className='size-fit max-h-[30rem] rounded-md'/>
        ) : (<video controls className='size-fit max-h-[30rem] rounded-md'>
          <source src={src} type={file.type}/>
        </video>) }
        {!isUploading && (
          <button onClick={onRemoveClick} className='absolute top-3 right-3 p-1.5 text-background bg-foreground transition-colors rounded-full hover:bg-foreground/60 '>
            <HiXMark size={20}/>
          </button>
        )}
      </div> 
    )
  };

  const AttachmentPreviews = ({attachments, removeAttachment}:attachmentPreviewsProps) => {

    return (
      <div className={cn('w-full flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
        {attachments.map(attachment => (
          <AttachmentPreview attachment={attachment} onRemoveClick={() => removeAttachment(attachment.file.name)} key={attachment.file.name} />
        ))}
      </div>
    )
  };

  return (
    <div className='flex flex-col rounded-md bg-card p-4 shadow-sm gap-5'>
      <div className="flex gap-5 ">
        <ImageAvatar imgSrc={currentUser.image} className='hidden sm:inline border flex-none'/>
        <EditorContent editor={editor} className='w-full max-h-[20rem] overflow-y-auto bg-background rounded-md px-4 py-3'/>
      </div>
      {!!attachments.length && <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachment}/> }
      <div className="flex justify-end gap-3 items-center">
        {isUploading && (
          <React.Fragment>
            <span className='text-sm'>{uploadProgress ?? 0}%</span>
            <Loader2 size={18} className='animate-spin text-primary'/>
          </React.Fragment>
        )}
        <AddAttachmentButton onFilesSelected={startUpload} disabled={isUploading || attachments.length >= 5}/>
        <LoadingButton onClick={onSubmitPost} disabled={!input.trim() || isUploading} className='rounded-full min-w-28' loading={mutation.isPending}>
          <p className='text-base'>{mutation.isPending ? 'Creating post...' : 'Create post'}</p>
        </LoadingButton>
      </div>
    </div>
  )
}

export default PostEditor