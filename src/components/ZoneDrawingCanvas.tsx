
import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';
import { Zone, Point } from '@/types/zone';
import Konva from 'konva';

interface ZoneDrawingCanvasProps {
  width: number;
  height: number;
  zones: Zone[];
  selectedZoneId: string | null;
  currentPoints: Point[];
  isDrawing: boolean;
  onPointAdd: (point: Point) => void;
  onZoneSelect: (zoneId: string) => void;
  onZoneUpdate: (zoneId: string, updates: Partial<Zone>) => void;
}

const ZoneDrawingCanvas: React.FC<ZoneDrawingCanvasProps> = ({
  width,
  height,
  zones,
  selectedZoneId,
  currentPoints,
  isDrawing,
  onPointAdd,
  onZoneSelect,
  onZoneUpdate,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      console.log('Adding point:', pos);
      onPointAdd({ x: pos.x, y: pos.y });
    }
  };

  const handlePointDrag = (zoneId: string, pointIndex: number, newPos: Point) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      const newPoints = [...zone.points];
      newPoints[pointIndex] = newPos;
      onZoneUpdate(zoneId, { points: newPoints });
    }
  };

  const renderZone = (zone: Zone) => {
    const isSelected = selectedZoneId === zone.id;
    const opacity = isSelected ? 0.4 : 0.2;
    const strokeWidth = isSelected ? 3 : 2;

    if (zone.points.length < 3) return null;

    const points = zone.points.flatMap(p => [p.x, p.y]);
    
    return (
      <Group key={zone.id}>
        <Line
          points={points}
          closed={zone.points.length === 4}
          fill={zone.color}
          stroke={zone.color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          onClick={() => onZoneSelect(zone.id)}
        />
        {isSelected && zone.points.map((point, index) => (
          <Circle
            key={`${zone.id}-point-${index}`}
            x={point.x}
            y={point.y}
            radius={6}
            fill="#ffffff"
            stroke={zone.color}
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const newPos = { x: e.target.x(), y: e.target.y() };
              handlePointDrag(zone.id, index, newPos);
            }}
          />
        ))}
      </Group>
    );
  };

  const renderCurrentPoints = () => {
    if (!isDrawing || currentPoints.length === 0) return null;

    return (
      <Group>
        {currentPoints.map((point, index) => (
          <Circle
            key={`current-${index}`}
            x={point.x}
            y={point.y}
            radius={4}
            fill="#3B82F6"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
        {currentPoints.length > 1 && (
          <Line
            points={currentPoints.flatMap(p => [p.x, p.y])}
            stroke="#3B82F6"
            strokeWidth={2}
            dash={[5, 5]}
          />
        )}
      </Group>
    );
  };

  if (width === 0 || height === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ 
        cursor: isDrawing ? 'crosshair' : 'default',
        pointerEvents: isDrawing ? 'auto' : 'none',
        zIndex: 10
      }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleStageClick}
      >
        <Layer>
          {zones.map(renderZone)}
          {renderCurrentPoints()}
        </Layer>
      </Stage>
    </div>
  );
};

export default ZoneDrawingCanvas;
