
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
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);
    
    // Use MutationObserver to detect when video dimensions change
    const observer = new MutationObserver(updateContainerDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        attributes: true, 
        childList: true, 
        subtree: true 
      });
    }

    return () => {
      window.removeEventListener('resize', updateContainerDimensions);
      observer.disconnect();
    };
  }, []);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      // Calculate the actual position relative to the video dimensions
      const scaleX = width / containerDimensions.width;
      const scaleY = height / containerDimensions.height;
      
      const actualPos = {
        x: pos.x * scaleX,
        y: pos.y * scaleY
      };
      
      console.log('Adding point at video coordinates:', actualPos);
      onPointAdd(actualPos);
    }
  };

  const handlePointDrag = (zoneId: string, pointIndex: number, newPos: Point) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      // Scale the dragged position to video coordinates
      const scaleX = width / containerDimensions.width;
      const scaleY = height / containerDimensions.height;
      
      const actualPos = {
        x: newPos.x * scaleX,
        y: newPos.y * scaleY
      };
      
      const newPoints = [...zone.points];
      newPoints[pointIndex] = actualPos;
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

  const scalePointsToCanvas = (points: Point[]): Point[] => {
    const scaleX = containerDimensions.width / width;
    const scaleY = containerDimensions.height / height;
    
    return points.map(point => ({
      x: point.x * scaleX,
      y: point.y * scaleY
    }));
  };

  const renderZone = (zone: Zone) => {
    const isSelected = selectedZoneId === zone.id;
    const opacity = isSelected ? 0.4 : 0.2;
    const strokeWidth = isSelected ? 3 : 2;

    if (zone.points.length < 3) return null;

    // Scale zone points to match current canvas dimensions
    const scaledPoints = scalePointsToCanvas(zone.points);
    const points = scaledPoints.flatMap(p => [p.x, p.y]);
    const center = calculateZoneCenter(scaledPoints);
    
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
        {isSelected && scaledPoints.map((point, index) => (
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

    const scaledPoints = scalePointsToCanvas(currentPoints);

    return (
      <Group>
        {scaledPoints.map((point, index) => (
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
        {scaledPoints.length > 1 && (
          <Line
            points={scaledPoints.flatMap(p => [p.x, p.y])}
            stroke="#3B82F6"
            strokeWidth={2}
            dash={[5, 5]}
          />
        )}
      </Group>
    );
  };

  if (width === 0 || height === 0 || containerDimensions.width === 0) return null;

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
        width={containerDimensions.width}
        height={containerDimensions.height}
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
