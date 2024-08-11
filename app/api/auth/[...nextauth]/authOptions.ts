import { AuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { signInSchema } from '@/lib/validation'
import clientPromise from '@/lib/mongoDBClientPromise'
import { getUserByUsername } from '@/lib/authAction'
import { userProps } from '@/types/types'


export const authOptions: AuthOptions = {
  
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {label: 'username', type: 'text'},
        password: {label: 'password', type: 'password'}, 
      },
      //@ts-ignore
      async authorize(credentials) {
        
        const {username, password} = signInSchema.parse(credentials);

        if (!username || !password) {
          throw new Error('Invalid Credentials');
        }

        const user:userProps = await getUserByUsername(username);

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
  pages: {signIn: '/sign-in'},
  session: {strategy: "jwt"},
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}