import React, { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { DimensionLine } from './DimensionLine';
import { formatNumber } from '../../lib/calculators/common/math';

export interface ConcreteSlabProps {
  length: number;      // real-world length in feet or meters
  width: number;       // real-world width in feet or meters
  thickness: number;   // real-world thickness in inches or centimeters
  unit?: 'imperial' | 'metric';
  showSubgrade?: boolean;
}

export const ConcreteSlab: React.FC<ConcreteSlabProps> = ({
  length,
  width,
  thickness,
  unit = 'imperial',
  showSubgrade = true,
}) => {
  const isMetric = unit === 'metric';

  // Robust arbitrary scene normalization:
  // Converts real-world arbitrary dimensions into normalized viewport coordinates
  // while preserving exact aspect ratio and CAD readability.
  const { visualLength, visualWidth, visualThickness, numJoints } = useMemo(() => {
    const safeL = Math.max(0.5, isNaN(length) ? 20 : length);
    const safeW = Math.max(0.5, isNaN(width) ? 10 : width);
    const safeT = Math.max(0.25, isNaN(thickness) ? 4 : thickness);

    // Normalize max footprint span to standard 5.0 3D scene units
    const maxFootprint = Math.max(safeL, safeW);
    const baseScale = Math.min(5.2 / maxFootprint, 0.45);

    // Target visual bounds
    let vL = Math.max(1.2, safeL * baseScale);
    let vW = Math.max(1.0, safeW * baseScale);

    // Vertical thickness scaling: in real life, a 4" slab is 1/60th of a 20ft length.
    // In technical architectural CAD visualization, we apply vertical exaggeration
    // so thickness changes (e.g. 4" to 8") are immediately visible and measurable.
    const refThick = isMetric ? 10 : 4; // 10cm or 4in
    const thickRatio = safeT / refThick;
    const vT = Math.max(0.12, Math.min(1.4, 0.38 * Math.pow(thickRatio, 0.75)));

    // Contraction joint count based on real length (trade standard: joints every ~10 ft or 3m)
    const jointInterval = isMetric ? 3 : 10;
    const joints = Math.floor(safeL / jointInterval);

    return {
      visualLength: vL,
      visualWidth: vW,
      visualThickness: vT,
      numJoints: Math.min(joints, 8),
    };
  }, [length, width, thickness, isMetric]);

  const halfL = visualLength / 2;
  const halfW = visualWidth / 2;
  const halfT = visualThickness / 2;

  // Offsets for dimension annotations
  const dimOffsetFront = halfW + 0.65;
  const dimOffsetSide = halfL + 0.65;
  const dimCornerX = halfL + 0.4;
  const dimCornerZ = halfW + 0.4;

  const lengthLabel = `${formatNumber(length)} ${isMetric ? 'm' : 'ft'}`;
  const widthLabel = `${formatNumber(width)} ${isMetric ? 'm' : 'ft'}`;
  const thicknessLabel = `${formatNumber(thickness)} ${isMetric ? 'cm' : 'in'}`;

  // Calculate contraction joint X-coordinates
  const jointPositions = useMemo(() => {
    if (numJoints <= 0) return [];
    const step = visualLength / (numJoints + 1);
    const positions: number[] = [];
    for (let i = 1; i <= numJoints; i++) {
      positions.push(-halfL + i * step);
    }
    return positions;
  }, [numJoints, visualLength, halfL]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Compacted Gravel / Subgrade Base */}
      {showSubgrade && (
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <boxGeometry args={[visualLength + 0.6, 0.12, visualWidth + 0.6]} />
          <meshStandardMaterial
            color="#4B5563"
            roughness={0.95}
            metalness={0.05}
          />
          <Edges color="#374151" threshold={20} />
        </mesh>
      )}

      {/* 2. Main Poured Concrete Slab Mesh */}
      <mesh position={[0, halfT, 0]} castShadow receiveShadow>
        <boxGeometry args={[visualLength, visualThickness, visualWidth]} />
        <meshStandardMaterial
          color="#9CA3AF"
          roughness={0.82}
          metalness={0.08}
        />
        {/* Crisp CAD-style edge lines */}
        <Edges color="#475569" threshold={15} />
      </mesh>

      {/* 3. Surface Contraction Joints */}
      {jointPositions.map((posX, idx) => (
        <mesh
          key={idx}
          position={[posX, visualThickness + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.025, visualWidth * 0.98]} />
          <meshBasicMaterial color="#64748B" />
        </mesh>
      ))}

      {/* 4. LENGTH DIMENSION LINE (Front: along X-axis) */}
      <DimensionLine
        start={[-halfL, halfT, dimOffsetFront]}
        end={[halfL, halfT, dimOffsetFront]}
        label={lengthLabel}
        subtext="Length"
        extensionFromStart={[-halfL, halfT, halfW]}
        extensionFromEnd={[halfL, halfT, halfW]}
        labelOffset={[0, 0.35, 0]}
      />

      {/* 5. WIDTH DIMENSION LINE (Right: along Z-axis) */}
      <DimensionLine
        start={[dimOffsetSide, halfT, -halfW]}
        end={[dimOffsetSide, halfT, halfW]}
        label={widthLabel}
        subtext="Width"
        extensionFromStart={[halfL, halfT, -halfW]}
        extensionFromEnd={[halfL, halfT, halfW]}
        labelOffset={[0.35, 0.35, 0]}
      />

      {/* 6. THICKNESS DIMENSION LINE (Corner: along Y-axis) */}
      <DimensionLine
        start={[dimCornerX, 0, dimCornerZ]}
        end={[dimCornerX, visualThickness, dimCornerZ]}
        label={thicknessLabel}
        subtext="Thickness"
        extensionFromStart={[halfL, 0, halfW]}
        extensionFromEnd={[halfL, visualThickness, halfW]}
        labelOffset={[0.45, 0, 0]}
      />
    </group>
  );
};
