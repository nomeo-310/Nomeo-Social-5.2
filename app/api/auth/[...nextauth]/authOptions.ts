import { AuthOptions } from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { signInSchema } from '@/lib/validation'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {label: 'username', type: 'text'},
        password: {label: 'password', type: 'password'}, 
      },
      async authorize(credentials) {
        const {username, password} = signInSchema.parse(credentials);

        if (!username || !password) {
          throw new Error('Invalid Credentials');
        }

        const user = await prisma.user.findFirst({
          where: { username: {
            equals: username,
            mode: 'insensitive'
          }}
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials')
        }

        const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
        
        if (!isCorrectPassword) {
          throw new Error('Wrong Password')
        }

        return user
      }
    }),
  ],
  pages: {
    signIn: '/sign-in'
  },
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt'},
  secret: process.env.NEXTAUTH_SECRET,
}