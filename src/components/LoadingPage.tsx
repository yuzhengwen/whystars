import React from "react";
import { Spinner } from "./ui/spinner";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-5">
      <h2 className="text-2xl">Loading...</h2>
      <Spinner size="large" />
    </div>
  );
};

export default LoadingPage;
