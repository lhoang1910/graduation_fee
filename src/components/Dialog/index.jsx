import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography } from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';

export default function SimpleDialog() {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSave = () => {
        console.log('Saved value:', inputValue);
        setOpen(false); // Đóng Dialog sau khi lưu
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                sx={{
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)',
                    '&:hover': {
                        backgroundColor: '#0056b3',
                    },
                }}
            >
                Open Popup
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ marginRight: 2, color: '#28a745' }} />
                    <Typography variant="h6" color="primary">Please Enter Your Information</Typography>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter a Value"
                        fullWidth
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                        sx={{ marginBottom: 2 }}
                    />

                    <Box textAlign="center">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Illustration"
                            style={{
                                width: '100%',
                                maxWidth: '200px',
                                borderRadius: '12px',
                                marginTop: '20px',
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="secondary"
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            padding: '8px 16px',
                            marginRight: 2,
                            '&:hover': {
                                backgroundColor: '#f8f9fa',
                            },
                        }}
                    >
                        Close
                    </Button>

                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
