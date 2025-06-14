
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVideoContext } from '@/context/VideoContext';
import { Play, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { videos } = useVideoContext();

  if (videos.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Dashboard</h1>
          <p className="text-gray-600">Manage and view all your uploaded videos</p>
        </div>
        
        <div className="text-center py-12">
          <div className="mb-4">
            <Play className="h-16 w-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos uploaded yet</h3>
          <p className="text-gray-600 mb-6">Start by uploading your first video to get started.</p>
          <Link to="/upload">
            <Button>Upload Video</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Dashboard</h1>
        <p className="text-gray-600">Manage and view all your uploaded videos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 relative">
              <video
                src={video.url}
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{video.title}</CardTitle>
              <CardDescription className="line-clamp-3">{video.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {video.uploadDate.toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <Badge variant="secondary">{video.category}</Badge>
                </div>
                
                {video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {video.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Link to={`/annotator?video=${video.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Annotate
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
