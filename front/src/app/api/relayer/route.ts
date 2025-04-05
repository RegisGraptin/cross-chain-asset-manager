import { NextResponse } from "next/server";
import { submitToTheRelayer } from "../../../utils/inch";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    srcChainId,
    dstChainId,
    srcTokenAddress,
    dstTokenAddress,
    amount,
    userAddress,
  } = body;
  const data = await submitToTheRelayer(
    srcChainId,
    dstChainId,
    srcTokenAddress,
    dstTokenAddress,
    amount,
    userAddress
  );
  return NextResponse.json(data);
}
