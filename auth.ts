import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { EUserRole, ISession, } from './types/user';

import UserModel from "./models/user";
import { logAction } from "./app/api/logs/helper";
import connectDB from "./config/db.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

            async profile(profile) {
                connectDB();
                let user = await UserModel.findOne({ email: profile.email });

                if (!user) {
                    user = await UserModel.create({
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture,
                        lastLoginAccount: 'google',
                        signupMode: 'google',
                    });

                    // Log
                    logAction({
                        title: ` Signup - [${profile?.name}].`,
                        description: `User with email ${profile.email} signed up.`,
                    })
                }
                else {
                    if (user?.image !== profile.picture || user?.name !== profile.name) {
                        // Update user info
                        user.name = profile.name;
                        user.image = profile.picture;
                        user.lastLoginAccount = 'google';
                        await user.save();
                    }
                    // Log
                    logAction({
                        title: ` Login - ${profile?.name}.`,
                        description: `User with email ${profile.email} logged in.`,
                    })
                }

                return {
                    id: user._id?.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user?.role,
                };
            },
            authorization: {
                params: {
                    prompt: "select_account",   // 👈 always show account picker
                },
            }
        }), //Credentials
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user: {},
            },
            async authorize(credentials, request) {
                const userString = credentials?.user

                if (userString) {
                    const user = JSON.parse(userString as string) as ISession['user']
                    // Log
                    logAction({
                        title: ` Login - ${user?.name}.`,
                        description: `User with email ${user?.email} logged in.`,
                    })
                    return {
                        id: user?.id,
                        email: user?.email,
                        name: user?.name,
                        image: user?.image,
                        role: user?.role ?? EUserRole.FAN,
                    }
                }

                return null;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // First sign-in
            if (user) {
                token.role = (user as ISession['user'])?.role ?? EUserRole.FAN;
            }
            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                (session.user as ISession['user']).role = token.role as EUserRole;
            }
            return session;
        },
    },
    pages: {
        error: "/auth/error",
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
    }
});

