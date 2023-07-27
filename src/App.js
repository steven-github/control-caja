import React, { useState, useEffect } from "react";
import "./App.css";
import DataForm from "./DataForm";

function App() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [screenHeight, setScreenHeight] = useState(window.screen.height);

  // Event handler for updating the viewport width on resize
  const handleResize = () => {
    setViewportWidth(window.innerWidth);
    setViewportHeight(window.innerHeight);
    setScreenHeight(window.screen.height);
  };

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Remove event listener when the component unmounts to avoid memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto" style={{ height: viewportHeight }}>
      {/* <h1 className="absolute left-0 right-0 text-center bg-yellow-200">
        {viewportWidth}px * {viewportHeight}px - {screenHeight}px
      </h1> */}
      <h1 className="text-3xl font-bold text-center p-6">Control de Caja</h1>
      {/* <img src="https://www.readypizzacr.com/image/92689584-09.jpg" alt="Ready Pizza" className="mx-auto" width="200" /> */}
      <DataForm />
    </div>
  );
}

export default App;
