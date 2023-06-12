import React from "react";
import Loader from "./Loader";

// eslint-disable-next-line react/prop-types
const PrimaryButton = ({ loading, label }) => {
  return (
    <button
      type="submit"
      className="w-full bg-primary text-white py-4 rounded-3xl my-4 text-semibold flex justify-center items-center"
    >
      {loading ? <Loader /> : label}
    </button>
  );
};

export default PrimaryButton;
