import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Grid from '@mui/material/Grid';
import MenuOptions from '../components/MenuOptions';
import Navbar from "../components/Navbar";
import SideNav from "../components/SideNav";
import VideoPlayer from "../components/VideoPlayer";
import Comment from "../components/Comment";
// import {
//   Comment,
//   Navbar,
//   YoutubeVideoPlayer,
//   ChangeRating,
//   VideoPlayer,
// } from "../components/";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { GET_VIDEOS, GET_VIDEO_DESCRIPTIONS } from "../utils/constants";
import { DRAWERWIDTH } from "../utils/constants";

interface Video {
    video_presigned_url?: string;
    title: string;
    url: string;
}

interface Description {
    username: string;
    [key: string]: any;
}

interface ProgressData {
    played: number;
    [key: string]: any;
}

interface VideoPageParams {
    video_id: string;
}

function ensureVideoUrlFormat(url: string | null | undefined): string | null {
    if (url == null) {
        console.error("Error: URL is null or undefined");
        return null;
    }
    if (!url.startsWith("videos/")) {
        url = "videos/" + url;
    }
    return url;
}

function ensureVideoId(url: string | undefined): string | null {
    if (url) {
        const match = url.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|.*[&?]))([^&?\s]+)/
        );
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}


const VideoPage: React.FC = () => {
    const token = Cookies.get("jwtToken");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [alerttext, setAlerttext] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isPlaying, setIsplaying] = useState<boolean>(false);
    const [played, setPlayed] = useState<number>(0);
    const [desc, setDesc] = useState<Description[]>([]);
    const [descUser, setDescUser] = useState<Description[]>([]);
    const [video, setVideo] = useState<Video>({} as Video);
    const [descOn, setDescOn] = useState<boolean>(true);
    const [descriptionsLoaded, setDescriptionsLoaded] = useState<boolean>(false);
    const navigate = useNavigate();
    const [noDescription, setNoDescription] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            setIsLoggedIn(false);
        }
    }, [token]);

    const { video_id } = useParams<VideoPageParams>();
    const params = { id: video_id, jwt: token };
    const videoUrl = `${GET_VIDEOS}/${video_id}`;
    const descriptionUrl = `${GET_VIDEO_DESCRIPTIONS}`;
    const parameters = { video_id: video_id };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "o" || event.key === "O") {
            handleViewDescriptions(descOn);
        }
    };

    const handleViewDescriptions = (descOn: boolean): void => {
        setDescOn(descOn);
    };

    const handleCallback = (
        progressData: number,
        audioDescription: any,
        playVid: boolean
    ): void => {
        console.log("getting data in this video page", progressData, audioDescription);
        setPlayed(progressData);
        setIsplaying(playVid);
    };

    const handleResumeDescriptionCallback = (): void => {
        setIsplaying(true);
    };

    const handleChangeUserCallback = (filteredDescriptions: Description[]): void => {
        setDescUser(filteredDescriptions);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [descOn]);

    useEffect(() => {
        axios
            .get<{ video: Video }>(videoUrl, { params: params })
            .then((response) => {
                setVideo(response.data.video);
                console.log("Received video data", response);
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });

        axios
            .get<{ descriptions: Description[] | string }>(descriptionUrl, { params: parameters })
            .then((response) => {
                console.log("this is the response", response);
                if (response.data.descriptions === "VIDEO_NOT_FOUND") {
                    console.log("Video descriptions not found");
                    navigate("/error", {
                        state: {
                            message:
                                "Sorry, the video you are looking for was not found, return back to homepage.",
                        },
                    });
                    return;
                }
                const descriptions = response.data.descriptions as Description[];
                setDesc(descriptions);
                if (descriptions.length > 0) {
                    setNoDescription(true);
                }
                const uniqueUsernames = Array.from(
                    new Set(descriptions.map((description) => description.username))
                );
                setDescUser(
                    descriptions.filter(
                        (description) => description.username === uniqueUsernames[0]
                    )
                );
                console.log("Received description data", descriptions);
                setDescriptionsLoaded(true);
                setLoading(false);
            })
            .catch((err: AxiosError) => {
                console.log("Error receiving description data", err);
                setLoading(false);
            });
    }, [video_id, token]);

    return (
        <Box sx={{ display: "flex" }}>
            <SideNav />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${DRAWERWIDTH}px)` },
                }}
            >
                <Navbar />
                {!isLoading && (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <>
                                {video.video_presigned_url ? (
                                    <VideoPlayer
                                        yesDesc={descOn}
                                        videoUrl={video.video_presigned_url}
                                        playVid={isPlaying}
                                        title={video.title}
                                        descriptionList={descUser}
                                        parentCallback={handleCallback}
                                    />
                                ) : (
                                    <VideoPlayer
                                        yesDesc={descOn}
                                        videoUrl={video.video_presigned_url}
                                        playVid={isPlaying}
                                        title={video.title}
                                        descriptionList={descUser}
                                        parentCallback={handleCallback}
                                    />
                                    //   <YoutubeVideoPlayer
                                    //     yesDesc={descOn}
                                    //     path={ensureVideoUrlFormat(video.video_presigned_url)}
                                    //     playVid={isPlaying}
                                    //     title={video.title}
                                    //     descrip={undefined}
                                    //     parentCallback={handleCallback}
                                    //     videoID={ensureVideoId(video.url)}
                                    //   />
                                )}
                            </>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} mt={2}>
                            <MenuOptions
                                video_id={video_id}
                                videoUrl={video.video_presigned_url}
                                title={video.title}
                                videoDescriptions={descUser}
                                parentCallback={handleViewDescriptions}
                                time={played}
                                youtubeID={video.url}
                            />
                            <Box
                                mt={2}
                                p={2}
                                sx={{
                                    backgroundColor: "white",
                                    paddingBottom: "20px",
                                }}
                                boxShadow={3}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ color: "primary.dark" }}
                                    marginBottom={1}
                                >
                                    Q&A
                                </Typography>
                                <Divider />
                                <Box sx={{ overflow: "scroll", height: "350px" }} mt={1}>
                                    <Comment videoID={video_id} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default VideoPage;