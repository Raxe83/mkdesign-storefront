import React from "react";

export const Loader = () => {
  return (
    <div className="flex justify-center py-12">
      <div
        className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent`}
      ></div>
    </div>
  );
};
