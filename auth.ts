import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { EUserRole, ISession, } from './types/user';
import UserModel from "./models/user";
import { logAction } from "./app/api/logs/helper";
import connectDB from "./config/db.config";

connectDB();

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

            async profile(profile) {
                console.log(profile)
                let user = await UserModel.findOne({ email: profile.email });
                console.log('user', user)
                if (user) {
                    if (user?.avatar !== profile.picture || user?.name !== profile.name) {
                        // Update user info
                        user.name = profile.name;
                        user.avatar = profile.picture;
                        user.lastLoginAccount = 'google';
                        await user.save();
                    }
                    // Log
                    logAction({
                        title: ` Login - ${profile?.name}.`,
                        description: `User with email ${profile.email} logged in.`,
                    })

                }
                else {
                    console.log('creating google user')
                    user = await UserModel.create({
                        email: profile.email,
                        name: profile.name,
                        avatar: profile.picture,
                        lastLoginAccount: 'google',
                        signupMode: 'google',
                        password: 'google',
                    });
                    console.log('google user', user)
                    // Log
                    logAction({
                        title: ` Signup - [${profile?.name}].`,
                        description: `User with email ${profile.email} signed up.`,
                    })
                }

                return {
                    _id: user._id?.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.avatar,
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
                        _id: user?._id,
                        email: user?.email,
                        name: user?.name,
                        avatar: user?.avatar,
                        role: user?.role ?? EUserRole.FAN,
                    }
                }

                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
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

