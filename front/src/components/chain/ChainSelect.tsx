import { Listbox } from "@headlessui/react";
import { BiChevronUp } from "react-icons/bi";
import { avalancheFuji, sepolia } from "viem/chains";

export interface Chain {
  name: string;
  logo: string;
}

const CHAINS = [
  {
    chainId: sepolia.id,
    name: sepolia.name,
    logo: "/images/chains/ethereum.svg",
  },
  {
    chainId: avalancheFuji.id,
    name: avalancheFuji.name,
    logo: "/images/chains/avalanche.svg",
  },
];

export const ChainSelect = ({
  selected,
  onChange,
}: {
  selected: Number | undefined;
  onChange: (value: Number) => void;
}) => {
  const selectedChain = CHAINS.find((t) => t.chainId === selected);

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full pl-4 pr-10 py-2.5 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          {selectedChain ? (
            <div className="flex items-center">
              <img
                src={`${selectedChain.logo.toLowerCase()}`}
                alt={selectedChain.name}
                className="w-5 h-5 mr-2 rounded-full"
              />
              <span className="block truncate">{selectedChain.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Select a Chain</span>
          )}
          <BiChevronUp
            className="w-5 h-5 absolute right-3 top-3 text-gray-400"
            aria-hidden="true"
          />
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {CHAINS.map((chain) => (
            <Listbox.Option
              key={chain.name}
              value={chain.chainId}
              className={({ active }: { active: boolean }) =>
                `cursor-default select-none relative py-2 pl-4 pr-4 ${
                  active ? "bg-blue-50" : "text-gray-900"
                }`
              }
            >
              <div className="flex items-center">
                <img
                  src={`${chain.logo}`}
                  alt={chain.name}
                  className="w-5 h-5 mr-2 rounded-full"
                />
                <span className="block truncate">{chain.name}</span>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
