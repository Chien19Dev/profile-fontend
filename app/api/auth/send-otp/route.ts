import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email không tồn tại trong hệ thống" },
        { status: 404 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOTPs = await prisma.passwordResetOTP.count({
      where: {
        email,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (todayOTPs >= 5) {
      return NextResponse.json(
        {
          error:
            "Bạn đã vượt quá giới hạn 5 lần gửi mã trong ngày. Vui lòng thử lại vào ngày mai.",
        },
        { status: 429 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60);
    await prisma.passwordResetOTP.updateMany({
      where: {
        email,
        used: false,
      },
      data: {
        used: true,
      },
    });
    await prisma.passwordResetOTP.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn",
      otp: otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi gửi mã OTP" },
      { status: 500 },
    );
  }
}
