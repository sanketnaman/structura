import React from 'react';
import { Line } from '@react-three/drei';

interface ExtensionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  dashed?: boolean;
}

export const ExtensionLine: React.FC<ExtensionLineProps> = ({
  start,
  end,
  color = '#64748B',
  dashed = false,
}) => {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={1}
      dashed={dashed}
      dashScale={20}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
};

interface EndTickProps {
  center: [number, number, number];
  axis: 'x' | 'y' | 'z';
  size?: number;
  color?: string;
}

export const EndTick: React.FC<EndTickProps> = ({
  center,
  axis,
  size = 0.2,
  color = '#D97706',
}) => {
  let start: [number, number, number] = [center[0], center[1], center[2]];
  let end: [number, number, number] = [center[0], center[1], center[2]];

  const half = size / 2;
  if (axis === 'x') {
    start = [center[0] - half, center[1] + half, center[2]];
    end = [center[0] + half, center[1] - half, center[2]];
  } else if (axis === 'y') {
    start = [center[0] - half, center[1], center[2] + half];
    end = [center[0] + half, center[1], center[2] - half];
  } else {
    start = [center[0], center[1] + half, center[2] - half];
    end = [center[0], center[1] - half, center[2] + half];
  }

  return <Line points={[start, end]} color={color} lineWidth={1.5} />;
};
