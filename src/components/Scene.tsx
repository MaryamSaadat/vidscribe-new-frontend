// Scene.tsx - Refactored to use API service
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Box,
    Skeleton,
    Stack,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import {
    Description,
    fetchVideoDescriptions,
    createDescription,
    updateDescription,
    deleteDescription,
    formatTime,
    validateTimestamps,
    validateDescription,
} from "../api/descriptionsApi";

// Component Props
interface SceneProps {
    id: string | number;
}

const Scene: React.FC<SceneProps> = ({ id }) => {
    // State Management
    const [descriptions, setDescriptions] = useState<Description[]>([]);
    const [editedDescription, setEditedDescription] = useState<string>("");
    const [editedStartTime, setEditedStartTime] = useState<string>("");
    const [editedEndTime, setEditedEndTime] = useState<string>("");
    const [selectedDescriptionId, setSelectedDescriptionId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [descriptionToDelete, setDescriptionToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Fetch descriptions on mount and when ID changes
    useEffect(() => {
        loadDescriptions();
    }, [id]);

    // ============================================
    // API OPERATIONS
    // ============================================

    const loadDescriptions = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await fetchVideoDescriptions(id);
            setDescriptions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load descriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDescription = async (): Promise<void> => {
        // Validate inputs
        const timestampValidation = validateTimestamps(editedStartTime, editedEndTime);
        if (!timestampValidation.isValid) {
            setError(timestampValidation.error || '');
            return;
        }

        const descriptionValidation = validateDescription(editedDescription);
        if (!descriptionValidation.isValid) {
            setError(descriptionValidation.error || '');
            return;
        }

        try {
            setIsSaving(true);
            await createDescription({
                video_id: id,
                description: editedDescription,
                time_stamp_start: parseInt(editedStartTime),
                time_stamp_end: parseInt(editedEndTime),
            });

            setSuccessMessage("Description added successfully!");
            await loadDescriptions();
            setIsAdding(false);
            setError("");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add description');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveClick = async (): Promise<void> => {
        if (selectedDescriptionId === null) return;

        // Validate inputs
        const timestampValidation = validateTimestamps(editedStartTime, editedEndTime);
        if (!timestampValidation.isValid) {
            setError(timestampValidation.error || '');
            return;
        }

        const descriptionValidation = validateDescription(editedDescription);
        if (!descriptionValidation.isValid) {
            setError(descriptionValidation.error || '');
            return;
        }

        try {
            setIsSaving(true);
            await updateDescription({
                id: selectedDescriptionId,
                modified_descriptions: editedDescription,
                time_stamp_start: parseInt(editedStartTime),
                time_stamp_end: parseInt(editedEndTime),
            });

            setSuccessMessage("Description updated successfully!");
            await loadDescriptions();
            setIsEditing(false);
            setSelectedDescriptionId(null);
            setError("");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update description');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async (): Promise<void> => {
        if (descriptionToDelete === null) return;
        console.log("Deleting description with ID:", descriptionToDelete);
        try {
            setIsDeleting(true);
            await deleteDescription(descriptionToDelete);

            setSuccessMessage("Description deleted successfully!");
            await loadDescriptions();
            handleDeleteDialogClose();
            setTimeout(() => setSuccessMessage(""), 3000);

            // Cancel editing if we were editing this description
            if (selectedDescriptionId === descriptionToDelete) {
                setIsEditing(false);
                setSelectedDescriptionId(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete description');
            handleDeleteDialogClose();
        } finally {
            setIsDeleting(false);
        }
    };

    // ============================================
    // UI HANDLERS
    // ============================================

    const handleAddNewClick = (): void => {
        setIsAdding(true);
        setEditedDescription("");
        setEditedStartTime("");
        setEditedEndTime("");
        setError("");
        setSuccessMessage("");
    };

    const handleEditClick = (
        descriptionId: number,
        textHistory: string[],
        startTime: number,
        endTime: number
    ): void => {
        const finalDescription = textHistory[textHistory.length - 1] || "";
        setSelectedDescriptionId(descriptionId);
        setEditedDescription(finalDescription);
        setEditedStartTime(startTime.toString());
        setEditedEndTime(endTime.toString());
        setIsEditing(true);
        setIsAdding(false);
        setError("");
        setSuccessMessage("");
    };

    const handleCancelClick = (): void => {
        setIsEditing(false);
        setIsAdding(false);
        setSelectedDescriptionId(null);
        setError("");
        setSuccessMessage("");
    };

    const handleDeleteDialogOpen = (descriptionId: number): void => {
        setDescriptionToDelete(descriptionId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = (): void => {
        setDeleteDialogOpen(false);
        setDescriptionToDelete(null);
    };

    // ============================================
    // RENDER: Loading State
    // ============================================

    if (isLoading) {
        return (
            <Box role="status" aria-live="polite" aria-label="Loading descriptions">
                <Stack spacing={2}>
                    {[1, 2, 3].map((item) => (
                        <Card key={item} variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
                                <Skeleton variant="text" height={80} />
                                <Skeleton variant="rectangular" width={100} height={36} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>
        );
    }

    // ============================================
    // RENDER: Main Component
    // ============================================

    return (
        <Box component="section" aria-labelledby="descriptions-heading"  
        sx={{
        backgroundColor: "white",
        borderRadius: 2,
      }}>
            {/* Header */}
            <Box sx={{ borderRadius:2,display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3,  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",p: 2.5, color: "white" }}>
                <Typography 
                    id="descriptions-heading" 
                    variant="h5" 
                    component="h2"
                    sx={{ fontWeight: 600 }}
                >
                    Scene Descriptions
                </Typography>
                
                <Button
                    onClick={handleAddNewClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={isAdding || isEditing}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                    aria-label="Add new scene description"
                >
                    Add New Description
                </Button>
            </Box>

            {/* Success Message */}
            {successMessage && (
                <Fade in>
                    <Alert severity="success" sx={{ mb: 2 }} role="status" aria-live="polite">
                        {successMessage}
                    </Alert>
                </Fade>
            )}

            {/* Add New Description Form */}
            {isAdding && (
                <Fade in>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: 'primary.main',
                            mb: 3,
                            bgcolor: 'primary.50',
                        }}
                        role="form"
                        aria-labelledby="add-description-heading"
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography id="add-description-heading" variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Add New Scene Description
                            </Typography>
                            
                            <Stack spacing={2}>
                                <TextField
                                    multiline
                                    fullWidth
                                    rows={4}
                                    label="Description"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                                    inputProps={{ 'aria-label': 'Scene description text', 'aria-required': 'true' }}
                                    required
                                />
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            label="Start Time (seconds)"
                                            type="number"
                                            value={editedStartTime}
                                            onChange={(e) => setEditedStartTime(e.target.value)}
                                            fullWidth
                                            inputProps={{ min: 0, step: 1, 'aria-label': 'Start timestamp', 'aria-describedby': 'start-time-format' }}
                                            required
                                        />
                                        <Typography id="start-time-format" variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            {editedStartTime ? `${formatTime(parseInt(editedStartTime) || 0)}` : 'MM:SS'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            label="End Time (seconds)"
                                            type="number"
                                            value={editedEndTime}
                                            onChange={(e) => setEditedEndTime(e.target.value)}
                                            fullWidth
                                            inputProps={{ min: 0, step: 1, 'aria-label': 'End timestamp', 'aria-describedby': 'end-time-format' }}
                                            required
                                        />
                                        <Typography id="end-time-format" variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            {editedEndTime ? `${formatTime(parseInt(editedEndTime) || 0)}` : 'MM:SS'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {error && <Alert severity="error" role="alert">{error}</Alert>}

                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button onClick={handleCancelClick} variant="outlined" startIcon={<CloseIcon />} disabled={isSaving} sx={{ textTransform: 'none' }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddDescription} variant="contained" startIcon={<SaveIcon />} disabled={isSaving} sx={{ textTransform: 'none' }}>
                                        {isSaving ? 'Adding...' : 'Add Description'}
                                    </Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            {/* Descriptions List */}
            <Stack spacing={2.5} role="list" aria-label="Scene descriptions">
                {descriptions.length === 0 ? (
                    <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <Typography variant="body1" color="text.secondary">
                            No descriptions available. Click "Add New Description" to create one.
                        </Typography>
                    </Card>
                ) : (
                    descriptions
                        .sort((a, b) => a.timestamp_start - b.timestamp_start)
                        .map((desc, index) => {
                            const text = desc.text_history[desc.text_history.length - 1] || "";
                            const editing = isEditing && selectedDescriptionId === desc.id;

                            return (
                                <Fade in key={desc.id} timeout={300}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: editing ? 'primary.main' : 'divider',
                                            transition: 'all 0.3s',
                                            '&:hover': { boxShadow: 2, borderColor: 'primary.light' },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            {editing ? (
                                                <Stack spacing={2}>
                                                    <Typography variant="h6" fontWeight={600}>Edit Description</Typography>
                                                    <TextField
                                                        multiline
                                                        fullWidth
                                                        rows={4}
                                                        value={editedDescription}
                                                        onChange={(e) => setEditedDescription(e.target.value)}
                                                        inputProps={{ 'aria-label': 'Edit description text' }}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <TextField
                                                            label="Start (sec)"
                                                            type="number"
                                                            value={editedStartTime}
                                                            onChange={(e) => setEditedStartTime(e.target.value)}
                                                            fullWidth
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <TextField
                                                            label="End (sec)"
                                                            type="number"
                                                            value={editedEndTime}
                                                            onChange={(e) => setEditedEndTime(e.target.value)}
                                                            fullWidth
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    </Box>
                                                    {error && <Alert severity="error">{error}</Alert>}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button onClick={() => handleDeleteDialogOpen(desc.id)} color="error" variant="outlined" startIcon={<DeleteIcon />}>
                                                            Delete
                                                        </Button>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button onClick={handleCancelClick} variant="outlined">Cancel</Button>
                                                            <Button onClick={handleSaveClick} variant="contained" disabled={isSaving}>
                                                                {isSaving ? 'Saving...' : 'Save'}
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Stack>
                                            ) : (
                                                <>
                                                    <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
                                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                            {text}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button
                                                            onClick={() => handleEditClick(desc.id, desc.text_history, desc.timestamp_start, desc.timestamp_end)}
                                                            variant="contained"
                                                            startIcon={<EditIcon />}
                                                            disabled={isEditing || isAdding}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button onClick={() => handleDeleteDialogOpen(desc.id)} variant="outlined" color="error" startIcon={<DeleteIcon />} disabled={isDeleting || isEditing || isAdding}>
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Fade>
                            );
                        })
                )}
            </Stack>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete Description?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} disabled={isDeleting}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting} autoFocus>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Scene;

// // Scene.tsx
// import React, { useState, useEffect } from "react";
// import {
//     Card,
//     CardContent,
//     Typography,
//     Button,
//     TextField,
//     Box,
//     Skeleton,
//     Stack,
//     Fade,
//     Tooltip,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     Alert,
// } from "@mui/material";
// import {
//     Edit as EditIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
//     Schedule as ScheduleIcon,
//     Delete as DeleteIcon,
//     Add as AddIcon,
// } from "@mui/icons-material";
// import axios, { AxiosError } from "axios";
// import { GET_VIDEO_DESCRIPTIONS } from "../utils/constants";

// // Type definitions
// interface Description {
//     id: number;
//     text_history: string[];
//     timestamp_end: number;
//     timestamp_start: number;
//     username_history: string[];
//     video_id: number;
// }

// interface SceneProps {
//     id: string | number;
// }

// interface UpdateDescriptionPayload {
//     id: number;
//     modified_descriptions: string;
//     time_stamp_start: number;
//     time_stamp_end: number;
//     jwt: string | undefined;
// }

// interface CreateDescriptionPayload {
//     video_id: string | number;
//     description: string;
//     time_stamp_start: number;
//     time_stamp_end: number;
//     jwt: string | undefined;
// }

// interface UpdateDescriptionResponse {
//     message: string;
// }

// // Helper function to format time in MM:SS
// const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
// };

// // Helper function to convert MM:SS to seconds
// const timeToSeconds = (timeStr: string): number => {
//     const parts = timeStr.split(':');
//     if (parts.length !== 2) return 0;
//     const mins = parseInt(parts[0]) || 0;
//     const secs = parseInt(parts[1]) || 0;
//     return mins * 60 + secs;
// };

// const Scene: React.FC<SceneProps> = ({ id }) => {
//     const [descriptions, setDescriptions] = useState<Description[]>([]);
//     const [editedDescription, setEditedDescription] = useState<string>("");
//     const [editedStartTime, setEditedStartTime] = useState<string>("");
//     const [editedEndTime, setEditedEndTime] = useState<string>("");
//     const [selectedDescriptionId, setSelectedDescriptionId] = useState<number | null>(null);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [isAdding, setIsAdding] = useState<boolean>(false);
//     const [isLoading, setLoading] = useState<boolean>(true);
//     const [isDeleting, setIsDeleting] = useState<boolean>(false);
//     const [isSaving, setIsSaving] = useState<boolean>(false);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
//     const [descriptionToDelete, setDescriptionToDelete] = useState<number | null>(null);
//     const [error, setError] = useState<string>("");
//     const [successMessage, setSuccessMessage] = useState<string>("");

//     const url = GET_VIDEO_DESCRIPTIONS;
//     const parameters = { video_id: id };

//     useEffect(() => {
//         fetchDescriptions();
//     }, [id]);

//     const fetchDescriptions = () => {
//         axios
//             .get<{ descriptions: Description[] }>(url, { params: parameters })
//             .then((response) => {
//                 console.log("Received description data", response.data);
//                 const descriptions = response.data.descriptions;
//                 setDescriptions(descriptions);
//                 setLoading(false);
//             })
//             .catch((err: AxiosError) => {
//                 console.log("Error receiving description data", err);
//                 setLoading(false);
//                 setError("Failed to load descriptions. Please try again.");
//             });
//     };

//     const handleAddNewClick = (): void => {
//         setIsAdding(true);
//         setEditedDescription("");
//         setEditedStartTime("");
//         setEditedEndTime("");
//         setError("");
//         setSuccessMessage("");
//     };

//     const handleEditClick = (
//         descriptionId: number,
//         textHistory: string[],
//         startTime: number,
//         endTime: number
//     ): void => {
//         const finalDescription = textHistory[textHistory.length - 1] || "";
//         setSelectedDescriptionId(descriptionId);
//         setEditedDescription(finalDescription);
//         setEditedStartTime(startTime.toString());
//         setEditedEndTime(endTime.toString());
//         setIsEditing(true);
//         setIsAdding(false);
//         setError("");
//         setSuccessMessage("");
//     };

//     const handleCancelClick = (): void => {
//         setIsEditing(false);
//         setIsAdding(false);
//         setSelectedDescriptionId(null);
//         setError("");
//         setSuccessMessage("");
//     };

//     const handleSaveClick = (): void => {
//         if (selectedDescriptionId !== null) {
//             const startSeconds = parseInt(editedStartTime);
//             const endSeconds = parseInt(editedEndTime);

//             if (isNaN(startSeconds) || isNaN(endSeconds)) {
//                 setError("Please enter valid timestamps.");
//                 return;
//             }

//             if (endSeconds <= startSeconds) {
//                 setError("End timestamp must be greater than start timestamp.");
//                 return;
//             }

//             if (!editedDescription.trim()) {
//                 setError("Description cannot be empty.");
//                 return;
//             }

//             setIsSaving(true);
//             const updatedDescription: UpdateDescriptionPayload = {
//                 id: selectedDescriptionId,
//                 modified_descriptions: editedDescription,
//                 time_stamp_start: startSeconds,
//                 time_stamp_end: endSeconds,
//                 jwt: token,
//             };

//             console.log("Updated descriptions:", updatedDescription);
//             axios
//                 .put<UpdateDescriptionResponse>(
//                     `https://vidscribe.org/b/descriptions/`,
//                     updatedDescription
//                 )
//                 .then((response) => {
//                     console.log("Description updated successfully:", response.data.message);
//                     setSuccessMessage("Description updated successfully!");
//                     fetchDescriptions();
//                     setIsEditing(false);
//                     setSelectedDescriptionId(null);
//                     setError("");
//                     setIsSaving(false);
                    
//                     // Clear success message after 3 seconds
//                     setTimeout(() => setSuccessMessage(""), 3000);
//                 })
//                 .catch((error: AxiosError) => {
//                     console.error("Error updating description:", error);
//                     setError("Failed to update description. Please try again.");
//                     setIsSaving(false);
//                 });
//         }
//     };

//     const handleAddDescription = (): void => {
//         const startSeconds = parseInt(editedStartTime);
//         const endSeconds = parseInt(editedEndTime);

//         if (isNaN(startSeconds) || isNaN(endSeconds)) {
//             setError("Please enter valid timestamps.");
//             return;
//         }

//         if (endSeconds <= startSeconds) {
//             setError("End timestamp must be greater than start timestamp.");
//             return;
//         }

//         if (!editedDescription.trim()) {
//             setError("Description cannot be empty.");
//             return;
//         }

//         setIsSaving(true);
//         const newDescription: CreateDescriptionPayload = {
//             video_id: id,
//             description: editedDescription,
//             time_stamp_start: startSeconds,
//             time_stamp_end: endSeconds,
//             jwt: token,
//         };

//         console.log("Creating new description:", newDescription);
//         axios
//             .post<UpdateDescriptionResponse>(
//                 `https://vidscribe.org/b/descriptions/`,
//                 newDescription
//             )
//             .then((response) => {
//                 console.log("Description created successfully:", response.data.message);
//                 setSuccessMessage("Description added successfully!");
//                 fetchDescriptions();
//                 setIsAdding(false);
//                 setError("");
//                 setIsSaving(false);
                
//                 // Clear success message after 3 seconds
//                 setTimeout(() => setSuccessMessage(""), 3000);
//             })
//             .catch((error: AxiosError) => {
//                 console.error("Error creating description:", error);
//                 setError("Failed to add description. Please try again.");
//                 setIsSaving(false);
//             });
//     };

//     const handleDeleteDialogOpen = (descriptionId: number): void => {
//         setDescriptionToDelete(descriptionId);
//         setDeleteDialogOpen(true);
//     };

//     const handleDeleteDialogClose = (): void => {
//         setDeleteDialogOpen(false);
//         setDescriptionToDelete(null);
//     };

//     const handleConfirmDelete = (): void => {
//         if (descriptionToDelete !== null) {
//             setIsDeleting(true);
            
//             axios
//                 .delete(`https://vidscribe.org/b/descriptions/${descriptionToDelete}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 })
//                 .then((response) => {
//                     console.log("Description deleted successfully");
//                     setSuccessMessage("Description deleted successfully!");
//                     fetchDescriptions();
//                     setIsDeleting(false);
//                     handleDeleteDialogClose();
                    
//                     // Clear success message after 3 seconds
//                     setTimeout(() => setSuccessMessage(""), 3000);
                    
//                     // If we were editing this description, cancel editing
//                     if (selectedDescriptionId === descriptionToDelete) {
//                         setIsEditing(false);
//                         setSelectedDescriptionId(null);
//                     }
//                 })
//                 .catch((error: AxiosError) => {
//                     console.error("Error deleting description:", error);
//                     setError("Failed to delete description. Please try again.");
//                     setIsDeleting(false);
//                     handleDeleteDialogClose();
//                 });
//         }
//     };

//     if (isLoading) {
//         return (
//             <Box role="status" aria-live="polite" aria-label="Loading descriptions">
//                 <Stack spacing={2}>
//                     {[1, 2, 3].map((item) => (
//                         <Card key={item} variant="outlined" sx={{ borderRadius: 2 }}>
//                             <CardContent>
//                                 <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
//                                 <Skeleton variant="text" height={80} />
//                                 <Skeleton variant="rectangular" width={100} height={36} sx={{ mt: 2 }} />
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </Stack>
//             </Box>
//         );
//     }

//     return (
//         <Box component="section" aria-labelledby="descriptions-heading">
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography 
//                     id="descriptions-heading" 
//                     variant="h5" 
//                     component="h2"
//                     sx={{ fontWeight: 600 }}
//                 >
//                     Scene Descriptions
//                 </Typography>
                
//                 <Button
//                     onClick={handleAddNewClick}
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     disabled={isAdding || isEditing}
//                     sx={{ 
//                         textTransform: 'none',
//                         fontWeight: 600,
//                     }}
//                     aria-label="Add new scene description"
//                 >
//                     Add New Description
//                 </Button>
//             </Box>

//             {/* Success Message */}
//             {successMessage && (
//                 <Fade in>
//                     <Alert 
//                         severity="success" 
//                         sx={{ mb: 2 }}
//                         role="status"
//                         aria-live="polite"
//                     >
//                         {successMessage}
//                     </Alert>
//                 </Fade>
//             )}

//             {/* Add New Description Form */}
//             {isAdding && (
//                 <Fade in>
//                     <Card
//                         variant="outlined"
//                         sx={{
//                             borderRadius: 2,
//                             border: '2px solid',
//                             borderColor: 'primary.main',
//                             mb: 3,
//                             bgcolor: 'primary.50',
//                         }}
//                         role="form"
//                         aria-labelledby="add-description-heading"
//                     >
//                         <CardContent sx={{ p: 3 }}>
//                             <Typography 
//                                 id="add-description-heading"
//                                 variant="h6" 
//                                 sx={{ mb: 2, fontWeight: 600 }}
//                             >
//                                 Add New Scene Description
//                             </Typography>
                            
//                             <Stack spacing={2}>
//                                 <TextField
//                                     multiline
//                                     fullWidth
//                                     rows={4}
//                                     variant="outlined"
//                                     label="Description"
//                                     value={editedDescription}
//                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                                         setEditedDescription(e.target.value)
//                                     }
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             bgcolor: 'white',
//                                         },
//                                     }}
//                                     inputProps={{
//                                         'aria-label': 'Scene description text',
//                                         'aria-required': 'true',
//                                     }}
//                                     required
//                                 />
                                
//                                 <Box sx={{ display: 'flex', gap: 2 }}>
//                                     <Box sx={{ flex: 1 }}>
//                                         <TextField
//                                             label="Start Time (seconds)"
//                                             type="number"
//                                             value={editedStartTime}
//                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                 setEditedStartTime(e.target.value);
//                                             }}
//                                             sx={{ width: '100%' }}
//                                             inputProps={{ 
//                                                 min: 0, 
//                                                 step: 1,
//                                                 'aria-label': 'Start timestamp in seconds',
//                                                 'aria-required': 'true',
//                                                 'aria-describedby': 'start-time-format',
//                                             }}
//                                             required
//                                         />
//                                         <Typography 
//                                             id="start-time-format"
//                                             variant="caption" 
//                                             color="text.secondary" 
//                                             sx={{ mt: 0.5, display: 'block' }}
//                                             aria-live="polite"
//                                         >
//                                             {editedStartTime ? `Format: ${formatTime(parseInt(editedStartTime) || 0)}` : 'Format: MM:SS'}
//                                         </Typography>
//                                     </Box>
//                                     <Box sx={{ flex: 1 }}>
//                                         <TextField
//                                             label="End Time (seconds)"
//                                             type="number"
//                                             value={editedEndTime}
//                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                 setEditedEndTime(e.target.value);
//                                             }}
//                                             sx={{ width: '100%' }}
//                                             inputProps={{ 
//                                                 min: 0, 
//                                                 step: 1,
//                                                 'aria-label': 'End timestamp in seconds',
//                                                 'aria-required': 'true',
//                                                 'aria-describedby': 'end-time-format',
//                                             }}
//                                             required
//                                         />
//                                         <Typography 
//                                             id="end-time-format"
//                                             variant="caption" 
//                                             color="text.secondary" 
//                                             sx={{ mt: 0.5, display: 'block' }}
//                                             aria-live="polite"
//                                         >
//                                             {editedEndTime ? `Format: ${formatTime(parseInt(editedEndTime) || 0)}` : 'Format: MM:SS'}
//                                         </Typography>
//                                     </Box>
//                                 </Box>

//                                 {error && (
//                                     <Alert 
//                                         severity="error"
//                                         role="alert"
//                                         aria-live="assertive"
//                                     >
//                                         {error}
//                                     </Alert>
//                                 )}

//                                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                                     <Button
//                                         onClick={handleCancelClick}
//                                         variant="outlined"
//                                         startIcon={<CloseIcon />}
//                                         disabled={isSaving}
//                                         sx={{ textTransform: 'none' }}
//                                         aria-label="Cancel adding description"
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         onClick={handleAddDescription}
//                                         variant="contained"
//                                         startIcon={<SaveIcon />}
//                                         disabled={isSaving}
//                                         sx={{ textTransform: 'none' }}
//                                         aria-label="Save new description"
//                                     >
//                                         {isSaving ? 'Adding...' : 'Add Description'}
//                                     </Button>
//                                 </Box>
//                             </Stack>
//                         </CardContent>
//                     </Card>
//                 </Fade>
//             )}

//             {/* Descriptions List */}
//             <Stack 
//                 spacing={2.5} 
//                 role="list" 
//                 aria-label="Video scene descriptions list"
//                 aria-live="polite"
//             >
//                 {descriptions.length === 0 ? (
//                     <Card 
//                         variant="outlined" 
//                         sx={{ 
//                             borderRadius: 2,
//                             p: 4,
//                             textAlign: 'center',
//                             bgcolor: 'grey.50'
//                         }}
//                         role="status"
//                     >
//                         <Typography variant="body1" color="text.secondary">
//                             No descriptions available for this video yet. Click "Add New Description" to create one.
//                         </Typography>
//                     </Card>
//                 ) : (
//                     descriptions
//                         .sort((a, b) => a.timestamp_start - b.timestamp_start)
//                         .map((description, index) => {
//                             const finalDescription = description.text_history[description.text_history.length - 1] || "";
//                             const isCurrentlyEditing = isEditing && selectedDescriptionId === description.id;
//                             const startTimeFormatted = formatTime(description.timestamp_start);
//                             const endTimeFormatted = formatTime(description.timestamp_end);

//                             return (
//                                 <Fade in key={description.id} timeout={300 * (index + 1)}>
//                                     <Card
//                                         role="listitem"
//                                         aria-labelledby={`description-${description.id}-time`}
//                                         variant="outlined"
//                                         sx={{
//                                             borderRadius: 2,
//                                             border: '1px solid',
//                                             borderColor: isCurrentlyEditing ? 'primary.main' : 'divider',
//                                             transition: 'all 0.3s ease',
//                                             '&:hover': {
//                                                 boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//                                                 borderColor: 'primary.light',
//                                             },
//                                         }}
//                                     >
//                                         <CardContent sx={{ p: 3 }}>
//                                             {/* Timestamp Header */}
//                                             {/* <Box 
//                                                 sx={{ 
//                                                     display: 'flex', 
//                                                     alignItems: 'center',
//                                                     justifyContent: 'space-between',
//                                                     mb: 2,
//                                                 }}
//                                             >
//                                                 <Chip
//                                                     icon={<ScheduleIcon aria-hidden="true" />}
//                                                     label={`${startTimeFormatted} - ${endTimeFormatted}`}
//                                                     sx={{
//                                                         bgcolor: 'primary.main',
//                                                         color: 'white',
//                                                         fontWeight: 600,
//                                                         fontSize: '0.875rem',
//                                                         '& .MuiChip-icon': {
//                                                             color: 'white',
//                                                         },
//                                                     }}
//                                                     id={`description-${description.id}-time`}
//                                                     aria-label={`Scene from ${startTimeFormatted} to ${endTimeFormatted}`}
//                                                 />
                                                
//                                                 {description.username_history && description.username_history.length > 0 && (
//                                                     <Chip
//                                                         label={`By: ${description.username_history[description.username_history.length - 1]}`}
//                                                         size="small"
//                                                         sx={{
//                                                             bgcolor: 'grey.100',
//                                                             color: 'text.secondary',
//                                                             fontWeight: 500,
//                                                         }}
//                                                         aria-label={`Created by ${description.username_history[description.username_history.length - 1]}`}
//                                                     />
//                                                 )}
//                                             </Box> */}

//                                             {/* Description Content */}
//                                             {isCurrentlyEditing ? (
//                                                 <Box role="form" aria-labelledby={`edit-description-${description.id}-heading`}>
//                                                     <Typography 
//                                                         id={`edit-description-${description.id}-heading`}
//                                                         variant="h6" 
//                                                         sx={{ mb: 2, fontWeight: 600 }}
//                                                     >
//                                                         Edit Description
//                                                     </Typography>
                                                    
//                                                     <Stack spacing={2}>
//                                                         <TextField
//                                                             multiline
//                                                             fullWidth
//                                                             rows={4}
//                                                             variant="outlined"
//                                                             label="Edit Description"
//                                                             value={editedDescription}
//                                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                                                                 setEditedDescription(e.target.value)
//                                                             }
//                                                             sx={{
//                                                                 '& .MuiOutlinedInput-root': {
//                                                                     bgcolor: 'white',
//                                                                 },
//                                                             }}
//                                                             inputProps={{
//                                                                 'aria-label': 'Description text editor',
//                                                                 'aria-required': 'true',
//                                                             }}
//                                                             required
//                                                         />
                                                        
//                                                         <Box sx={{ display: 'flex', gap: 2 }}>
//                                                             <Box sx={{ flex: 1 }}>
//                                                                 <TextField
//                                                                     label="Start Time (seconds)"
//                                                                     type="number"
//                                                                     value={editedStartTime}
//                                                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                                         setEditedStartTime(e.target.value);
//                                                                     }}
//                                                                     sx={{ width: '100%' }}
//                                                                     inputProps={{ 
//                                                                         min: 0, 
//                                                                         step: 1,
//                                                                         'aria-label': 'Start timestamp in seconds',
//                                                                         'aria-required': 'true',
//                                                                         'aria-describedby': `edit-start-time-format-${description.id}`,
//                                                                     }}
//                                                                     required
//                                                                 />
//                                                                 <Typography 
//                                                                     id={`edit-start-time-format-${description.id}`}
//                                                                     variant="caption" 
//                                                                     color="text.secondary" 
//                                                                     sx={{ mt: 0.5, display: 'block' }}
//                                                                     aria-live="polite"
//                                                                 >
//                                                                     Format: {formatTime(parseInt(editedStartTime) || 0)}
//                                                                 </Typography>
//                                                             </Box>
//                                                             <Box sx={{ flex: 1 }}>
//                                                                 <TextField
//                                                                     label="End Time (seconds)"
//                                                                     type="number"
//                                                                     value={editedEndTime}
//                                                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                                                                         setEditedEndTime(e.target.value);
//                                                                     }}
//                                                                     sx={{ width: '100%' }}
//                                                                     inputProps={{ 
//                                                                         min: 0, 
//                                                                         step: 1,
//                                                                         'aria-label': 'End timestamp in seconds',
//                                                                         'aria-required': 'true',
//                                                                         'aria-describedby': `edit-end-time-format-${description.id}`,
//                                                                     }}
//                                                                     required
//                                                                 />
//                                                                 <Typography 
//                                                                     id={`edit-end-time-format-${description.id}`}
//                                                                     variant="caption" 
//                                                                     color="text.secondary" 
//                                                                     sx={{ mt: 0.5, display: 'block' }}
//                                                                     aria-live="polite"
//                                                                 >
//                                                                     Format: {formatTime(parseInt(editedEndTime) || 0)}
//                                                                 </Typography>
//                                                             </Box>
//                                                         </Box>

//                                                         {error && (
//                                                             <Alert 
//                                                                 severity="error"
//                                                                 role="alert"
//                                                                 aria-live="assertive"
//                                                             >
//                                                                 {error}
//                                                             </Alert>
//                                                         )}

//                                                         <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
//                                                             <Button
//                                                                 onClick={() => handleDeleteDialogOpen(description.id)}
//                                                                 variant="outlined"
//                                                                 color="error"
//                                                                 startIcon={<DeleteIcon aria-hidden="true" />}
//                                                                 disabled={isDeleting || isSaving}
//                                                                 sx={{ textTransform: 'none' }}
//                                                                 aria-label={`Delete description for scene from ${startTimeFormatted} to ${endTimeFormatted}`}
//                                                             >
//                                                                 Delete
//                                                             </Button>
                                                            
//                                                             <Box sx={{ display: 'flex', gap: 1 }}>
//                                                                 <Button
//                                                                     onClick={handleCancelClick}
//                                                                     variant="outlined"
//                                                                     startIcon={<CloseIcon aria-hidden="true" />}
//                                                                     disabled={isSaving}
//                                                                     sx={{ textTransform: 'none' }}
//                                                                     aria-label="Cancel editing"
//                                                                 >
//                                                                     Cancel
//                                                                 </Button>
//                                                                 <Button
//                                                                     onClick={handleSaveClick}
//                                                                     variant="contained"
//                                                                     startIcon={<SaveIcon aria-hidden="true" />}
//                                                                     disabled={isSaving}
//                                                                     sx={{ textTransform: 'none' }}
//                                                                     aria-label="Save changes to description"
//                                                                 >
//                                                                     {isSaving ? 'Saving...' : 'Save Changes'}
//                                                                 </Button>
//                                                             </Box>
//                                                         </Box>
//                                                     </Stack>
//                                                 </Box>
//                                             ) : (
//                                                 <>
//                                                     <Box
//                                                         sx={{
//                                                             p: 2.5,
//                                                             borderRadius: 2,
//                                                             bgcolor: 'grey.50',
//                                                             border: '1px solid',
//                                                             borderColor: 'grey.200',
//                                                             mb: 2,
//                                                         }}
//                                                     >
//                                                         <Typography 
//                                                             variant="body1" 
//                                                             component="p"
//                                                             sx={{ 
//                                                                 lineHeight: 1.7,
//                                                                 color: 'text.primary',
//                                                                 whiteSpace: 'pre-wrap',
//                                                             }}
//                                                             id={`description-${description.id}-text`}
//                                                             aria-label={`Description: ${finalDescription}`}
//                                                         >
//                                                             {finalDescription}
//                                                         </Typography>
//                                                     </Box>

//                                                     <Box 
//                                                         sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
//                                                         role="group"
//                                                         aria-label="Description actions"
//                                                     >
//                                                         <Tooltip title="Edit this description">
//                                                             <Button
//                                                                 onClick={() =>
//                                                                     handleEditClick(
//                                                                         description.id,
//                                                                         description.text_history,
//                                                                         description.timestamp_start,
//                                                                         description.timestamp_end
//                                                                     )
//                                                                 }
//                                                                 variant="contained"
//                                                                 startIcon={<EditIcon aria-hidden="true" />}
//                                                                 disabled={isEditing || isAdding}
//                                                                 sx={{ 
//                                                                     textTransform: 'none',
//                                                                     bgcolor: 'secondary.main',
//                                                                     '&:hover': {
//                                                                         bgcolor: 'secondary.dark',
//                                                                     },
//                                                                 }}
//                                                                 aria-label={`Edit description for scene from ${startTimeFormatted} to ${endTimeFormatted}`}
//                                                             >
//                                                                 Edit Description
//                                                             </Button>
//                                                         </Tooltip>
                                                        
//                                                         <Tooltip title="Delete this description permanently">
//                                                             <Button
//                                                                 onClick={() => handleDeleteDialogOpen(description.id)}
//                                                                 variant="outlined"
//                                                                 color="error"
//                                                                 startIcon={<DeleteIcon aria-hidden="true" />}
//                                                                 disabled={isDeleting || isEditing || isAdding}
//                                                                 sx={{ 
//                                                                     textTransform: 'none',
//                                                                     '&:hover': {
//                                                                         bgcolor: 'rgba(211, 47, 47, 0.08)',
//                                                                         borderColor: 'error.main',
//                                                                     },
//                                                                 }}
//                                                                 aria-label={`Delete description for scene from ${startTimeFormatted} to ${endTimeFormatted}`}
//                                                             >
//                                                                 Delete
//                                                             </Button>
//                                                         </Tooltip>
//                                                     </Box>
//                                                 </>
//                                             )}
//                                         </CardContent>
//                                     </Card>
//                                 </Fade>
//                             );
//                         })
//                 )}
//             </Stack>

//             {/* Delete Confirmation Dialog */}
//             <Dialog
//                 open={deleteDialogOpen}
//                 onClose={handleDeleteDialogClose}
//                 aria-labelledby="delete-dialog-title"
//                 aria-describedby="delete-dialog-description"
//                 role="alertdialog"
//             >
//                 <DialogTitle id="delete-dialog-title">
//                     Delete Description?
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="delete-dialog-description">
//                         Are you sure you want to delete this description? This action cannot be undone.
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button 
//                         onClick={handleDeleteDialogClose} 
//                         disabled={isDeleting}
//                         sx={{ textTransform: 'none' }}
//                         aria-label="Cancel deletion"
//                     >
//                         Cancel
//                     </Button>
//                     <Button 
//                         onClick={handleConfirmDelete} 
//                         color="error" 
//                         variant="contained"
//                         disabled={isDeleting}
//                         startIcon={<DeleteIcon aria-hidden="true" />}
//                         sx={{ textTransform: 'none' }}
//                         autoFocus
//                         aria-label="Confirm deletion"
//                     >
//                         {isDeleting ? 'Deleting...' : 'Delete'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default Scene;