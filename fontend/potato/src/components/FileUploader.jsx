import React, { useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setPrediction(null);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/predict", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setPrediction(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 2 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Potato Disease Detection</Typography>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: 20 }}
                />
                {file && (
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            //border: "1px dashed #ccc",
                            borderRadius: 2,
                            marginBottom: 2,
                            backgroundColor: "#0b0f07",
                        }}
                    >
                        <img
                            src={URL.createObjectURL(file)} // Generate preview URL
                            alt="Uploaded Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "8px",
                            }}
                        />
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isLoading} // Disable button when loading
                >
                    {isLoading ? "Uploading..." : "Upload and Predict"}
                </Button>

                {isLoading && <CircularProgress sx={{ marginTop: 2 }} />}

                {/* Display prediction result */}
                {prediction && (
                    <Box sx={{ marginTop: 2, textAlign: "center" }}>
                        <Typography variant="h6">Prediction Result:</Typography>
                        <Typography>Health: {prediction["Health "]}</Typography>
                        <Typography>Confidence: {Math.round(prediction["confidence "] * 100)}%</Typography>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default FileUploader;
