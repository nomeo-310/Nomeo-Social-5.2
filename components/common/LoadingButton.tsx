import React from 'react'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface loadingButtonProps extends ButtonProps {
  loading: boolean
}

const LoadingButton = ({className, loading, disabled, ...props}: loadingButtonProps) => {
  return (
    <Button disabled={loading || disabled} className={cn('flex items-center gap-2', className)} {...props}>
      {loading && <Loader2 className='size-6 animate-spin'/>}
      {props.children}
    </Button>
  )
}

export default LoadingButton;
