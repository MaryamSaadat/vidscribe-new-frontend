import React, { useEffect, useMemo, useState } from "react";
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
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  InputAdornment,
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

interface SceneProps {
  id: string | number;
}

/** Screen-reader-only style */
const srOnlySx = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

/** Helpers to support slightly different API shapes safely */
function getStartSec(d: any): number {
  const v = d?.timestamp_start ?? d?.time_stamp_start ?? 0;
  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isFinite(n) ? n : 0;
}
function getEndSec(d: any): number {
  const v = d?.timestamp_end ?? d?.time_stamp_end ?? 0;
  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isFinite(n) ? n : 0;
}
function getText(d: any): string {
  if (Array.isArray(d?.text_history) && d.text_history.length > 0) {
    return String(d.text_history[d.text_history.length - 1] ?? "");
  }
  if (typeof d?.description === "string") return d.description;
  if (typeof d?.modified_descriptions === "string") return d.modified_descriptions;
  return "";
}

const Scene: React.FC<SceneProps> = ({ id }) => {
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

  useEffect(() => {
    loadDescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sorted = useMemo(() => {
    return (descriptions as any[])
      .slice()
      .sort((a, b) => getStartSec(a) - getStartSec(b));
  }, [descriptions]);

  const maxEnd = useMemo(() => {
    const maxFromSegments = Math.max(1, ...sorted.map((d) => getEndSec(d)));
    const maxFromForm = Math.max(0, parseInt(editedEndTime || "0", 10) || 0);
    return Math.max(1, maxFromSegments, maxFromForm);
  }, [sorted, editedEndTime]);

  const loadDescriptions = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchVideoDescriptions(id);
      setDescriptions(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load descriptions");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setEditedDescription("");
    setEditedStartTime("");
    setEditedEndTime("");
  };

  const handleAddNewClick = (): void => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedDescriptionId(null);
    resetForm();
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

  const handleEditClick = (desc: any): void => {
    const descId = Number(desc?.id);
    if (!Number.isFinite(descId)) return;

    setSelectedDescriptionId(descId);
    setEditedDescription(getText(desc));
    setEditedStartTime(String(getStartSec(desc)));
    setEditedEndTime(String(getEndSec(desc)));
    setIsEditing(true);
    setIsAdding(false);
    setError("");
    setSuccessMessage("");
  };

  const handleAddDescription = async (): Promise<void> => {
    const timestampValidation = validateTimestamps(editedStartTime, editedEndTime);
    if (!timestampValidation.isValid) {
      setError(timestampValidation.error || "");
      return;
    }

    const descriptionValidation = validateDescription(editedDescription);
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.error || "");
      return;
    }

    try {
      setIsSaving(true);
      await createDescription({
        video_id: id,
        description: editedDescription,
        time_stamp_start: parseInt(editedStartTime, 10),
        time_stamp_end: parseInt(editedEndTime, 10),
      });

      setSuccessMessage("Description added successfully!");
      await loadDescriptions();
      setIsAdding(false);
      setError("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add description");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = async (): Promise<void> => {
    if (selectedDescriptionId === null) return;

    const timestampValidation = validateTimestamps(editedStartTime, editedEndTime);
    if (!timestampValidation.isValid) {
      setError(timestampValidation.error || "");
      return;
    }

    const descriptionValidation = validateDescription(editedDescription);
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.error || "");
      return;
    }

    try {
      setIsSaving(true);
      await updateDescription({
        id: selectedDescriptionId,
        modified_descriptions: editedDescription,
        time_stamp_start: parseInt(editedStartTime, 10),
        time_stamp_end: parseInt(editedEndTime, 10),
      });

      setSuccessMessage("Description updated successfully!");
      await loadDescriptions();
      setIsEditing(false);
      setSelectedDescriptionId(null);
      setError("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update description");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDialogOpen = (descId: number): void => {
    setDescriptionToDelete(descId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = (): void => {
    setDeleteDialogOpen(false);
    setDescriptionToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (descriptionToDelete === null) return;

    try {
      setIsDeleting(true);
      await deleteDescription(descriptionToDelete);

      setSuccessMessage("Description deleted successfully!");
      await loadDescriptions();
      handleDeleteDialogClose();
      setTimeout(() => setSuccessMessage(""), 3000);

      if (selectedDescriptionId === descriptionToDelete) {
        setIsEditing(false);
        setSelectedDescriptionId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete description");
      handleDeleteDialogClose();
    } finally {
      setIsDeleting(false);
    }
  };

  // ----- Add dialog timeline calculations
  const addStartSec = parseInt(editedStartTime || "0", 10) || 0;
  const addEndSec = parseInt(editedEndTime || "0", 10) || 0;

  const addLeftPct = Math.max(0, Math.min(100, (addStartSec / maxEnd) * 100));
  const addRightPct = Math.max(0, Math.min(100, (addEndSec / maxEnd) * 100));
  const addWidthPct = Math.max(1, addRightPct - addLeftPct);

  const durationSec = Math.max(0, addEndSec - addStartSec);

  const prevSeg = useMemo(() => {
    const eligible = sorted.filter((d) => getEndSec(d) <= addStartSec);
    eligible.sort((a, b) => getEndSec(b) - getEndSec(a));
    return eligible[0] ?? null;
  }, [sorted, addStartSec]);

  const prevEnd = prevSeg ? getEndSec(prevSeg) : null;
  const gap = prevEnd !== null ? addStartSec - prevEnd : null;

  // ============================================
  // RENDER: Loading
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
                <Skeleton variant="rectangular" width={140} height={36} sx={{ mt: 2, borderRadius: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby="descriptions-heading" sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
      {/* Header */}
      <Box
        sx={{
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 2.5,
          color: "#fff",
        }}
      >
        <Typography id="descriptions-heading" variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          Scene Descriptions
        </Typography>

        <Button
          onClick={handleAddNewClick}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={isAdding || isEditing}
          sx={{ textTransform: "none", fontWeight: 700 }}
          aria-label="Add a new scene description"
        >
          Add New Description
        </Button>
      </Box>

      {/* Live regions */}
      {successMessage && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 2 }} role="status" aria-live="polite">
            {successMessage}
          </Alert>
        </Fade>
      )}
      {error && !isAdding && !isEditing && (
        <Fade in>
          <Alert severity="error" sx={{ mb: 2 }} role="alert" aria-live="assertive">
            {error}
          </Alert>
        </Fade>
      )}

      {/* ---------------- ADD DESCRIPTION DIALOG (accessible) ---------------- */}
      <Dialog
        open={isAdding}
        onClose={isSaving ? undefined : handleCancelClick}
        fullWidth
        maxWidth="md"
        aria-labelledby="add-desc-title"
        aria-describedby="add-desc-help"
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
          }}
        >
          <Typography id="add-desc-title" variant="h6" sx={{ fontWeight: 800 }}>
            Add New Description
          </Typography>

          <IconButton
            onClick={handleCancelClick}
            disabled={isSaving}
            sx={{ color: "#fff" }}
            aria-label="Close add description dialog"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Typography id="add-desc-help" sx={srOnlySx}>
            This dialog has 2 steps. First set start and end times in seconds, then write the description.
            Use Tab to move, Enter to activate buttons, and Escape to close.
          </Typography>

          {/* STEP 1 */}
          <Typography sx={{ fontWeight: 900, letterSpacing: 0.4, color: "text.secondary", mb: 1 }}>
            STEP 1 OF 2: SET TIME RANGE
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            Select where this description appears in the video:
          </Typography>

          {/* Timeline strip */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}>
            <Box
              role="img"
              aria-label={`New segment from ${addStartSec} seconds to ${addEndSec} seconds out of ${maxEnd} seconds.`}
              sx={{
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography sx={srOnlySx}>
                New segment from {addStartSec} to {addEndSec} seconds.
              </Typography>

              {/* Existing segments (grey) */}
              {sorted.map((d: any, i: number) => {
                const s = getStartSec(d);
                const e = getEndSec(d);
                const l = Math.max(0, Math.min(100, (s / maxEnd) * 100));
                const r = Math.max(0, Math.min(100, (e / maxEnd) * 100));
                const w = Math.max(1, r - l);

                return (
                  <Box
                    key={d.id ?? i}
                    sx={{
                      position: "absolute",
                      left: `${l}%`,
                      width: `${w}%`,
                      top: 6,
                      bottom: 6,
                      borderRadius: 1.5,
                      bgcolor: "rgba(0,0,0,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "rgba(0,0,0,0.55)",
                      px: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {formatTime(s)}-{formatTime(e)}
                  </Box>
                );
              })}

              {/* New Segment (green) */}
              <Box
                sx={{
                  position: "absolute",
                  left: `${addLeftPct}%`,
                  width: `${addWidthPct}%`,
                  top: 6,
                  bottom: 6,
                  borderRadius: 1.5,
                  bgcolor: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#fff",
                  px: 1,
                  textTransform: "uppercase",
                }}
              >
                New Segment
              </Box>

              {/* Solid dots */}
              <Box
                sx={{
                  position: "absolute",
                  left: `${addLeftPct}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#4CAF50",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: `${addRightPct}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#4CAF50",
                }}
              />
            </Box>
          </Paper>

          <Typography sx={{ mt: 1.5, color: "text.secondary", fontWeight: 800 }}>
            Or enter exact times:
          </Typography>

          {/* Start/End/Duration row */}
          <Box sx={{ display: "flex", gap: 2, mt: 1.2, alignItems: "flex-end" }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Start Time</Typography>
              <TextField
                autoFocus
                fullWidth
                value={editedStartTime}
                onChange={(e) => setEditedStartTime(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: 1 }}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        {formatTime(addStartSec)}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                aria-label="Start time in seconds"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>End Time</Typography>
              <TextField
                fullWidth
                value={editedEndTime}
                onChange={(e) => setEditedEndTime(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: 1 }}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        {formatTime(addEndSec)}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                aria-label="End time in seconds"
              />
            </Box>

            <Box sx={{ width: 170 }}>
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Duration</Typography>
              <Paper
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1.4,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  textAlign: "center",
                }}
                aria-label={`Duration ${durationSec} seconds`}
              >
                <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                  {durationSec} sec
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Gap warning */}
          {gap !== null && gap > 0 && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                borderColor: "#f2c200",
                bgcolor: "rgba(242, 194, 0, 0.15)",
              }}
              role="status"
              aria-live="polite"
            >
              <Typography sx={{ fontWeight: 900, color: "#8a6d00" }}>Gap Detected</Typography>
              <Typography sx={{ color: "#8a6d00" }}>
                There&apos;s a {gap}-second gap between previous segment end and this new segment start.
              </Typography>
            </Paper>
          )}

          {/* STEP 2 */}
          <Typography sx={{ mt: 3, fontWeight: 900, letterSpacing: 0.4, color: "text.secondary", mb: 1 }}>
            STEP 2 OF 2: WRITE DESCRIPTION
          </Typography>

          <TextField
            multiline
            fullWidth
            rows={5}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Write your scene description..."
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
            aria-label="Scene description text"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} role="alert" aria-live="assertive">
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
          <Button onClick={handleCancelClick} disabled={isSaving} variant="outlined" aria-label="Cancel adding description">
            Cancel
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button disabled variant="contained" sx={{ opacity: 0.45 }} aria-label="Preview segment (disabled)">
              Preview Segment
            </Button>

            <Button
              onClick={handleAddDescription}
              disabled={isSaving}
              variant="contained"
              sx={{
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#43A047" },
                fontWeight: 900,
                textTransform: "none",
              }}
              aria-label="Add description"
            >
              {isSaving ? "Adding..." : "✓ Add Description"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ---------------- LIST VIEW (keyboard-friendly cards) ---------------- */}
      <Stack spacing={2} role="list" aria-label="Scene descriptions list">
        {sorted.length === 0 ? (
          <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center", bgcolor: "grey.50" }}>
            <Typography variant="body1" color="text.secondary">
              No descriptions available. Click "Add New Description" to create one.
            </Typography>
          </Card>
        ) : (
          sorted.map((desc) => {
            const descId = Number((desc as any)?.id);
            const editing = isEditing && selectedDescriptionId === descId;

            const startSec = getStartSec(desc);
            const endSec = getEndSec(desc);
            const text = getText(desc);

            const leftPct = Math.max(0, Math.min(100, (startSec / maxEnd) * 100));
            const rightPct = Math.max(0, Math.min(100, (endSec / maxEnd) * 100));
            const widthPct = Math.max(1, rightPct - leftPct);

            return (
              <Fade in key={String(descId)} timeout={250}>
                <Card
                  variant="outlined"
                  role="listitem"
                  tabIndex={editing ? -1 : 0}
                  aria-label={`Scene description. Starts at ${formatTime(startSec)} and ends at ${formatTime(endSec)}.`}
                  onKeyDown={(e) => {
                    if (editing) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEditClick(desc);
                    }
                    if (e.key === "Delete" || e.key === "Backspace") {
                      e.preventDefault();
                      handleDeleteDialogOpen(descId);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    borderColor: editing ? "primary.main" : "divider",
                    transition: "all 0.2s ease",
                    outline: "none",
                    "&:hover": { boxShadow: 2, borderColor: "primary.light" },
                    "&:focus-visible": {
                      boxShadow: 3,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    {editing ? (
                      <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={800}>
                          Edit Description
                        </Typography>

                        <TextField
                          multiline
                          fullWidth
                          rows={4}
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          aria-label="Edit description text"
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
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

                        {error && (
                          <Alert severity="error" role="alert" aria-live="assertive">
                            {error}
                          </Alert>
                        )}

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Button
                            onClick={() => handleDeleteDialogOpen(descId)}
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            aria-label={`Delete description from ${formatTime(startSec)} to ${formatTime(endSec)}`}
                          >
                            Delete
                          </Button>

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button onClick={handleCancelClick} variant="outlined" startIcon={<CloseIcon />} aria-label="Cancel editing">
                              Cancel
                            </Button>
                            <Button onClick={handleSaveClick} variant="contained" startIcon={<SaveIcon />} disabled={isSaving} aria-label="Save description changes">
                              {isSaving ? "Saving..." : "Save"}
                            </Button>
                          </Box>
                        </Box>
                      </Stack>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        {/* Optional time pill (you can remove if you want) */}
                        <Box
                          component="span"
                          sx={(theme) => ({
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1.2,
                            py: 0.6,
                            borderRadius: 999,
                            fontWeight: 900,
                            fontSize: 12,
                            backgroundColor: theme.palette.primary.main,
                            color: "#ffffff",
                            whiteSpace: "nowrap",
                            mt: 0.2,
                          })}
                        >
                          {formatTime(startSec)} - {formatTime(endSec)}
                        </Box>

                        {/* Text + timeline */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {text}
                          </Typography>

                          {/* Timeline: full track + segment + SOLID dots */}
                          <Box sx={{ mt: 1.2 }}>
                            <Typography sx={srOnlySx}>
                              Segment from {startSec} seconds to {endSec} seconds out of {maxEnd} seconds.
                            </Typography>

                            <Box
                              role="img"
                              aria-label={`Timeline segment from ${startSec} seconds to ${endSec} seconds out of ${maxEnd} seconds.`}
                              sx={(theme) => ({
                                height: 10,
                                borderRadius: 999,
                                backgroundColor:
                                  theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
                                position: "relative",
                                overflow: "visible",
                              })}
                            >
                              <Box
                                sx={(theme) => ({
                                  position: "absolute",
                                  left: `${leftPct}%`,
                                  width: `${widthPct}%`,
                                  top: 1,
                                  bottom: 1,
                                  borderRadius: 999,
                                  backgroundColor: theme.palette.primary.main,
                                })}
                              />

                              {/* solid start dot */}
                              <Box
                                sx={(theme) => ({
                                  position: "absolute",
                                  left: `${leftPct}%`,
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                })}
                              />
                              {/* solid end dot */}
                              <Box
                                sx={(theme) => ({
                                  position: "absolute",
                                  left: `${rightPct}%`,
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                })}
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* icon actions (keyboard + SR labels) */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(desc)}
                              disabled={isEditing || isAdding}
                              aria-label={`Edit description from ${formatTime(startSec)} to ${formatTime(endSec)}`}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteDialogOpen(descId)}
                              disabled={isDeleting || isEditing || isAdding}
                              aria-label={`Delete description from ${formatTime(startSec)} to ${formatTime(endSec)}`}
                              sx={{ color: "error.main" }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    )}

                    {!editing && <Divider sx={{ mt: 1.5, opacity: 0.6 }} />}
                  </CardContent>
                </Card>
              </Fade>
            );
          })
        )}
      </Stack>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} aria-labelledby="delete-desc-title">
        <DialogContent>
          <DialogContentText id="delete-desc-title">
            Delete this description? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting} autoFocus>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scene;
