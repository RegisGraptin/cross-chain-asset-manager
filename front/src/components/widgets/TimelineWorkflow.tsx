export const TimelineWorkflow = ({ currentPhase }) => {
  const phases = [
    {
      id: "checkChain",
      label: "Network Check",
      subtitle: "Verify blockchain network",
    },
    { id: "approve", label: "Approval", subtitle: "Authorize token access" },
    { id: "burn", label: "Burn Process", subtitle: "Destroy existing tokens" },
    { id: "mint", label: "Minting", subtitle: "Create new assets" },
    { id: "completed", label: "Completion", subtitle: "Process finalized" },
  ];

  const getStatus = (phaseId) => {
    const currentIndex = phases.findIndex((p) => p.id === currentPhase);
    const phaseIndex = phases.findIndex((p) => p.id === phaseId);

    if (phaseId === currentPhase) return "current";
    if (phaseIndex < currentIndex) return "complete";
    return "upcoming";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between">
        {phases.map((phase, index) => {
          const status = getStatus(phase.id);
          const isCurrent = status === "current";
          const isComplete = status === "complete";

          return (
            <div
              key={phase.id}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Connecting line */}
              {index > 0 && (
                <div
                  className={`absolute h-1 w-full top-4 -translate-x-1/2 ${
                    isComplete || isCurrent ? "bg-blue-500" : "bg-gray-200"
                  }`}
                ></div>
              )}

              {/* Step circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                ${isComplete ? "bg-green-500" : ""}
                ${isCurrent ? "bg-blue-500" : ""}
                ${status === "upcoming" ? "bg-gray-200" : ""}
              `}
              >
                {isComplete ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </div>

              {/* Labels */}
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${
                    isComplete || isCurrent ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {phase.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{phase.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current phase indicator */}
      <div className="mt-8 text-center">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
          {phases.find((p) => p.id === currentPhase)?.label}
        </span>
      </div>
    </div>
  );
};

// Example icons (replace with your actual icons)
const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
