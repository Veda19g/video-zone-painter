
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Group, Text } from 'react-konva';
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
      console.log('Click position on canvas:', pos);
      console.log('Canvas dimensions:', { width, height });
      
      // Since we're using fixed 640x360 dimensions, use the position directly
      onPointAdd(pos);
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

  const calculateZoneCenter = (points: Point[]): Point => {
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);
    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  };

  const renderZone = (zone: Zone) => {
    const isSelected = selectedZoneId === zone.id;
    const opacity = isSelected ? 0.4 : 0.2;
    const strokeWidth = isSelected ? 3 : 2;

    if (zone.points.length < 3) return null;

    const points = zone.points.flatMap(p => [p.x, p.y]);
    const center = calculateZoneCenter(zone.points);
    
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
        <Text
          x={center.x}
          y={center.y}
          text={zone.name}
          fontSize={14}
          fontFamily="Arial"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth={1}
          align="center"
          verticalAlign="middle"
          offsetX={zone.name.length * 4}
          offsetY={7}
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
        pointerEvents: 'auto',
        zIndex: 10,
        width: '640px',
        height: '360px'
      }}
    >
      <Stage
        ref={stageRef}
        width={640}
        height={360}
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
