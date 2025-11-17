// import React, { useState, useEffect } from "react";
// import { AlertBar } from './';
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import axios, { AxiosError } from "axios";
// import Cookies from "js-cookie";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import { ButtonGroup, DialogTitle, DialogContentText, CircularProgress } from "@mui/material";
// import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
// import formatTime from "../utils/functions";
// import tokenUsable from "../utils/loggedIn";

// interface AskAIProps {
//   videoID: string | undefined;
//   timeStamp: number;
// }

// interface QuestionResponse {
//   answer: string;
// }

// const AskAI: React.FC<AskAIProps> = ({ videoID, timeStamp }) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [response, setResponse] = useState<string>("");
//   const [startOrStop, setStartOrStop] = useState<"Stop" | "Start">("Stop");
//   const [alerttext, setAlerttext] = useState<string>("");
//   const [showAlert, setShowAlert] = useState<boolean>(false);
//   const [editableTranscript, setEditableTranscript] = useState<string>("");

//   const synth = window.speechSynthesis;
//   const voices = synth.getVoices();

//   const playBeep = (type: "start" | "stop"): void => {
//     let audioStart: HTMLAudioElement;
//     if (type === "start") {
//       audioStart = new Audio(require('../data/beepStart.mp3'));
//     } else {
//       audioStart = new Audio(require('../data/beepStop.mp3'));
//     }
//     audioStart.play();
//   };

//   const textToSpeech = (): void => {
//     const newUtterance = new SpeechSynthesisUtterance(editableTranscript);
//     const voices = synth.getVoices();
//     const voice = voices.find((v) => v.name === "Google US English");
//     if (voice) {
//       newUtterance.voice = voice;
//     }
//     synth.speak(newUtterance);
//   };

//   useEffect(() => {
//     const handleKeyPress = (event: KeyboardEvent): void => {
//       if (event.key === "q" && !open) {
//         handleClickOpen();
//       }
//       else if (event.key === "s" && open) {
//         handleStartStop();
//       }
//     };

//     document.addEventListener("keydown", handleKeyPress);

//     return () => {
//       document.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [open]);

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   useEffect(() => {
//     setEditableTranscript(transcript);
//   }, [transcript]);

//   const handleCloseAlertCallback = (): void => {
//     setShowAlert(false);
//   };

//   const handleClickOpen = (): void => {
//     const token = Cookies.get("jwtToken");
//     if (!token || !tokenUsable(token)) {
//       setShowAlert(true);
//       setAlerttext("to ask questions");
//       return;
//     }

//     SpeechRecognition.startListening({ continuous: true });
//     playBeep("start");
//     setOpen(true);
//   };

//   const handleClose = (): void => {
//     setOpen(false);
//     synth.cancel();
//     SpeechRecognition.stopListening();
//     setResponse("");
//     resetTranscript();
//     setStartOrStop("Stop");
//   };

//   const handleAnotherQuestion = (): void => {
//     setResponse("");
//     resetTranscript();
//   };

//   const handleReset = (): void => {
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: true });
//     setStartOrStop("Stop");
//     playBeep("start");
//   };

//   const handleStartStop = (): void => {
//     if (startOrStop === "Stop") {
//       SpeechRecognition.stopListening();
//       setStartOrStop("Start");
//       playBeep("stop");
//     } else {
//       SpeechRecognition.startListening({ continuous: true });
//       setStartOrStop("Stop");
//       playBeep("start");
//     }
//   };

//   const handleQuestion = (): void => {
//     setLoading(true);
//     const token = Cookies.get("jwtToken");
//     const apiUrl = "https://vidscribe.org/b/api/ask_question/";
//     console.log("This is my props id", videoID);
//     const postData = {
//       id: videoID,
//       question: editableTranscript,
//       currentTime: timeStamp,
//       jwt: token,
//     };

//     axios.post<QuestionResponse>(apiUrl, postData)
//       .then((response) => {
//         console.log("Response:", response.data);
//         const newUtterance = new SpeechSynthesisUtterance("Response: " + response.data.answer);
//         const voice = voices.find((v) => v.name === "Google US English");
//         if (voice) {
//           newUtterance.voice = voice;
//         }
//         synth.speak(newUtterance);
//         setResponse(response.data.answer);
//         setLoading(false);
//       })
//       .catch((error: AxiosError) => {
//         console.error("Error:", error);
//         setLoading(false);
//       });
//   };

