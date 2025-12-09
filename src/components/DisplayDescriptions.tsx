import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { formatDuration as formatTime } from "../utils/constants";
import TextToSpeech from "./TextToSpeech";

interface Description {
  text_history: string[];
  timestamp_start: string;
  timestamp_end: string;
  [key: string]: any;
}

interface DisplayDescriptionsProps {
  description: Description;
  parentCallback: (playedIndex: number) => void;
  cIndex: number;
  pIndex: number;
}

const DisplayDescriptions: React.FC<DisplayDescriptionsProps> = ({
  description,
  parentCallback,
  cIndex,
  pIndex
}) => {
  const handleCallback = (playedIndex: number): void => {
    parentCallback(playedIndex);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden"
      }}
    >
      {/* Header with timestamp */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600 }}>
          Audio Description
        </Typography>
        {/* <Chip
          label={`${formatTime(parseInt(description.timestamp_start))} - ${formatTime(parseInt(description.timestamp_end))}`}
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            fontWeight: 500,
            ml: "auto"
          }}
        /> */}
        <Paper
          elevation={0}
          aria-label="TimeStamp"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            display: "inline-flex",
            alignItems: "center"
          }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{ fontWeight: 500, fontSize: "0.875rem" }}
          >
            {`${formatTime(parseInt(description.timestamp_start))} - ${formatTime(parseInt(description.timestamp_end))}`}
          </Typography>
        </Paper>
      </Box>

      {/* Description text */}
      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="body1"
          mb={2.5}
        >
          {description.text_history}
        </Typography>

        <Divider sx={{ mb: 2.5 }} />

        <TextToSpeech
          text={description.text_history}
          parentCallback={handleCallback}
          cIndex={cIndex}
          pIndex={pIndex}
        />
      </Box>
    </Box>
  );
};

export default DisplayDescriptions;