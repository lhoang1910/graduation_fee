import React, { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";

const UploadFileUtil = ({ allowedFormats, hint }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState("");
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Vui lòng chọn file.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setFilePath(response.data.filePath); // Giả sử backend trả về filePath
            alert("Upload thành công!");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Upload thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TextField
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: allowedFormats.join(",") }}
            />
            <Button onClick={handleUpload} variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
            {hint && <p className="hint">{hint}</p>}
            {filePath && <p>File uploaded! Path: {filePath}</p>}
        </div>
    );
};

export default UploadFileUtil;
