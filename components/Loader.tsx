import React from "react";

const Loader: React.FC<{ isButton?: boolean }> = ({ isButton = false }) => {
  return (
    <div className="flex justify-center ">
      <div
        className={`border-gray-300 animate-spin rounded-full  border-t-blue-600  ${
          isButton ? "h-5 w-5 border-[3px] ml-2" : "h-10 w-10 border-4"
        }`}
      />
    </div>
  );
};

export default Loader;