//   return (
//     <React.Fragment>
//       {showAlert && 
//         <AlertBar 
//           alertText={"You need to have an account " + alerttext}
//           parentCallback={handleCloseAlertCallback}
//         />
//       }
//       <Button
//         variant="contained"
//         component="label"
//         className="category-btn"
//         sx={{
//           mb: 1,
//           p: "10px 20px",
//           borderRadius: "30px",
//           width: "100%",
//         }}
//         onClick={handleClickOpen}
//       >
//         Ask question at {formatTime(timeStamp)}
//       </Button>
//       {(loading || response) && (
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           fullWidth
//           sx={{ textAlign: "center" }}
//         >
//           <KeyboardVoiceIcon
//             sx={{
//               fontSize: "70px",
//               backgroundColor: "primary.main",
//               color: listening ? "secondary.main" : "white",
//               ml: "5px",
//               borderRadius: "100%",
//               padding: "20px",
//               margin: "20px auto",
//             }}
//           />
//           <DialogTitle>
//             {!response ? "Retrieving Response" : "Response"}
//           </DialogTitle>
//           <DialogContent>
//             {loading && <CircularProgress />}
//             {response && <DialogContentText>Response: {response}</DialogContentText>}
//           </DialogContent>
//           <DialogActions>
//             <Button
//               sx={{
//                 backgroundColor: "primary.main",
//                 color: "white",
//               }}
//               className="category-btn"
//               onClick={handleAnotherQuestion}
//             >
//               Ask another question
//             </Button>
//             <Button
//               sx={{
//                 backgroundColor: "primary.main",
//                 color: "white",
//               }}
//               className="category-btn"
//               onClick={handleClose}
//             >
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {!loading && !response && (
//         <Dialog open={open} onClose={handleClose} sx={{ textAlign: "center" }}>
//           <KeyboardVoiceIcon
//             sx={{
//               fontSize: "70px",
//               backgroundColor: "primary.main",
//               color: listening ? "secondary.main" : "white",
//               ml: "5px",
//               borderRadius: "100%",
//               padding: "20px",
//               margin: "20px auto",
//             }}
//           />
//           <DialogTitle>Ask Your Question</DialogTitle>
//           <DialogContent>
//             <TextField
//               id="outlined-textarea"
//               label="Your Question"
//               placeholder="Your question will be visible here"
//               multiline
//               value={editableTranscript}
//               onChange={(e) => setEditableTranscript(e.target.value)}
//               fullWidth
//               sx={{ margin: "20px 0" }}
//             />
//             <ButtonGroup aria-label="Buttons to control speech recognition">
//               <Button
//                 sx={{
//                   backgroundColor: "primary.main",
//                   color: "white",
//                 }}
//                 aria-label="This is a button for start or stopping the speech to text"
//                 className="category-btn"
//                 onClick={handleStartStop}
//               >
//                 {startOrStop}
//               </Button>
//               <Button
//                 sx={{
//                   backgroundColor: "primary.main",
//                   color: "white",
//                 }}
//                 className="category-btn"
//                 onClick={textToSpeech}
//               >
//                 Text To Speech
//               </Button>
//               <Button
//                 sx={{
//                   backgroundColor: "primary.main",
//                   color: "white",
//                 }}
//                 className="category-btn"
//                 onClick={handleReset}
//               >
//                 Reset Question
//               </Button>
//             </ButtonGroup>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               sx={{
//                 backgroundColor: "primary.main",
//                 color: "white",
//               }}
//               className="category-btn"
//               onClick={handleClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               sx={{
//                 backgroundColor: "primary.main",
//                 color: "white",
//               }}
//               onClick={handleQuestion}
//             >
//               Submit Question
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </React.Fragment>
//   );
// };

// export default AskAI;

import React from 'react'

const AskAI = () => {
  return (
    <div>AskAI</div>
  )
}

export default AskAI