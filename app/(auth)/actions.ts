'use server'

import prisma from "@/lib/prisma";
import { signUpSchema, signUpValues } from "@/lib/validation"
import bcrypt from 'bcrypt'

export const signUp = async (credentials: signUpValues) => {
  try {
    const { username, email, password, name } = signUpSchema.parse(credentials);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsername = await prisma.user.findFirst({
      where: {username: {
        equals: username,
        mode: 'insensitive'
      }}
    });

    if (existingUsername) {
      return {error: 'Username already taken, use another one'}
    };

    const existingEmail = await prisma.user.findFirst({
      where: { email:{
        equals: username,
        mode: 'insensitive'}
      }
    });

    if (existingEmail) {
      return {error: 'Email already taken, use another one'}
    };

    const newUser = {email: email, hashedPassword: hashedPassword, username: username, name: name, displayName: username}

    await prisma.user.create({data: newUser});
    return {success: 'Account successfully created'}

  } catch (error) {
    console.error(error);
    return {error: 'Internal server error, try again later'}
  }
}