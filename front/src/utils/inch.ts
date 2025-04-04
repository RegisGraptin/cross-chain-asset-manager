export async function getCurrentValue(walletAddress: string, chainId: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_INCH_PROXY}/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddress}&chain_id=${chainId}`;
  console.log("Fetching current value from:", endpoint);
  const data = await fetch(endpoint).then((res) => res.json());
  console.log("Fetched data:", data);
  return data;
}

export async function getUserBalance(walletAddress: string, chainId: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_INCH_PROXY}/balance/v1.2/${chainId}/balances/${walletAddress}`;
  const data = await fetch(endpoint).then((res) => res.json());
  return data;
}
