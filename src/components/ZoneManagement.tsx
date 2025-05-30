
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zone } from '@/types/zone';
import { Square, Edit, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ZoneManagementProps {
  zones: Zone[];
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
  onZoneUpdate: (zoneId: string, updates: Partial<Zone>) => void;
  onZoneDelete: (zoneId: string) => void;
  onStartDrawing: () => void;
  isDrawing: boolean;
  hasVideo: boolean;
}

const ZoneManagement: React.FC<ZoneManagementProps> = ({
  zones,
  selectedZoneId,
  onZoneSelect,
  onZoneUpdate,
  onZoneDelete,
  onStartDrawing,
  isDrawing,
  hasVideo,
}) => {
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleEditStart = (zone: Zone) => {
    setEditingZoneId(zone.id);
    setEditName(zone.name);
  };

  const handleEditSave = () => {
    if (editingZoneId && editName.trim()) {
      onZoneUpdate(editingZoneId, { name: editName.trim() });
      setEditingZoneId(null);
      toast.success('Zone name updated');
    }
  };

  const handleEditCancel = () => {
    setEditingZoneId(null);
    setEditName('');
  };

  const handleSaveZones = () => {
    if (zones.length === 0) {
      toast.error('No zones to save');
      return;
    }

    const zonesData = zones.map(zone => ({
      id: zone.id,
      name: zone.name,
      coordinates: zone.points,
      color: zone.color
    }));

    const jsonString = JSON.stringify(zonesData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zones.json';
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Zones saved as JSON file');
  };

  return (
    <Card className="h-fit bg-white shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Square className="h-5 w-5 text-blue-600" />
          Zone Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onStartDrawing}
          disabled={!hasVideo || isDrawing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isDrawing ? 'Drawing Zone...' : 'Draw New Zone'}
        </Button>

        {zones.length > 0 && (
          <Button
            onClick={handleSaveZones}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Save Zones as JSON
          </Button>
        )}

        {isDrawing && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Click 4 points on the video to create a zone
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            Zones ({zones.length})
          </h3>
          
          {zones.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No zones created yet
            </p>
          )}

          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedZoneId === zone.id
                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onZoneSelect(zone.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: zone.color }}
                  />
                  {editingZoneId === zone.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="h-6 text-sm px-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-medium text-sm">{zone.name}</span>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {editingZoneId === zone.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSave();
                        }}
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-600 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCancel();
                        }}
                      >
                        ✕
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(zone);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onZoneDelete(zone.id);
                        }}
                      >
                        ✕
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {zone.points.length} points defined
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneManagement;
