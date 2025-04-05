import { useEffect, useState } from "react";
import { chainsInformation } from "../utils/wagmi";

export function useBalances(
  userAddress: string | undefined,
  chainId: number | undefined
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userAddress || !chainId) return;

    setLoading(true);
    fetch("/api/balances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress, chainId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userAddress, chainId]);

  return { data, loading, error };
}

export function useAllBalances(userAddress: string | undefined) {
  const [data, setData] = useState<{}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData(chainId: string) {
    const res = await fetch("/api/balances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress, chainId: chainId }),
    });

    if (!res.ok) throw new Error(`Failed to fetch data for chain ${chainId}`);
    const result = await res.json();

    setData((prev) => ({ ...prev, [chainId]: result }));
  }

  useEffect(() => {
    if (!userAddress) return;

    setLoading(true);
    for (const chainId of Object.keys(chainsInformation)) {
      fetchData(chainId);
    }
    setLoading(false);
    setData([]);
  }, [userAddress]);

  return { data, loading, error };
}

export function usePortfolio(userAddress: string | undefined) {
  const [data, setData] = useState<{}>({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress }),
    });

    if (!res.ok) throw new Error(`Failed to fetch data for chain`);
    const result = await res.json();

    setData(result);
  }

  useEffect(() => {
    if (!userAddress) return;

    const fetchAllData = async () => {
      // setLoading(true);
      setData({});
      setError(null);

      try {
        const chainIds = Object.keys(chainsInformation);
        const promises = await fetchData();
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userAddress]);

  return { data, isLoading, error };
}

export function usePortfolioProfitAndLoss(userAddress: string | undefined) {
  const [data, setData] = useState<{}>({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    const res = await fetch("/api/profitAndLoss", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress }),
    });

    if (!res.ok) throw new Error(`Failed to fetch data for chain`);
    const result = await res.json();

    console.log("Profit and Loss Data:", result);

    setData(result);
  }

  useEffect(() => {
    if (!userAddress) return;

    const fetchAllData = async () => {
      // setLoading(true);
      setData({});
      setError(null);

      try {
        await fetchData();
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userAddress]);

  return { data, isLoading, error };
}
