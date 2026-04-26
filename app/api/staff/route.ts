// app/api/staff/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import StaffModel from '@/models/staff';
import { ELogSeverity } from '@/types/log.interface';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/staff - List all staff
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = (page - 1) * limit;

    const search = searchParams.get('manager_search') || '';
    const isActive = searchParams.get('isActive') === 'true';
    const role = searchParams.get('role') || '';
    const department = searchParams.get('department') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (searchParams.has('isActive')) {
      query.isActive = isActive;
    }

    if (role) query.role = role;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { fullname: regex },
        { email: regex },
        { phone: regex },
        { role: regex },
        { department: regex },
        { qualifications: regex },
      ];
    }

    const cleaned = removeEmptyKeys(query);

    const staff = await StaffModel.find(cleaned)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await StaffModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: staff,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch staff', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch staff'),
    }, { status: 500 });
  }
}

// POST /api/staff - Create new staff
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const {
      fullname,
      phone,
      email,
      dateSigned,
      role,
      avatar,
      department,
      qualifications,
      bio,
      startDate,
      contractType
    } = await request.json();

    // Check if staff with same email exists
    const exists = await StaffModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (exists) {
      return NextResponse.json({
        message: `Staff with ${email} already exists`,
        success: false,
      }, { status: 409 });
    }

    // Check if there's already an active staff for this role
    const existingActive = await StaffModel.findOne({
      role: role,
      isActive: true
    });

    if (existingActive) {
      await StaffModel.updateOne(
        { role: role, isActive: true },
        {
          $set: {
            isActive: false,
            endDate: new Date(),
            updatedAt: new Date(),
          }
        }
      );
    }

    const saved = await StaffModel.create({
      fullname,
      phone,
      email: email.toLowerCase().trim(),
      dateSigned: dateSigned || new Date(),
      role,
      avatar,
      department,
      qualifications: qualifications || [],
      bio,
      startDate: startDate || new Date(),
      contractType: contractType || 'permanent',
      isActive: true,
      createdBy: session.user?._id
    });

    if (!saved) {
      return NextResponse.json({
        message: 'Failed to create staff',
        success: false,
      }, { status: 500 });
    }

    await logAction({
      title: '👔 Staff Created',
      description: `${fullname} appointed as ${role}`,
      severity: ELogSeverity.INFO,
      meta: {
        staffMemberId: saved._id,
        role,
        department,
        replacedManager: existingActive?._id,
      },
    });

    const populatedStaff = await StaffModel.findById(saved._id).lean();

    return NextResponse.json({
      message: 'Staff created successfully',
      success: true,
      data: populatedStaff,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create staff', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create staff'),
      success: false,
    }, { status: 500 });
  }
}