import { verifyEmailExists } from "@/firebase/firebase.admin.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userRecord = await verifyEmailExists(body);
    return NextResponse.json({ userRecord });
  } catch (error) {
    throw error;
  }
}
