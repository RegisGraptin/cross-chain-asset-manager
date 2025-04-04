import { VIEW_TABS } from "../Navigation";
import AggregateView from "./AggregateViews";

const ViewManager = ({ activeTab }) => {
  const activeIndex = VIEW_TABS.indexOf(activeTab);

  return (
    <div className="w-full">
      {/* Carousel Content */}
      <div className="overflow-hidden relative">
        {" "}
        {/* Set appropriate height */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          <div className="w-full flex-shrink-0 p-4">
            <AggregateView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewManager;
