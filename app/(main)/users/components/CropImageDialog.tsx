import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { Cropper, ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

type cropImageDialogProps = {
  src: string
  cropAspectRatio: number
  onCropped: (blob: Blob | null) => void
  onClose: () => void
}

const CropImageDialog = ({src, cropAspectRatio, onClose, onCropped}: cropImageDialogProps) => {
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const crop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      return;
    }
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2 className='font-semibold text-base md:text-xl'>Crop image</h2>
          </DialogTitle>
        </DialogHeader>
        <Cropper 
          src={src} 
          aspectRatio={cropAspectRatio} 
          guides={false} 
          zoomable={false} 
          ref={cropperRef}
          className='mx-auto size-fit'
        />
        <DialogFooter>
          <Button variant={'secondary'} onClick={onClose} className='rounded-full'>Cancel</Button>
          <Button onClick={crop} className='rounded-full'>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CropImageDialog