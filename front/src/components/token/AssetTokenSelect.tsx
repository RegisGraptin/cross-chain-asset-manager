import { Token } from "@/utils/tokens";
import { Listbox } from "@headlessui/react";
import { BiChevronUp } from "react-icons/bi";

export const AssetTokenSelect = ({
  tokens,
  selected,
  onChange,
}: {
  tokens: Token[];
  selected: string;
  onChange: (value: string) => void;
}) => {
  const selectedToken = tokens.find((t) => t.name === selected);

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full pl-4 pr-10 py-2.5 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          {selectedToken ? (
            <div className="flex items-center">
              <img
                src={`/images/tokens/${selectedToken.symbol.toLowerCase()}.svg`}
                alt={selectedToken.name}
                className="w-5 h-5 mr-2 rounded-full"
              />
              <span className="block truncate">
                {selectedToken.name} ({selectedToken.symbol})
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Select a token</span>
          )}
          <BiChevronUp
            className="w-5 h-5 absolute right-3 top-3 text-gray-400"
            aria-hidden="true"
          />
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {tokens.map((token) => (
            <Listbox.Option
              key={token.name}
              value={token.name}
              className={({ active }: { active: boolean }) =>
                `cursor-default select-none relative py-2 pl-4 pr-4 ${
                  active ? "bg-blue-50" : "text-gray-900"
                }`
              }
            >
              <div className="flex items-center">
                <img
                  src={`/images/tokens/${token.symbol.toLowerCase()}.svg`}
                  alt={token.name}
                  className="w-5 h-5 mr-2 rounded-full"
                />
                <span className="block truncate">
                  {token.name} ({token.symbol})
                </span>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
