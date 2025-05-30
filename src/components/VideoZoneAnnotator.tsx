
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import VideoUpload from './VideoUpload';
import VideoPlayer from './VideoPlayer';
import ZoneDrawingCanvas from './ZoneDrawingCanvas';
import ZoneManagement from './ZoneManagement';
import { Zone, Point } from '@/types/zone';
import { toast } from 'sonner';

const VideoZoneAnnotator = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    toast.success('Video uploaded successfully!');
  };

  const handleVideoLoad = (width: number, height: number) => {
    setVideoDimensions({ width, height });
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setCurrentPoints([]);
    setSelectedZoneId(null);
    toast.info('Click 4 points to create a zone');
  };

  const addPoint = (point: Point) => {
    if (!isDrawing) return;

    const newPoints = [...currentPoints, point];
    setCurrentPoints(newPoints);

    if (newPoints.length === 4) {
      const newZone: Zone = {
        id: `zone-${Date.now()}`,
        name: `Zone ${zones.length + 1}`,
        points: newPoints,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      setZones([...zones, newZone]);
      setCurrentPoints([]);
      setIsDrawing(false);
      toast.success('Zone created successfully!');
    }
  };

  const updateZone = (zoneId: string, updates: Partial<Zone>) => {
    setZones(zones.map(zone => 
      zone.id === zoneId ? { ...zone, ...updates } : zone
    ));
  };

  const deleteZone = (zoneId: string) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(null);
    }
    toast.success('Zone deleted');
  };

  const selectZone = (zoneId: string) => {
    setSelectedZoneId(selectedZoneId === zoneId ? null : zoneId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Zone Annotator
          </h1>
          <p className="text-gray-600">
            Upload a video and draw quadrilateral zones for analysis
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <Card className="p-6 bg-white shadow-lg">
              {!videoFile ? (
                <VideoUpload onVideoUpload={handleVideoUpload} />
              ) : (
                <div className="relative">
                  <VideoPlayer
                    videoUrl={videoUrl}
                    onVideoLoad={handleVideoLoad}
                  />
                  <ZoneDrawingCanvas
                    width={videoDimensions.width}
                    height={videoDimensions.height}
                    zones={zones}
                    selectedZoneId={selectedZoneId}
                    currentPoints={currentPoints}
                    isDrawing={isDrawing}
                    onPointAdd={addPoint}
                    onZoneSelect={selectZone}
                    onZoneUpdate={updateZone}
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-1">
            <ZoneManagement
              zones={zones}
              selectedZoneId={selectedZoneId}
              onZoneSelect={selectZone}
              onZoneUpdate={updateZone}
              onZoneDelete={deleteZone}
              onStartDrawing={startDrawing}
              isDrawing={isDrawing}
              hasVideo={!!videoFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoZoneAnnotator;
