import { AuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { signInSchema } from '@/lib/validation'
import clientPromise from '@/lib/mongoDBClientPromise'
import { getUserByUsername } from '@/lib/authAction'

export const authOptions: AuthOptions = {
  
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {label: 'username', type: 'text'},
        password: {label: 'password', type: 'password'}, 
      },
      async authorize(credentials) {
        
        const {username, password} = signInSchema.parse(credentials);
        console.log(username, password);

        if (!username || !password) {
          throw new Error('Invalid Credentials');
        }

        const user = await getUserByUsername(username);
        console.log(user);

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials')
        }

        const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
        console.log(isCorrectPassword);
        
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