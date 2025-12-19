import { NextResponse } from "next/server";

export class ApiResponse {
  static success(data: any, message = "Success", status = 200) {
    return NextResponse.json({
      success: true,
      message,
      data,
    }, { status });
  }

  static error(message: string, status = 400) {
    return NextResponse.json({
      success: false,
      message,
    }, { status });
  }

  static unauthorized(message = "Authentication required") {
    return this.error(message, 401);
  }

  static forbidden(message = "Access denied") {
    return this.error(message, 403);
  }

  static serverError(error: any) {
    console.error("API Error:", error);
    return this.error("Internal Server Error", 500);
  }
}