import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const Goback = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center font-semibold"
      >
        <ArrowLeft size={40} />
        Back
      </button>
    </div>
  );
};

export default Goback;
