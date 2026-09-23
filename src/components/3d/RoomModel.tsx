import React, { useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { DimensionLine } from './DimensionLine';
import { formatNumber } from '../../lib/calculators/common/math';

export interface RoomModelProps {
  length: number; // room length (ft or m)
  width: number;  // room width (ft or m)
  height: number; // room ceiling height (ft or m)
  unit?: 'imperial' | 'metric';
  coats?: number;
  doorsCount?: number;
  windowsCount?: number;
}

export const RoomModel: React.FC<RoomModelProps> = ({
  length,
  width,
  height,
  unit = 'imperial',
  coats = 2,
  doorsCount = 1,
  windowsCount = 2,
}) => {
  const isMetric = unit === 'metric';

  const { visualLength, visualWidth, visualHeight } = useMemo(() => {
    const safeL = Math.max(1, isNaN(length) ? 14 : length);
    const safeW = Math.max(1, isNaN(width) ? 12 : width);
    const safeH = Math.max(1, isNaN(height) ? 9 : height);

    // Normalize max footprint span to ~4.5 viewport units
    const maxSpan = Math.max(safeL, safeW);
    const scale = Math.min(4.5 / maxSpan, 0.35);

    const vL = Math.max(1.8, safeL * scale);
    const vW = Math.max(1.5, safeW * scale);
    const vH = Math.max(1.2, Math.min(3.2, safeH * scale * 1.25));

    return { visualLength: vL, visualWidth: vW, visualHeight: vH };
  }, [length, width, height]);

  const halfL = visualLength / 2;
  const halfW = visualWidth / 2;
  const halfH = visualHeight / 2;
  const wallThick = 0.12;

  // Architectural finish: 1 coat = primer/primer coat, 2 coats = solid satin, 3+ coats = deep pigment
  const paintColor = coats === 1 ? '#94A3B8' : coats === 2 ? '#38BDF8' : '#0284C7';

  const lengthLabel = `${formatNumber(length)} ${isMetric ? 'm' : 'ft'}`;
  const widthLabel = `${formatNumber(width)} ${isMetric ? 'm' : 'ft'}`;
  const heightLabel = `${formatNumber(height)} ${isMetric ? 'm' : 'ft'}`;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Floor Slab / Subfloor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[visualLength + wallThick * 2, 0.1, visualWidth + wallThick * 2]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
        <Edges color="#1E293B" threshold={15} />
      </mesh>

      {/* 2. Back Wall (Along X-axis at -halfW) */}
      <mesh position={[0, halfH, -halfW]} castShadow receiveShadow>
        <boxGeometry args={[visualLength, visualHeight, wallThick]} />
        <meshStandardMaterial color={paintColor} roughness={0.72} metalness={0.05} />
        <Edges color="#0F172A" threshold={15} />
      </mesh>

      {/* 3. Left Wall (Along Z-axis at -halfL) */}
      <mesh position={[-halfL, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThick, visualHeight, visualWidth]} />
        <meshStandardMaterial color={paintColor} roughness={0.72} metalness={0.05} />
        <Edges color="#0F172A" threshold={15} />
      </mesh>

      {/* 4. Right Wall (Along Z-axis at halfL) */}
      <mesh position={[halfL, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThick, visualHeight, visualWidth]} />
        <meshStandardMaterial color={paintColor} roughness={0.72} metalness={0.05} />
        <Edges color="#0F172A" threshold={15} />
      </mesh>

      {/* 5. Window Opening Frame on Left Wall */}
      {windowsCount > 0 && (
        <mesh position={[-halfL + 0.02, halfH * 1.1, 0]}>
          <boxGeometry args={[0.04, visualHeight * 0.42, visualWidth * 0.35]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} />
          <Edges color="#38BDF8" threshold={15} />
        </mesh>
      )}

      {/* 6. Door Opening Frame on Back Wall */}
      {doorsCount > 0 && (
        <mesh position={[0, visualHeight * 0.38, -halfW + 0.02]}>
          <boxGeometry args={[visualLength * 0.22, visualHeight * 0.76, 0.04]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
          <Edges color="#F59E0B" threshold={15} />
        </mesh>
      )}

      {/* 7. Length Dimension Line (Across floor front) */}
      <DimensionLine
        start={[-halfL, 0.1, halfW + 0.55]}
        end={[halfL, 0.1, halfW + 0.55]}
        label={lengthLabel}
        subtext="Length"
        labelOffset={[0, 0.25, 0]}
      />

      {/* 8. Width Dimension Line (Side floor) */}
      <DimensionLine
        start={[halfL + 0.55, 0.1, -halfW]}
        end={[halfL + 0.55, 0.1, halfW]}
        label={widthLabel}
        subtext="Width"
        labelOffset={[0.35, 0.25, 0]}
      />

      {/* 9. Height Dimension Line (Corner vertical) */}
      <DimensionLine
        start={[-halfL - 0.45, 0, halfW]}
        end={[-halfL - 0.45, visualHeight, halfW]}
        label={heightLabel}
        subtext="Ceiling Height"
        labelOffset={[-0.45, 0, 0]}
      />
    </group>
  );
};
