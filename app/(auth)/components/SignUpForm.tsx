'use client'

import React from 'react'
import { signUpSchema, signUpValues } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form'
import InputWithIcon from '@/components/common/InputWithIcon'
import { HiAtSymbol, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi2'
import { signUp } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/common/LoadingButton'


const SignUpForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = React.useTransition()

  const defaultSignUpValue = {
    email: '',
    username: '',
    password: '',
    name: ''
  };

  const form = useForm<signUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: defaultSignUpValue
  });

  const onSubmit = async (values: signUpValues) => {
    startTransition(async() => {
      await signUp(values)
      .then((response) => {
        if (response.success) {
          toast.success(response.success);
          router.push('/sign-in');
        }

        if (response.error) {
          toast.error(response.error)
        }
      })
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 px-[6%] flex flex-col lg:gap-3 gap-2'>
        <FormField 
          control={form.control} 
          name='name'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <InputWithIcon type='text' placeholder='your full name' icon={HiOutlineUser} {...field} className='border-b ' iconClassName='md:text-gray-400' autoComplete='off'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name='username'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <InputWithIcon type='text' placeholder='your username' icon={HiAtSymbol} {...field} className='border-b ' iconClassName='md:text-gray-400' autoComplete='off'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name='email'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <InputWithIcon type='email' placeholder='your email address' icon={HiOutlineEnvelope} {...field} className='border-b ' iconClassName='md:text-gray-400' autoComplete='off'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name='password'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <InputWithIcon type='password' placeholder='your password' icon={HiOutlineLockClosed} {...field} className='border-b ' iconClassName='md:text-gray-400' autoComplete='off'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className='lg:pt-6 pt-4'>
          <LoadingButton type='submit' className='w-full rounded-full lg:text-lg' size={'lg'} loading={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm
