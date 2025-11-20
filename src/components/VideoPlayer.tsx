import React, { useState, useEffect, useCallback } from "react";
import { Typography, Box, Chip, Grid } from "@mui/material";
import DisplayDescriptions from "./DisplayDescriptions";

interface Description {
    text_history: string[];
    timestamp_start: string;
    timestamp_end: string;
    [key: string]: any;
}

interface VideoPlayerProps {
    videoID ?: number;
    yesDesc: boolean;
    videoUrl: string;
    title: string;
    descriptionList?: Description[];
    parentCallback: (currentTime: number, audioDescription?: any, playVid?: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    yesDesc,
    videoUrl,
    title,
    descriptionList,
    parentCallback
}) => {
    const video = videoUrl;

    // console.log("my video url", videoUrl)

    const defaultDescription: Description = {
        text_history: ["No description playing"],
        timestamp_start: "-",
        timestamp_end: "-"
    };

    const [videoDescriptions, setVideoDescriptions] = useState<Description[]>([defaultDescription]);
    const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState<number>(0);
    const [prevDescriptionIndex, setPrevDescriptionIndex] = useState<number>(0);
    const [isSpeechPlaying, setIsSpeechPlaying] = useState<boolean>(false);
    const [playSpeech, setPlaySpeech] = useState<boolean>(true);

    useEffect(() => {
        const updatedDescriptions = [defaultDescription, ...(descriptionList || [])];
        setCurrentDescriptionIndex(0);
        setVideoDescriptions(updatedDescriptions);
    }, [descriptionList]);

    const debouncedHandleTimeUpdate = useCallback(() => {
        const videoElement = document.getElementById("video") as HTMLVideoElement | null;
        if (!videoElement) return;

        const currentTime = Math.floor(videoElement.currentTime);
        parentCallback(Math.floor(currentTime));

        if (videoDescriptions.length > 0) {
            const index = videoDescriptions.findIndex(
                (description) => parseInt(description.timestamp_start) === currentTime
            );

            if (index !== -1 && index !== currentDescriptionIndex && yesDesc) {
                setCurrentDescriptionIndex(index);
                videoElement.pause();
            }
        }
    }, [currentDescriptionIndex, videoDescriptions, parentCallback, yesDesc]);

    useEffect(() => {
        const videoElement = document.getElementById("video") as HTMLVideoElement | null;
        if (!videoElement) return;

        const handleTimeUpdate = (): void => {
            debouncedHandleTimeUpdate();
        };

        videoElement.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [debouncedHandleTimeUpdate]);

    const handleCallback = (playedIndex: number): void => {
        setPrevDescriptionIndex(playedIndex);
        const videoElement = document.getElementById("video") as HTMLVideoElement | null;
        if (videoElement) {
            videoElement.play();
        }
    };

    const currentDescription = videoDescriptions[currentDescriptionIndex] || defaultDescription;

    return (
        <div>
            {video && (<video id="video" controls width="100%" height="500px">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>)}
            <Grid mt={2}>
                <Typography className="heading-highlighted" mb={2}>{title}</Typography>
                {yesDesc && (<DisplayDescriptions
                    description={currentDescription}
                    parentCallback={handleCallback}
                    cIndex={currentDescriptionIndex}
                    pIndex={prevDescriptionIndex}
                />)}
            </Grid>
        </div>
    );
};

export default VideoPlayer;