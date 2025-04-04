export async function getCurrentValue(walletAddress: string, chainId: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_INCH_PROXY}/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddress}&chain_id=${chainId}`;
  console.log("Fetching current value from:", endpoint);
  const data = await fetch(endpoint).then((res) => res.json());
  console.log("Fetched data:", data);
  return data;
}
