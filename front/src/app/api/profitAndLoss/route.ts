import { NextResponse } from "next/server";
import { getProfitAndLoss } from "../../../utils/inch";

export async function POST(request: Request) {
  const body = await request.json();
  const { userAddress, chainId } = body;
  const data = await getProfitAndLoss(userAddress);
  return NextResponse.json(data);
}
