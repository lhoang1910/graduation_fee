export const uploadFile = (file) => {
    return URL.createObjectURL(file);
};

export const displayFile = (filePath) => {
    const extension = filePath.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(extension)) {
        return <img src={filePath} alt="attachment" style={{ maxWidth: "100%" }} />;
    } else if (["mp3", "wav"].includes(extension)) {
        return <audio controls src={filePath}></audio>;
    } else if (["mp4", "webm"].includes(extension)) {
        return <video controls src={filePath} style={{ maxWidth: "100%" }}></video>;
    }
    return <a href={filePath} target="_blank" rel="noopener noreferrer">Xem file</a>;
};
