
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/context/VideoContext';
import { useSearchParams } from 'react-router-dom';
import VideoZoneAnnotator from '@/components/VideoZoneAnnotator';
import { Video, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Annotator = () => {
  const { videos } = useVideoContext();
  const [searchParams] = useSearchParams();
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');

  useEffect(() => {
    const videoParam = searchParams.get('video');
    if (videoParam && videos.find(v => v.id === videoParam)) {
      setSelectedVideoId(videoParam);
    }
  }, [searchParams, videos]);

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  if (videos.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zone Annotator</h1>
          <p className="text-gray-600">Draw zones on your videos for analysis</p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <CardTitle>No Videos Available</CardTitle>
            <CardDescription>
              You need to upload videos first before you can annotate them.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/upload">
              <Button>Upload Video</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zone Annotator</h1>
          <p className="text-gray-600">Select a video to start drawing zones</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Select Video</CardTitle>
            <CardDescription>Choose a video to annotate with zones</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a video..." />
              </SelectTrigger>
              <SelectContent>
                {videos.map((video) => (
                  <SelectItem key={video.id} value={video.id}>
                    {video.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Zone Annotator</h1>
            <p className="text-gray-600">Drawing zones on: {selectedVideo.title}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {videos.map((video) => (
                <SelectItem key={video.id} value={video.id}>
                  {video.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <VideoZoneAnnotator videoFile={selectedVideo.file} videoUrl={selectedVideo.url} />
    </div>
  );
};

export default Annotator;
