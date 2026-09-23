import React, { useMemo } from 'react';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface DimensionLabelProps {
  position: [number, number, number];
  text: string;
  subtext?: string;
  color?: string;
}

/**
 * DimensionLabel rendered via dynamic high-DPI Canvas texture in a Billboard.
 * This completely avoids Drei `<Html>` internal ReactDOM.createRoot / unmount conflicts
 * in React 19 ("Attempted to synchronously unmount a root while React was already rendering"),
 * while rendering crisp, hardware-accelerated anti-aliased CAD dimension tags.
 */
export const DimensionLabel: React.FC<DimensionLabelProps> = ({
  position,
  text,
  subtext,
  color = '#F59E0B',
}) => {
  const { texture, aspect } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { texture: null, aspect: 2 };

    // High-resolution canvas for crisp typography
    const width = 512;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    // Background pill/badge
    ctx.clearRect(0, 0, width, height);

    const padX = 16;
    const padY = 16;
    const boxW = width - padX * 2;
    const boxH = height - padY * 2;
    const radius = 24;

    // Draw rounded container box
    ctx.beginPath();
    ctx.roundRect(padX, padY, boxW, boxH, radius);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fill();

    // Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Main primary dimension text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 52px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.fillStyle = color;
    
    if (subtext) {
      ctx.fillText(text, width / 2, height / 2 - 16);
      ctx.font = '600 32px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(subtext, width / 2, height / 2 + 34);
    } else {
      ctx.fillText(text, width / 2, height / 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    return { texture: tex, aspect: width / height };
  }, [text, subtext, color]);

  if (!texture) return null;

  // Visual size in Three.js world coordinates
  const planeHeight = 0.55;
  const planeWidth = planeHeight * aspect;

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial map={texture} transparent opacity={0.96} depthTest={false} />
      </mesh>
    </Billboard>
  );
};
