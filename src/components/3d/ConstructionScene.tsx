import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RotateCcw, Eye } from 'lucide-react';
import { useLocale } from '../../lib/i18n/context';

interface ConstructionSceneProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  title?: string;
  className?: string;
  showGrid?: boolean;
}

export const ConstructionScene: React.FC<ConstructionSceneProps> = ({
  children,
  cameraPosition = [7, 5.5, 8],
  title,
  className = '',
  showGrid = true,
}) => {
  const { t } = useLocale();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const sceneTitle = title ?? t('scene.interactiveModel');

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      className={`relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-tech-lg overflow-hidden bg-gradient-to-b from-paper-100 to-paper-200 dark:from-charcoal-900 dark:to-charcoal-950 border border-paper-300 dark:border-charcoal-750 shadow-tech-card select-none ${className}`}
    >
      {/* 2D HUD Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-xs border border-paper-300 dark:border-charcoal-700 shadow-tech-subtle pointer-events-auto">
          <Eye className="w-3.5 h-3.5 text-accent" />
          <span className="text-micro font-mono uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {sceneTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetCamera}
          title={t('scene.resetCamera')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/90 dark:bg-charcoal-900/90 hover:bg-white dark:hover:bg-charcoal-800 backdrop-blur-xs border border-paper-300 dark:border-charcoal-700 shadow-tech-subtle text-micro font-medium text-slate-700 dark:text-slate-300 hover:text-accent transition-colors pointer-events-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('scene.resetView')}</span>
        </button>
      </div>

      {/* 2D HUD Helper Footer */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between pointer-events-none text-micro font-mono text-slate-400 dark:text-slate-500">
        <span>{t('scene.orbitHint')}</span>
        <span>{t('scene.zoomHint')}</span>
      </div>

      {/* Canvas Scene */}
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {/* Subtle Architectural Studio Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={30}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          <directionalLight position={[-6, 6, -6]} intensity={0.4} color="#94A3B8" />

          {/* Construction Drafting Grid Floor */}
          {showGrid && (
            <Grid
              position={[0, -0.07, 0]}
              args={[24, 24]}
              cellSize={0.5}
              cellThickness={0.6}
              cellColor="#94A3B8"
              sectionSize={2.5}
              sectionThickness={1.2}
              sectionColor="#64748B"
              fadeDistance={20}
              fadeStrength={1.5}
            />
          )}

          {/* Child Construction Mesh Primitives */}
          {children}

          {/* Camera Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={Math.PI / 2.05} // Prevent camera going below ground
            minDistance={3.5}
            maxDistance={22}
            target={[0, 0.4, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
