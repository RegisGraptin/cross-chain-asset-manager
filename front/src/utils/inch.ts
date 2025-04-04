export async function getCurrentValue(walletAddress: string, chainId: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_INCH_PROXY}/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddress}&chain_id=${chainId}`;
  const data = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${process.env.API_KEY}` },
  }).then((res) => res.json());
  return data;
}
