import React, { useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import './FileUploader.css';
import GreenArrow from "../assets/greenArrow.png";
import FAdd from "../assets/ad.jpeg";

const DiseaseDetails = ({ prediction }) => {
    if (!prediction) return null;

    const diseaseInfo = {
        "Early Blight": {
            description: "Early Blight is caused by the fungus Alternaria solani. It typically thrives in warm and humid conditions.",
            impact: [
                "Reduces plant's overall health and vigor.",
                "Can significantly affect crop yields if left unmanaged, although not as destructive as Late Blight."
            ],
            ad: "We recommend using Agri-Solve Organic Potato Fertilizer.",
        },
        "Late Blight": {
            description: "Your plant is showing signs of blight. This disease can severely affect yield.",
            impact: [
                "Highly destructive and can wipe out the entire potato crop if not controlled.",
                "Affects both the leaves and the tubers, severely reducing yield and quality."
            ],
            ad: "We recommend using Agri-Solve Organic Potato Fertilizer.",
        },
        "Healthy": {
            description: "Your plant is healthy! No signs of disease detected.",
            impact: [
                "Your plant is in excellent condition with no signs of disease.",
                "Keep monitoring regularly to maintain plant health."
            ],
            ad: "Boost Productivity with Agri-Solve Products",
        },
        "Bacteria Spots": {
            description: "Bacterial spots in peppers are caused by several bacterial species.",
            impact: [
                "Can lead to premature defoliation, weakening the plant and reducing overall yield.",
                "Affects both the leaves and the fruit, causing lesions that can result in reduced marketability and quality.",
            ],
            ad: "We recommend using Agri-Solve Organic Papper Fertilizer.",
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
            {/* Advertisement/Recommendation Section */}
            <Typography
                variant="subtitle1"
                sx={{
                    color: "green",
                    fontWeight: "bold",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <a href="https://www.daraz.lk/soils-fertilisers-mulches/" target="blank">
                <img
                    className="ad-image"
                    src={FAdd}
                    alt="image of fertilizer"
                    style={{
                        marginRight: "8px", // Add some spacing between the image and text
                        width: "150px", // Adjust the width as needed
                        objectFit: "contain", // Ensure the image retains its aspect ratio
                    }}
                />
                </a>
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
    const [selectedVegetable, setSelectedVegetable] = useState("finder");

    const vegetableOptions = [
        { label: "Potato", value: "potato" },
        { label: "Papper", value: "papper" },
        { label: "Find", value: "finder" },
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
            const response = await axios.post(`http://localhost:8000/predict/${selectedVegetable}`, formData, {
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
