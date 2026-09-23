import React, { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { DimensionLine } from './DimensionLine';
import { formatNumber } from '../../lib/calculators/common/math';

export interface BrickWallProps {
  length: number;          // wall length (ft or m)
  height: number;          // wall height (ft or m)
  unit?: 'imperial' | 'metric';
  isDoubleWythe?: boolean;
  brickLength?: number;    // inches or mm
  brickHeight?: number;    // inches or mm
  jointThickness?: number; // inches or mm
}

export const BrickWall: React.FC<BrickWallProps> = ({
  length,
  height,
  unit = 'imperial',
  isDoubleWythe = false,
  brickLength,
  brickHeight,
  jointThickness,
}) => {
  const isMetric = unit === 'metric';

  const {
    visualLength,
    visualHeight,
    visualThickness,
    numCourses,
    coursesPositions,
  } = useMemo(() => {
    const safeL = Math.max(1, isNaN(length) ? 25 : length);
    const safeH = Math.max(1, isNaN(height) ? 8 : height);

    // Normalize max dimension to ~4.8 viewport units
    const maxDim = Math.max(safeL, safeH * 1.6);
    const scale = Math.min(4.8 / maxDim, 0.4);

    const vL = Math.max(1.5, safeL * scale);
    const vH = Math.max(1.0, safeH * scale);
    const vT = isDoubleWythe ? 0.65 : 0.35;

    // Estimate real courses based on brick height + joint
    let courseHeightReal: number;
    if (isMetric) {
      const bH = brickHeight ?? 57;
      const jT = jointThickness ?? 10;
      courseHeightReal = (bH + jT) / 1000; // in meters
    } else {
      const bH = brickHeight ?? 2.25;
      const jT = jointThickness ?? 0.375;
      courseHeightReal = (bH + jT) / 12; // in feet
    }

    const calculatedCourses = Math.floor(safeH / courseHeightReal);
    const numCourses = Math.min(Math.max(calculatedCourses, 4), 24); // Cap visual lines for performance

    const coursesPositions: number[] = [];
    const step = vH / numCourses;
    for (let i = 1; i < numCourses; i++) {
      coursesPositions.push(i * step);
    }

    return {
      visualLength: vL,
      visualHeight: vH,
      visualThickness: vT,
      numCourses,
      coursesPositions,
    };
  }, [length, height, isDoubleWythe, isMetric, brickHeight, jointThickness]);

  const halfL = visualLength / 2;
  const halfH = visualHeight / 2;
  const halfT = visualThickness / 2;

  const lengthLabel = `${formatNumber(length)} ${isMetric ? 'm' : 'ft'}`;
  const heightLabel = `${formatNumber(height)} ${isMetric ? 'm' : 'ft'}`;
  const thickLabel = isDoubleWythe
    ? (isMetric ? '20 cm Double Wythe' : '8" Double Wythe')
    : (isMetric ? '10 cm Single Wythe' : '4" Single Wythe');

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Reinforced Concrete Footing Under Wall */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[visualLength + 0.6, 0.2, visualThickness + 0.6]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} />
        <Edges color="#334155" threshold={15} />
      </mesh>

      {/* 2. Main Masonry Wall Body (Architectural Terracotta / Clay Brick) */}
      <mesh position={[0, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[visualLength, visualHeight, visualThickness]} />
        <meshStandardMaterial
          color="#9A3412"
          roughness={0.88}
          metalness={0.04}
        />
        <Edges color="#7C2D12" threshold={15} />
      </mesh>

      {/* 3. Horizontal Bed Joint Coursing Lines */}
      {coursesPositions.map((yPos, idx) => (
        <mesh
          key={idx}
          position={[0, yPos, halfT + 0.002]}
        >
          <planeGeometry args={[visualLength * 0.99, 0.015]} />
          <meshBasicMaterial color="#CBD5E1" />
        </mesh>
      ))}

      {/* 4. Mortar Cap / Cast Stone Coping on Top */}
      <mesh position={[0, visualHeight + 0.04, 0]}>
        <boxGeometry args={[visualLength + 0.08, 0.08, visualThickness + 0.08]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
        <Edges color="#94A3B8" threshold={15} />
      </mesh>

      {/* 5. Length Dimension Line (Front) */}
      <DimensionLine
        start={[-halfL, 0.2, halfT + 0.55]}
        end={[halfL, 0.2, halfT + 0.55]}
        label={lengthLabel}
        subtext="Length"
        extensionFromStart={[-halfL, 0.2, halfT]}
        extensionFromEnd={[halfL, 0.2, halfT]}
        labelOffset={[0, 0.3, 0]}
      />

      {/* 6. Height Dimension Line (Side/End) */}
      <DimensionLine
        start={[halfL + 0.55, 0, 0]}
        end={[halfL + 0.55, visualHeight, 0]}
        label={heightLabel}
        subtext="Height"
        extensionFromStart={[halfL, 0, 0]}
        extensionFromEnd={[halfL, visualHeight, 0]}
        labelOffset={[0.35, 0, 0]}
      />

      {/* 7. Thickness Dimension Line (Top edge) */}
      <DimensionLine
        start={[-halfL - 0.45, visualHeight, -halfT]}
        end={[-halfL - 0.45, visualHeight, halfT]}
        label={thickLabel}
        subtext="Thickness"
        extensionFromStart={[-halfL, visualHeight, -halfT]}
        extensionFromEnd={[-halfL, visualHeight, halfT]}
        labelOffset={[-0.45, 0.25, 0]}
      />
    </group>
  );
};
