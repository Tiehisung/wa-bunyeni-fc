// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { hasher } from '../../../lib/hasher';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('user_search') || '';
    const role = searchParams.get('role') || '';
    const account = searchParams.get('account') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {
      $or: [
        { name: regex },
        { email: regex },
        { role: regex },
      ],
    };

    if (role) query.role = role;
    if (account) query.account = account;

    const cleaned = removeEmptyKeys(query);

    const users = await UserModel.find(cleaned)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch users', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch users'),
    }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { email, password, image, name, role } = await request.json();

    const hashedPass = await hasher(password);

    const alreadyExists = await UserModel.findOne({ email });
    if (alreadyExists) {
      return NextResponse.json({
        success: false,
        message: `User with email ${email} already exists`,
      }, { status: 409 });
    }

    const user = await UserModel.create({
      email,
      password: hashedPass,
      image,
      name,
      role
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    await logAction({
      title: `User [${name}] added.`,
      description: `User added - ${name}`,
    });

    return NextResponse.json({
      success: true,
      message: 'New user created',
      data: userResponse,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create user', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to create user'),
    }, { status: 500 });
  }
}