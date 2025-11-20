import React, { useState, useEffect } from "react";
import { Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
// import formatTime from "../utils/functions";

interface CommentData {
  username: string;
  time_stamp: string;
  question: string;
  answer: string;
  [key: string]: any;
}

interface CommentProps {
  videoID: string | undefined;
}

interface QuestionsResponse {
  questions: string[] | string;
}

const Comment: React.FC<CommentProps> = ({ videoID }) => {
  const apiUrl = `https://hbasfrum76.execute-api.us-east-2.amazonaws.com/default/VidScribeQuestionAnswering/${videoID}`;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [noComments, setNoComments] = useState<boolean>(false);

  useEffect(() => {
    const params = {
      id: videoID,
    };

    axios
      .get<QuestionsResponse>(apiUrl)
      .then((response) => {
        // checking if the api call is returning NOT_Found or an array
        console.log("API response for comments:", response.data);
        if (!Array.isArray(response.data.questions)) {
          setNoComments(true);
        } else {
          setComments(
            response.data.questions.map((item) => {
              return JSON.parse(item);
            })
          );
        }
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        console.log("Error fetching comments:", err);
        setLoading(false);
      });
  }, [videoID]);

  console.log(isLoading, noComments);

  if (isLoading || noComments) {
    return (
      <Typography variant="subtitle2">
        Be the first to ask a question on this video
      </Typography>
    );
  }

  // Reverse the array to display comments in a Last In, First Out (LIFO) order
  const reversedComments = [...comments].reverse();

  return (
    <div>
      {reversedComments.map((comment, index) => (
        <Grid container p={2} key={index}>
          <Grid item xs={8} md={9}>
            <Typography variant="subtitle2" sx={{ color: "primary.main" }}>
              @{comment.username}
            </Typography>
          </Grid>
          <Grid item xs={4} md={3}>
            {/* <Chip
              label={formatTime(parseInt(comment.time_stamp))}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                marginBottom: "20px",
              }}
            /> */}
          </Grid>
          <Typography variant="subtitle2" sx={{ color: "primary.dark" }}>
            Question: {comment.question}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "primary.dark" }}>
            Answer: {comment.answer}
          </Typography>
        </Grid>
      ))}
    </div>
  );
};

export default Comment;