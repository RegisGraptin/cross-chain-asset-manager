import { useAccount } from "wagmi";
import { usePortfolioProfitAndLoss } from "../../hooks/user";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
// import { Spinner } from "../common/Spinner"; // Assume you have a spinner component

export const PortfolioOverview = () => {
  const { address: userAddress } = useAccount();
  const { data, isLoading } = usePortfolioProfitAndLoss(userAddress);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        {/* <Spinner className="w-8 h-8 text-blue-500" /> */}
        <p className="mt-3 text-sm font-medium text-gray-500">
          Loading portfolio...
        </p>
      </div>
    );
  }

  const { abs_profit_usd, roi } = data.result[0];
  const isPositive = abs_profit_usd >= 0;
  const profitColor = isPositive ? "text-green-600" : "text-red-600";
  const Icon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow max-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Portfolio Overview
        </h2>
        <span className="text-sm text-gray-500">30 Days</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Profit & Loss</p>
          <div className={`flex items-center ${profitColor}`}>
            <Icon className="w-5 h-5 mr-1" />
            <span className="text-2xl font-medium">
              $
              {Math.abs(Number(abs_profit_usd)).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Return %</p>
          <div className={`flex items-center ${profitColor}`}>
            <Icon className="w-5 h-5 mr-1" />
            <span className="text-2xl font-medium">
              {(roi * 100).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              %
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Updated in real-time • Based on chain data
        </p>
      </div>
    </div>
  );
};
