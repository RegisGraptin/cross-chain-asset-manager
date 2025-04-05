"use client";

import Image from "next/image";

import { Address } from "viem";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { usePortfolio } from "../../hooks/user";
import WidgetLayout from "./WidgetLayout";

interface AssetAllocation {
  protocol: string;
  usdValue: number;
  percentage: number;
  color: string;
}

const colors: string[] = [
  "#F5AC37",
  "#2775CA",
  "#26A17B",
  "#627EEA",
  "#F09242",
  "#B6509E",
  "#2A5ADA",
  "#0F8FF8",
];

export default function AllocationWidget({
  userAddress,
}: {
  userAddress: Address | undefined;
}) {
  const { data, isLoading } = usePortfolio(userAddress);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([]);

  useEffect(() => {
    if (isLoading) return;

    let proccessedAllocation: AssetAllocation[] = [];

    let total_value = 0;

    Object.entries(data.result).forEach(([_, data]) => {
      total_value += data.result[0].value_usd;
    });

    Object.entries(data.result).forEach(([_, data], index) => {
      const assetData = {
        protocol: data.protocol_name,
        usdValue: data.result[0].value_usd,
        color: colors[index],
        percentage: (data.result[0].value_usd * 100) / total_value,
      };
      proccessedAllocation.push(assetData);
    });

    setAssetAllocation(proccessedAllocation);
  }, [isLoading]);

  if (isLoading) {
    return (
      <WidgetLayout>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </WidgetLayout>
    );
  }

  return (
    <WidgetLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Portfolio Overview
          </h2>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
                nameKey="protocol"
              >
                {assetAllocation.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  border: "none",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-4">
                    {payload?.map((entry: any) => (
                      <div
                        key={entry.value}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List View */}
        <div className="space-y-3 mt-16">
          {assetAllocation.map((allocation) => (
            <div
              key={allocation.protocol}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={`/images/protocols/${allocation.protocol.toLowerCase()}.svg`}
                  alt={`${allocation.protocol} icon`}
                  className="h-6 w-6"
                  width={24}
                  height={24}
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {allocation.protocol}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${allocation.usdValue.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {allocation.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetLayout>
  );
}
