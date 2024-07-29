'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { IconType } from 'react-icons/lib';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType
  iconClassName?: string
}

const InputWithIcon = React.forwardRef<HTMLInputElement, inputProps>(({iconClassName, className, type, disabled, icon:Icon, ...props}, ref) => {
  const [inputType, setInputType] = React.useState('password');

  return (
    <div className={cn('w-full relative', className)}>
      <input type={ type === 'password' ? inputType : type } className={`cursor-pointer rounded bg-inherit w-full md:p-4 p-3.5 focus:outline-none lg:text-lg ${Icon ? 'pl-10 md:pl-12 lg:pl-12' : ''}`} disabled={disabled} {...props} ref={ref}/>
      {Icon && <Icon size={22} className={cn('md:hidden absolute left-2.5 top-1/2 -translate-y-1/2', iconClassName)}/>}
      {Icon && <Icon size={25} className={cn('hidden md:block absolute left-3.5 top-1/2 -translate-y-1/2', iconClassName)}/>}
      {type === 'password' && 
        <React.Fragment>
          { inputType === 'password' ? 
            <>
              <HiOutlineEyeSlash size={22} className={cn('cursor-pointer absolute md:hidden right-2.5 top-1/2 -translate-y-1/2', iconClassName)} onClick={() => setInputType('text')}/>
              <HiOutlineEyeSlash size={25} className={cn('cursor-pointer absolute hidden md:block right-3.5 top-1/2 -translate-y-1/2', iconClassName)} onClick={() => setInputType('text')}/>
            </> :
            <>
              <HiOutlineEye size={25} className={cn('cursor-pointer absolute hidden md:block right-3.5 top-1/2 -translate-y-1/2', iconClassName)} onClick={() => setInputType('password')}/>
              <HiOutlineEye size={22} className={cn('cursor-pointer absolute md:hidden right-2.5 top-1/2 -translate-y-1/2', iconClassName)} onClick={() => setInputType('password')}/>
            </>
          }
        </React.Fragment>
      }
    </div>
  )
});

InputWithIcon.displayName = 'InputWithIcon';

export default InputWithIcon;