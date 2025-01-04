import React from "react";
import FileUploader from "./components/FileUploader";
import './App.css';  

const App = () => {
  return (
    <div className="app-container">  
      <div className="uploader">
        <FileUploader />
      </div>
    </div>
  );
};

export default App;
