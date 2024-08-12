'use client'


import React from 'react'
import { signInSchema, signInValues } from '@/lib/validation'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form'
import InputWithIcon from '@/components/common/InputWithIcon'
import { HiAtSymbol, HiOutlineLockClosed } from 'react-icons/hi2'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/common/LoadingButton'



const SignInForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = React.useTransition()

  const defaultSignUpValue = {
    username: '',
    password: ''
  };

  const form = useForm<signInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: defaultSignUpValue
  });

  const onSubmit = async (values: signInValues) => {
    startTransition(() => {
      signIn('credentials', {...values, redirect: false})
      .then((callback) => {
        if (callback?.ok) {
          toast.success("Succesfully Logged In");
          router.push("/");
        }

        if (callback?.error) {
          toast.error(callback.error);
          console.log(callback.error)
        }
      })
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 px-[6%] flex flex-col lg:gap-3 gap-2'>
        <FormField 
          control={form.control} 
          name='username'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <InputWithIcon type='text' placeholder='your username' icon={HiAtSymbol} {...field} className='border-b ' iconClassName='md:text-gray-400' autoComplete="off" />
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
            {isPending ? 'Logging in...' : 'Log in'}
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}

export default SignInForm
