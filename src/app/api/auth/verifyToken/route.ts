import { NextResponse } from "next/server";
import { verifyToken } from "@/firebase/firebase.admin.config";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const token = await verifyToken(body);
    return NextResponse.json({ token });
  } catch (err) {
    throw err;
  }
};
