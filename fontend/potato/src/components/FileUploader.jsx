import React, { useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import './FileUploader.css';
import GreenArrow from "../assets/greenArrow.png";

const DiseaseDetails = ({ prediction }) => {
    if (!prediction) return null;

    const diseaseInfo = {
        "Early Blight": {
            description: "Early Blight is caused by the fungus Alternaria solani. It typically thrives in warm and humid conditions.",
            impact: [
                "Reduces plant's overall health and vigor.",
                "Can significantly affect crop yields if left unmanaged, although not as destructive as Late Blight."
            ],
            manage: [
                "Apply fungicides regularly to control the disease.",
                "Rotate crops with non-solanaceous plants like beans to reduce the risk of infection.",
            ],
            ad: "To maintain plant health, try using XYZ Organic Fertilizer.",
        },
        "Late Blight": {
            description: "Your plant is showing signs of blight. This disease can severely affect yield.",
            impact: [
                "Highly destructive and can wipe out the entire potato crop if not controlled.",
                "Affects both the leaves and the tubers, severely reducing yield and quality."
            ],
            manage: [
                "Use systemic fungicides for effective disease management.",
                "Plant Late Blight-resistant potato varieties to reduce its impact.",
            ],
            ad: "Use ABC Fungicide to protect your crops from blight.",
        },
        "Healthy": {
            description: "Your plant is healthy! No signs of disease detected.",
            impact: [
                "Your plant is in excellent condition with no signs of disease.",
                "Keep monitoring regularly to maintain plant health."
            ],
            manage: [
                "Maintain good agricultural practices to keep the plant healthy.",
                "Regularly inspect your plant for any signs of disease."
            ],
            ad: "Keep monitoring regularly and maintain good agricultural practices.",
        },
    };

    const health = prediction["Health "]; // Ensure this key matches the API response
    const { description, ad, impact, manage } = diseaseInfo[health] || {
        description: "Unknown disease detected.",
        ad: "Consult an expert for proper care.",
        impact: [],
        manage: [],
    };

    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: "#f7f7f7",
                borderRadius: 2,
                maxWidth: 400,
                boxShadow: 2,
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Disease Details</Typography>
            <Typography sx={{ marginBottom: 1 }}>{description}</Typography>
            <hr />
            {/* Impact Section */}
            <Typography variant="h5" sx={{ marginBottom: 1 }}>Impact</Typography>
            <ul style={{ marginLeft: 0 }}>
                {impact.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
            <hr />
            {/* Manage Section */}
            <Typography variant="h5" sx={{ marginBottom: 1 }}>To Manage</Typography>
            <ul style={{ marginLeft: 0 }}>
                {manage.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
            <hr />
            {/* Advertisement/Recommendation Section */}
            <Typography variant="subtitle1" sx={{ color: "green", fontWeight: "bold", marginTop: 2 }}>
                {ad}

            </Typography>
        </Box>
    );
};


const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isPredicted, setIsPredicted] = useState(false);
    const [selectedVegetable, setSelectedVegetable] = useState("common");

    const vegetableOptions = [
        { label: "Potato", value: "potato" },
        { label: "Tomato", value: "tomato" },
        { label: "Papper", value: "papper" },
        { label: "Common", value: "Common" },
    ];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setPrediction(null);
        setIsPredicted(false);
    };

    const handleVegetableChange = (event) => {
        setSelectedVegetable(event.target.value);
    };

    const handleRefresh = () => {
        setIsPredicted(false); 
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
            const response = await axios.post("http://localhost:8000/predict/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setPrediction(response.data);
            setIsPredicted(true);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isPredicted && (
                <Button
                    onClick={handleRefresh}
                >
                <img className="green-arrow" src={GreenArrow} alt="Arrow" />
                </Button>
            )}
        <Box className="container">

            {/* Image Upload Section */}
            <Box
                className={`section image-uploader ${isPredicted ? "" : "visible"}`}
                sx={{
                    transform: isPredicted ? "translateX(-50%)" : "translateX(0)",
                    width: 300,
                }}
            >
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="vegetable-select-label">Select Vegetable</InputLabel>
                    <Select
                        labelId="vegetable-select-label"
                        value={selectedVegetable}
                        onChange={handleVegetableChange}
                    >
                        {vegetableOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                            borderRadius: 2,
                            marginBottom: 2,
                            backgroundColor: "#034829",
                        }}
                    >
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "8px",
                            }}
                        />
                    </Box>
                )}
                <Button className="upload-button"
                    variant="contained"
                    onClick={handleUpload}
                    disabled={isLoading}
                >
                    {isLoading ? "Uploading..." : "Upload and Predict"}
                </Button>
                {isLoading && <CircularProgress sx={{ marginTop: 2 }} />}
            </Box>

            {/* Prediction Results Section */}
            <Box
                className={`section prediction-results ${isPredicted ? "visible" : ""}`}
                sx={{
                    transform: isPredicted ? "translateX(0)" : "translateX(50%)",

                }}
            >
                {isPredicted && (
                    <>
                        <Typography variant="h4" sx={{ marginBottom: 2 }}>
                            Prediction Result
                        </Typography>
                        <Typography className="result">Health: {prediction["Health "]}</Typography>
                        <Typography className="result">
                            Confidence: {Math.round(prediction["confidence "] * 100)}%
                        </Typography>
                        <DiseaseDetails prediction={prediction} />
                    </>
                )}
            </Box>
        </Box>
        </div>

    );
};

export default FileUploader;
