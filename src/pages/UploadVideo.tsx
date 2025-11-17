import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    Alert,
    AlertTitle,
    Snackbar,
    Paper,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadDialog from '../components/UploadDialog';
import SideNav from '../components/SideNav';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useDropzone } from 'react-dropzone';
import { GENERATE_URL, PROCESS_FILE_URL, DRAWERWIDTH } from '../utils/constants';

interface PresignedUrlResponse {
    presigned_url?: string;
    presignedUrl?: string;
    url?: string;
}

interface ProcessFileBody {
    name: string;
    title: string;
    username: string;
    is_public: boolean;
}

const UploadVideo: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<string>('public');
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [videoTitle, setVideoTitle] = useState<string>('');
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
    
    const { user } = useAuthenticator();
    const navigate = useNavigate();

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && videoTitle.trim()) {
            setSelectedFile(acceptedFiles[0]);
            setUploadDialogOpen(true);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
        },
        multiple: false,
        disabled: loading || videoTitle.trim() === '',
    });

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setVideoTitle(event.target.value);
    };

    const handleAlertClose = (): void => {
        setAlertOpen(false);
    };

    const handleFileUpload = async (): Promise<void> => {
        if (!selectedFile) return;

        const is_public = String(visibility).toLowerCase() === 'public';
        setLoading(true);

        try {
            const params = new URLSearchParams({
                filename: selectedFile.name,
                'content-type': selectedFile.type || 'video/mp4',
            });
            const presignedRes = await fetch(`${GENERATE_URL}?${params.toString()}`, {
                method: 'GET',
            });
            if (!presignedRes.ok) throw new Error('Failed to get presigned URL');
            const payload: PresignedUrlResponse = await presignedRes.json();
            const presignedUrl =
                payload.presigned_url || payload.presignedUrl || payload.url;

            if (!presignedUrl) throw new Error('Presigned URL missing in response');

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) resolve();
                    else reject(new Error(`Upload failed: ${xhr.status}`));
                };
                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', selectedFile.type || 'video/mp4');
                xhr.send(selectedFile);
            });

            const processBody: ProcessFileBody = {
                name: selectedFile.name,
                title: videoTitle,
                username: user.signInDetails?.loginId,
                is_public,
            };
            const processRes = await fetch(PROCESS_FILE_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processBody),
            });
            if (!processRes.ok) throw new Error('Failed to start processing');

            setUploadDialogOpen(false);
            setLoading(false);
            setAlertSeverity('success');
            setAlertMessage('Upload complete! Your video will appear on the homepage once processed.');
            setAlertOpen(true);
            
            // Reset form
            setVideoTitle('');
            setSelectedFile(undefined);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setAlertSeverity('error');
            setAlertMessage('Error uploading your file. Please ensure you are uploading an MP4 file and try again.');
            setAlertOpen(true);
        }
    };

    const isTitleEmpty = videoTitle.trim() === '';

    return (
        <Box sx={{ display: 'flex'  }}>
            <SideNav />
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    p: 4,
                    width: { sm: `calc(100% - ${DRAWERWIDTH}px)` },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        maxWidth: 700,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            color: 'primary.main',
                        }}
                    >
                        Upload Video
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Add a title and upload your video file to get started
                    </Typography>

                    {/* Video Title Input */}
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                            Video Title *
                        </Typography>
                        <TextField
                            placeholder="Enter a descriptive title for your video"
                            variant="outlined"
                            value={videoTitle}
                            fullWidth
                            onChange={handleTitleChange}
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    {/* Upload Dropzone */}
                    <Box>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ fontWeight: 600, mb: 1.5 }}
                        >
                            Upload File
                        </Typography>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isTitleEmpty 
                                    ? 'grey.300' 
                                    : isDragActive 
                                    ? 'primary.main' 
                                    : 'grey.400',
                                borderRadius: 2,
                                padding: 4,
                                textAlign: 'center',
                                cursor: isTitleEmpty ? 'not-allowed' : 'pointer',
                                bgcolor: isTitleEmpty 
                                    ? 'grey.50' 
                                    : isDragActive 
                                    ? 'primary.light' 
                                    : 'background.paper',
                                transition: 'all 0.3s ease',
                                opacity: isTitleEmpty ? 0.5 : 1,
                                '&:hover': {
                                    borderColor: isTitleEmpty ? 'grey.300' : 'primary.main',
                                    bgcolor: isTitleEmpty ? 'grey.50' : 'primary.light',
                                },
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon 
                                sx={{ 
                                    fontSize: 64, 
                                    color: isTitleEmpty ? 'grey.400' : 'primary.main',
                                    mb: 2,
                                }} 
                            />
                            
                            {isTitleEmpty ? (
                                <>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Please enter a video title first
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        You need to provide a title before uploading
                                    </Typography>
                                </>
                            ) : selectedFile ? (
                                <>
                                    <Typography variant="h6" color="success.main" gutterBottom>
                                        ✓ File Selected
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {selectedFile.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        {isDragActive 
                                            ? 'Drop your video here' 
                                            : 'Drag & drop your video here'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        or click to browse files
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<FileUploadIcon />}
                                        sx={{ 
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            px: 3,
                                        }}
                                    >
                                        Select Video File
                                    </Button>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        sx={{ display: 'block', mt: 2 }}
                                    >
                                        Supported format: MP4
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Status Messages */}
                    {loading && (
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <AlertTitle>Uploading...</AlertTitle>
                            Your file is being uploaded. Please do not refresh the page.
                        </Alert>
                    )}
                </Paper>
            </Box>

            <UploadDialog
                open={uploadDialogOpen}
                setOpen={setUploadDialogOpen}
                onConfirm={handleFileUpload}
            />
        </Box>
    );
};

export default UploadVideo;