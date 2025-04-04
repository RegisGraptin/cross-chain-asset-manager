import React from "react";

type NavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const VIEW_TABS = ["Aggregation", "Sending"];

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [backgroundStyles, setBackgroundStyles] = React.useState({
    width: 0,
    left: 0,
  });

  React.useEffect(() => {
    const activeIndex = VIEW_TABS.findIndex((tab) => tab === activeTab);
    const activeButton = buttonRefs.current[activeIndex];

    if (activeButton) {
      setBackgroundStyles({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <div className="mb-2">
      <div className="relative inline-flex bg-gray-100 rounded-full p-1.5 shadow-inner">
        {/* Animated background */}
        <div
          className="absolute inset-y-1.5 bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
          style={{
            width: `${backgroundStyles.width}px`,
            transform: `translateX(${backgroundStyles.left}px)`,
          }}
        />

        <div className="relative z-10 flex space-x-1">
          {VIEW_TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
