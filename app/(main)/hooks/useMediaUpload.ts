import { useUploadThing } from '@/lib/uploadthing'
import React from 'react'
import { toast } from 'sonner'


type useMediaUploadsProps = {
  file: File
  attachmentId?: string
  isUploading: boolean
};

export const useMediaUploads = () => {
  const [attachments, setAttachments] = React.useState<useMediaUploadsProps[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<number>();

  const { startUpload, isUploading } = useUploadThing('attachments', {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map(file => {
        const extension = file.name.split('.').pop()
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {type: file.type}
        );
      });
      setAttachments(prev => [...prev, ...renamedFiles.map(file => ({file, isUploading: true}))]);

      return renamedFiles
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
       setAttachments(prev => prev.map(a => {
        const uploadedResult = res.find(r => r.name === a.file.name)

        if (!uploadedResult) {
          return a
        }

        return {...a, attachmentId: uploadedResult.serverData.attachmentId, isUploading: false}
      })) 
    },
    onUploadError(error) {
      setAttachments(prev => prev.filter(a => !a.isUploading));
      toast.error(error.message)
    }
  });

  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast.error('Wait for the current upload to finish.')
      return;
    }

    if (attachments.length + files.length > 5) {
      toast.error('You can only upload up to 5 attachments per post')
      return;
    }

    startUpload(files)
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(a => a.file.name !== fileName))
  };

  const reset = () => {
    setAttachments([]);
    setUploadProgress(undefined);
  };

  return { startUpload:handleStartUpload, attachments, isUploading, uploadProgress, removeAttachment, reset }
}