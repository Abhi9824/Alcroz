import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader-box">
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
      </div>
    </div>
  );
};

export default Loading;
