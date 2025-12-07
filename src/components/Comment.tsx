import React, { useState, useEffect } from "react";
import { Typography, Box, Divider, Alert, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios, { AxiosError } from "axios";

interface CommentData {
  id: number;
  question: string;
  answer: string;
  timestamp: number;
  video_id: number;
  username?: string;
}

interface CommentProps {
  videoID: string | undefined;
}

interface QuestionsResponse {
  questions: CommentData[] | string;
}

const Comment: React.FC<CommentProps> = ({ videoID }) => {
  const apiUrl = `https://hbasfrum76.execute-api.us-east-2.amazonaws.com/default/VidScribeQuestionAnswering/${videoID}`;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [noComments, setNoComments] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<QuestionsResponse>(apiUrl)
      .then((response) => {
        console.log("API response for comments:", response.data.questions);
        if (!Array.isArray(response.data.questions)) {
          setNoComments(true);
        } else {
          setComments(response.data.questions);
        }
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        console.log("Error fetching comments:", err);
        setError(true);
        setLoading(false);
      });
  }, [videoID]);

  // Format timestamp to be more readable
  const formatTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 4 
        }}
        role="status"
        aria-live="polite"
        aria-label="Loading questions and answers"
      >
        <CircularProgress size={40} aria-hidden="true" />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading questions and answers...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ my: 2 }}
        role="alert"
      >
        Unable to load questions. Please try again later.
      </Alert>
    );
  }

  if (noComments) {
    return (
      <Box 
        sx={{ 
          py: 4, 
          px: 2, 
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
        role="status"
        aria-label="No questions yet"
      >
        <Typography variant="body1" color="text.secondary">
          Be the first to ask a question on this video
        </Typography>
      </Box>
    );
  }

  const reversedComments = [...comments].reverse();

  return (
      <Box 
        component="ul" 
        sx={{ 
          listStyle: 'none', 
          p: 0, 
          m: 0 
        }}
        aria-labelledby="qa-heading"
      >
        {reversedComments.map((comment, index) => (
          <Box
            component="li"
            key={comment.id}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 2,
              mb: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 2,
              },
              '&:focus-within': {
                boxShadow: 3,
                borderColor: 'primary.main',
              }
            }}
            aria-label={`Question ${reversedComments.length - index} of ${comments.length}`}
          >
            <Grid container spacing={1}>
              {/* Header with username and timestamp */}
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    component="span"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label={`Asked by ${comment.username || 'anonymous user'}`}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        mr: 1
                      }}
                      aria-hidden="true"
                    />
                    @{comment.username || "anonymous"}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    component="span"
                    sx={{ 
                      color: 'text.secondary',
                      backgroundColor: 'action.hover',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 500
                    }}
                    aria-label={`Timestamp ${formatTimestamp(comment.timestamp)}`}
                  >
                    {formatTimestamp(comment.timestamp)}
                  </Typography>
                </Box>
              </Grid>

              {/* Question */}
              <Grid item xs={12}>
                <Box>
                  <Typography 
                    variant="overline" 
                    component="span"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: 1
                    }}
                    id={`question-label-${comment.id}`}
                  >
                    Question
                  </Typography>
                  <Typography 
                    variant="body1" 
                    component="p"
                    sx={{ 
                      fontWeight: 500,
                    }}
                    aria-labelledby={`question-label-${comment.id}`}
                  >
                    {comment.question}
                  </Typography>
                </Box>
                {/* Answer */}
                <Box>
                  <Typography 
                    variant="overline" 
                    component="span"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: 1
                    }}
                    id={`answer-label-${comment.id}`}
                  >
                    Answer
                  </Typography>
                  <Typography 
                    variant="body1" 
                    aria-labelledby={`answer-label-${comment.id}`}
                  >
                    {comment.answer}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
  );
};

export default Comment;