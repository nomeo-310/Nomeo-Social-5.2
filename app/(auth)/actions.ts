'use server'

import { getUserByEmail, getUserByUsername } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import { signUpSchema, signUpValues } from "@/lib/validation"
import User from "@/models/users"
import bcrypt from 'bcrypt'

export const signUp = async (credentials: signUpValues) => {
  await connectToMongoDB();
  
  try {
    const { username, email, password, name } = signUpSchema.parse(credentials);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsername = await getUserByUsername(username);

    if (existingUsername) {
      return {error: 'Username already taken, use another one'}
    };

    const existingEmail = await getUserByEmail(email)

    if (existingEmail) {
      return {error: 'Email already taken, use another one'}
    };

    const newUser = {email: email, hashedPassword: hashedPassword, username: username, name: name, displayName: username}

    const user = await User.create(newUser);
    user.save();
    return {success: 'Account successfully created'}

  } catch (error) {
    console.error(error);
    return {error: 'Internal server error, try again later'}
  }
};