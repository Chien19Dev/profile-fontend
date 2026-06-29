import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email và mã OTP là bắt buộc" },
        { status: 400 },
      );
    }
    const otp = await prisma.passwordResetOTP.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return NextResponse.json(
        { error: "Mã OTP không hợp lệ hoặc đã hết hạn" },
        { status: 400 },
      );
    }
    await prisma.passwordResetOTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      message: "Mã OTP hợp lệ",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xác minh mã OTP" },
      { status: 500 },
    );
  }
}
