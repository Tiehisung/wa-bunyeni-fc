 

 
interface ProgressBarCpProps {
  allowText?: boolean;
  progressValue?: number;
  maxValue?: number;
  wrapperStyle?: string;
  taskLabel?: string;
  showProgress?: boolean;
  metrics?: {
    success: number;
    failed: number;
  };
  type?: number;
}

export function ProgressBarCp({
  allowText = true,
  progressValue = 0,
  maxValue = 5,
  wrapperStyle = "",
  taskLabel = "Uploading", //Uploading  | Progress
  showProgress = false,
  metrics = { success: 0, failed: 0 },
  type = 0,
}: ProgressBarCpProps) {
  if (type == 1)
    return (
      <div
        className={`fixed bottom-1 border-4 rounded-md p-1 bg-modalOverlay text-white w-[80%] min-w-64 text-sm shadow-md hover:hidden ${
          !showProgress && "hidden"
        } ${wrapperStyle}`}
      >
        <h5 hidden={!allowText}>
          {taskLabel} <span>{progressValue + " of " + maxValue}</span>
        </h5>
        <progress
          value={progressValue}
          max={maxValue}
          className="w-full h-2 text-red-500"
        />
        <h2
          className={`grid grid-cols-2 items-center justify-between text-xs ${
            !metrics && "hidden"
          }`}
        >
          <p>
            Success <span className="text-green-400">{metrics?.success}</span>
          </p>
          <p>
            Failed <span className="text-[#edff4c]"> {metrics?.failed}</span>
          </p>
        </h2>
      </div>
    );
  if (type == 2)
    return (
      <progress
        value={progressValue}
        max={maxValue}
        className={`w-full h-2 ${wrapperStyle}`}
      />
    );
  if (type == 3)
    return (
      <div className={` text-white text-sm shadow-md ${wrapperStyle}`}>
        <h5 hidden={!allowText}>
          {taskLabel} <span>{progressValue + " of " + maxValue}</span>
        </h5>
        <progress
          value={progressValue}
          max={maxValue}
          className="w-full h-2 text-red-500"
        />
        <h2
          className={`grid grid-cols-2 items-center justify-between text-xs ${
            !metrics && "hidden"
          }`}
        >
          <p>
            Success <span className="text-green-400">{metrics?.success}</span>
          </p>
          <p>
            Failed <span className="text-[#edff4c]"> {metrics?.failed}</span>
          </p>
        </h2>
      </div>
    );

  return (
    <progress
      hidden={!showProgress}
      value={progressValue}
      max={maxValue}
      className={" w-full "+ wrapperStyle} 
    />
  );
}
