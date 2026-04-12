import { ConnectMongoDb } from "@/lib/dbconfig";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/user";
import { isValidEmail } from "@/lib/validate";

ConnectMongoDb();

export async function POST(req: NextRequest,) {
    const { email: rawEmail, password } = await req.json()

    const email = isValidEmail(rawEmail) ? rawEmail : rawEmail.concat('@kfc.com')

    if (!email || !password) return NextResponse.json({ success: false, message: 'Invalid email or password' });

    const user = await UserModel.findOne({ email });

    if (!user) return NextResponse.json({ success: false, message: 'User not found' });

    const matched = await bcrypt.compare(password, user.password as string);

    if (!matched) return NextResponse.json({ success: false, message: 'Incorrect password' });

    const { _id, name, image, role } = user; //Eliminate pass

    const safeUser = {
        name,
        image,
        role,
        email,
        id: _id,
    };

    //Normal user

    return NextResponse.json({ data: safeUser, success: true, message: 'Sign in successful' });
}

//Reset Password
export async function PUT(req: NextRequest,) {
    try {
        const { email: rawEmail, password, name, } = await req.json() as IUser

        const email = (isValidEmail(rawEmail) ? rawEmail : rawEmail.concat('@kfc.com')).toLowerCase()

        if (!email || !password) return NextResponse.json({ success: false, message: 'Missing email, name or password' });


        let foundUser = await UserModel.findOne({ email })
        if (!foundUser) return NextResponse.json({ success: false, message: 'User not found' });

        const dbNames = foundUser.name.toLowerCase().trim().split(' ') as string[]
        const formattedNewnames = name?.toLowerCase()?.trim()?.split(' ')

        //Each name must be in store name
        const allPassed = formattedNewnames.every(nn => dbNames.find(dn => dn == nn));

        if (!allPassed) return NextResponse.json({ success: false, message: 'Invalid name' });

        //Store password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        foundUser.password = hashedPassword;
        await foundUser.save();

        const safeUser = {
            name: foundUser.name,
            image: foundUser.image,
            role: foundUser.role,
            email,
            id: foundUser._id,
        };

        // Log
        logAction({
            title: ` Password Reset - ${name}.`,
            description: `User with email ${email} reset their password.`,
        })

        return NextResponse.json({
            message: "Reset successful",
            success: true,
            data: safeUser,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to reset user password",
        });
    }
}
