import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Icons } from "./ui/icons";
import { useToast } from "./ui/use-toast";
import { Progress } from "./ui/progress";
import {
  AlertCircle,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  question: string;
  category: "technical" | "behavioral" | "situational" | "company";
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // seconds
  followUp?: string[];
}

interface InterviewSession {
  id: string;
  jobId: string;
  candidateId: string;
  questions: InterviewQuestion[];
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
  aiAnalysis?: {
    confidence: number;
    communicationSkills: number;
    technicalKnowledge: number;
    problemSolving: number;
    culturalFit: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    recommendation: "hire" | "consider" | "reject";
  };
}

interface VideoInterviewProps {
  session: InterviewSession;
  onComplete: (results: any) => void;
  onCancel: () => void;
}

export function VideoInterview({
  session,
  onComplete,
  onCancel,
}: VideoInterviewProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [interviewState, setInterviewState] = useState<
    "setup" | "question" | "recording" | "break" | "completed"
  >("setup");
  const [responses, setResponses] = useState<
    { questionId: string; recording: Blob; duration: number }[]
  >([]);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / session.questions.length) * 100;

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setInterviewState("break");
    }
  }, [isRecording]);

  const completeInterview = useCallback(async () => {
    setInterviewState("completed");
    setAiAnalysisLoading(true);

    try {
      // Simulate AI analysis (replace with actual API call)
      const mockAnalysis = await simulateAIAnalysis(responses);

      const results = {
        sessionId: session.id,
        responses,
        aiAnalysis: mockAnalysis,
        completedAt: new Date().toISOString(),
      };

      onComplete(results);
    } catch (error) {
      console.error("Error completing interview:", error);
      toast({
        title: "Analysis Error",
        description:
          "Failed to analyze interview. Results saved without AI analysis.",
        variant: "destructive",
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  }, [responses, session.id, onComplete, toast]);

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast({
          title: "Camera/Microphone Access Required",
          description:
            "Please allow camera and microphone access to start the interview.",
          variant: "destructive",
        });
      }
    };

    initializeMedia();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast, mediaStream]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (interviewState === "recording" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [interviewState, timeRemaining, stopRecording]);

  const toggleVideo = useCallback(() => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  }, [mediaStream]);

  const toggleAudio = useCallback(() => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  }, [mediaStream]);

  const startRecording = useCallback(() => {
    if (!mediaStream) return;

    try {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setResponses((prev) => [
          ...prev,
          {
            questionId: currentQuestion.id,
            recording: blob,
            duration: currentQuestion.timeLimit - timeRemaining,
          },
        ]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setInterviewState("recording");
      setTimeRemaining(currentQuestion.timeLimit);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  }, [mediaStream, currentQuestion, timeRemaining, toast]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setInterviewState("question");
    } else {
      completeInterview();
    }
  }, [currentQuestionIndex, session.questions.length, completeInterview]);

  const simulateAIAnalysis = async (
    responses: any[],
  ): Promise<InterviewSession["aiAnalysis"]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      confidence: 85,
      communicationSkills: 82,
      technicalKnowledge: 88,
      problemSolving: 79,
      culturalFit: 91,
      overallScore: 85,
      strengths: [
        "Clear and articulate communication",
        "Strong technical problem-solving approach",
        "Good cultural alignment with company values",
        "Confident presentation style",
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider elaborating on past project challenges",
        "Practice explaining complex concepts more simply",
      ],
      recommendation: "hire",
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: InterviewQuestion["category"]) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "behavioral":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "situational":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "company":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (interviewState === "setup") {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Interview Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant={videoEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleVideo}
            >
              {videoEnabled ? (
                <Video className="h-4 w-4 mr-2" />
              ) : (
                <VideoOff className="h-4 w-4 mr-2" />
              )}
              {videoEnabled ? "Camera On" : "Camera Off"}
            </Button>
            <Button
              variant={audioEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleAudio}
            >
              {audioEnabled ? (
                <Mic className="h-4 w-4 mr-2" />
              ) : (
                <MicOff className="h-4 w-4 mr-2" />
              )}
              {audioEnabled ? "Mic On" : "Mic Off"}
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Icons.info className="h-4 w-4" />
              Interview Instructions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• You will be asked {session.questions.length} questions</li>
              <li>• Each question has a time limit for your response</li>
              <li>• Speak clearly and look at the camera</li>
              <li>• Take your time to think before responding</li>
              <li>• You can take short breaks between questions</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel Interview
            </Button>
            <Button
              onClick={() => setInterviewState("question")}
              disabled={!mediaStream}
            >
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (interviewState === "completed") {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.check className="h-5 w-5 text-green-600" />
            Interview Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {aiAnalysisLoading ? (
            <div className="text-center py-8">
              <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Analyzing your interview responses...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icons.check className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Thank you for completing the interview!
              </h3>
              <p className="text-muted-foreground">
                Your responses have been recorded and will be reviewed by our
                team.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Interview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </p>
          </div>
          {interviewState === "recording" && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="font-mono text-lg">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Preview */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="animate-pulse">
                  Recording
                </Badge>
              </div>
            )}
          </div>

          {/* Question Panel */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getCategoryColor(currentQuestion.category)}>
                  {currentQuestion.category}
                </Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                Time limit: {formatTime(currentQuestion.timeLimit)}
              </p>
            </div>

            {interviewState === "question" && (
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
                  <p className="text-sm">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Take a moment to think about your answer. When ready, click
                    "Start Recording" to begin your response.
                  </p>
                </div>
                <Button onClick={startRecording} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              </div>
            )}

            {interviewState === "recording" && (
              <div className="space-y-3">
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-full"
                >
                  <Icons.close className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            )}

            {interviewState === "break" && (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                  <p className="text-sm">
                    <Icons.check className="h-4 w-4 inline mr-1 text-green-600" />
                    Response recorded successfully!
                  </p>
                </div>
                <Button onClick={nextQuestion} className="w-full">
                  {currentQuestionIndex < session.questions.length - 1
                    ? "Next Question"
                    : "Complete Interview"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVideo}
            className={!videoEnabled ? "text-red-600" : ""}
          >
            {videoEnabled ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className={!audioEnabled ? "text-red-600" : ""}
          >
            {audioEnabled ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <Icons.close className="h-4 w-4 mr-2" />
            End Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default VideoInterview;
