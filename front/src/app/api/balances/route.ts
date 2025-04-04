import { NextResponse } from "next/server";
import { getUserBalance } from "../../../utils/inch";

export async function POST(request: Request) {
  const body = await request.json();
  const { userAddress, chainId } = body;
  const data = await getUserBalance(userAddress, chainId);
  return NextResponse.json(data);
}
