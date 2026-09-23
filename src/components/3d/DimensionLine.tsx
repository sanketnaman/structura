import React from 'react';
import { Line } from '@react-three/drei';
import { DimensionLabel } from './DimensionLabel';
import { ExtensionLine } from './MeasurementMarkers';

interface DimensionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  subtext?: string;
  color?: string;
  labelOffset?: [number, number, number];
  extensionFromStart?: [number, number, number];
  extensionFromEnd?: [number, number, number];
}

export const DimensionLine: React.FC<DimensionLineProps> = ({
  start,
  end,
  label,
  subtext,
  color = '#D97706',
  labelOffset = [0, 0, 0],
  extensionFromStart,
  extensionFromEnd,
}) => {
  // Midpoint calculation for label placement
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2 + labelOffset[0],
    (start[1] + end[1]) / 2 + labelOffset[1],
    (start[2] + end[2]) / 2 + labelOffset[2],
  ];

  return (
    <group>
      {/* Optional extension lines from object surface */}
      {extensionFromStart && (
        <ExtensionLine start={extensionFromStart} end={start} color="#94A3B8" dashed />
      )}
      {extensionFromEnd && (
        <ExtensionLine start={extensionFromEnd} end={end} color="#94A3B8" dashed />
      )}

      {/* Main dimension line */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={2}
      />

      {/* Ticks at the ends */}
      <mesh position={start}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Centered label */}
      <DimensionLabel position={mid} text={label} subtext={subtext} color={color} />
    </group>
  );
};
