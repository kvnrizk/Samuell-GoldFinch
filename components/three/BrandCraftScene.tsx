'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// Self-hosted decoder (public/draco/) — no third-party CDN, CSP-safe.
useGLTF.setDecoderPath('/draco/');

const MODELS = {
  clapperboard: '/models/blaze-clapperboard.glb',
} as const;

Object.values(MODELS).forEach((url) => useGLTF.preload(url));

// Sketchfab files use inconsistent units and off-origin pivots — measure each
// at runtime, normalize to a target size, recenter on its own origin.
function useFit(object: THREE.Object3D, targetSize: number) {
  return useMemo(() => {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { scale: targetSize / maxDim, center };
  }, [object, targetSize]);
}

function useEnvBoost(object: THREE.Object3D, intensity: number) {
  useEffect(() => {
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && 'envMapIntensity' in mat) {
        mat.envMapIntensity = intensity;
        mat.needsUpdate = true;
      }
    });
  }, [object, intensity]);
}

function Fitted({ object, target }: { object: THREE.Object3D; target: number }) {
  const { scale, center } = useFit(object, target);
  return (
    <group scale={scale}>
      <primitive object={object} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

/* ── Hub rotation synced to the orbiting cards ─────────────────────────
   Active-card change → hub turns one notch with the ring (shortest path),
   plus pointer parallax and a soft scale-in on mount. */
function SyncSpin({
  activeIndex,
  itemCount,
  reducedMotion,
  children,
}: {
  activeIndex: number;
  itemCount: number;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const targetRef = useRef(0);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const n = Math.max(itemCount, 1);
    let diff = activeIndex - prevIndexRef.current;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    targetRef.current += diff * ((Math.PI * 2) / n);
    prevIndexRef.current = activeIndex;
  }, [activeIndex, itemCount]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRef.current, 0.055);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, 1, 0.045));
    if (!reducedMotion) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.07, 0.05);
    }
  });

  return (
    <group ref={group} scale={0.82}>
      {children}
    </group>
  );
}

/* ── Blaze hub: clapperboard (scroll-scrubbed open/close) ─────────────── */

function Clapperboard({
  scrollProgressRef,
  reducedMotion,
}: {
  scrollProgressRef: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODELS.clapperboard);
  const { actions } = useAnimations(animations, group);
  useEnvBoost(scene, 0.7);

  useEffect(() => {
    const action = actions.Action;
    if (!action) return;
    action.reset().play();
    action.paused = true;
    action.time = reducedMotion ? action.getClip().duration * 0.5 : 0;
  }, [actions, reducedMotion]);

  useFrame(() => {
    if (reducedMotion) return;
    const action = actions.Action;
    if (!action) return;
    action.time = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1) * action.getClip().duration;
  });

  return (
    <group ref={group}>
      <Fitted object={scene} target={1.35} />
    </group>
  );
}

/* ── Kolasi hub: procedural mirror-ball ─────────────────────────────────
   The source GLB disco ball is a smooth 192-tri sphere — it can't sparkle.
   This is a faceted icosphere with a chrome, flat-shaded material: each of
   the ~1,280 facets reflects the HDRI at its own angle, and bloom lights the
   bright hits — a real disco-ball glint, zero asset weight. */
function DiscoBall({ reducedMotion }: { reducedMotion: boolean }) {
  const spinner = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 3), []);

  useFrame((_, delta) => {
    if (spinner.current && !reducedMotion) spinner.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={spinner}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#e6ecf5" metalness={1} roughness={0.14} flatShading envMapIntensity={2.4} />
      </mesh>
    </group>
  );
}

interface BrandCraftSceneProps {
  brand: 'blaze' | 'kolasi';
  scrollProgressRef: MutableRefObject<number>;
  activeIndex: number;
  itemCount: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

export default function BrandCraftScene({
  brand,
  scrollProgressRef,
  activeIndex,
  itemCount,
  reducedMotion,
  isMobile,
}: BrandCraftSceneProps) {
  const isBlaze = brand === 'blaze';

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 0.95 }}
      camera={{ position: [0, 0.25, 5.2], fov: 35 }}
    >
      <color attach="background" args={['#0a0a0c']} />
      <fog attach="fog" args={['#0a0a0c', 6.5, 13]} />

      <ambientLight intensity={0.16} />
      {isBlaze ? (
        <>
          {/* Warm converging key/rim onto the clapperboard (no visible lamps). */}
          <spotLight position={[-2.2, 2.4, 3]} angle={0.5} penumbra={0.85} intensity={9} color="#ffe6c0" distance={16} decay={2} />
          <spotLight position={[2.4, 1.8, -1]} angle={0.6} penumbra={0.9} intensity={4} color="#c8a96e" distance={16} decay={2} />
        </>
      ) : (
        <>
          <spotLight position={[-2.5, 3, 3]} angle={0.5} penumbra={0.85} intensity={7} color="#ffe6c0" distance={16} decay={2} />
          <spotLight position={[2.5, 2, -1.5]} angle={0.6} penumbra={0.9} intensity={4} color="#9fb4e0" distance={16} decay={2} />
          <pointLight position={[0, 1.6, 2]} intensity={5} color="#cfe0ff" distance={6} decay={2} />
        </>
      )}

      {/* Real HDRI for premium reflections (self-hosted, dim so it doesn't wash out). */}
      <Environment files="/hdri/studio.hdr" environmentIntensity={0.5} />

      <Float speed={1.2} rotationIntensity={0} floatIntensity={isBlaze ? 0.25 : 0.4}>
        <SyncSpin activeIndex={activeIndex} itemCount={itemCount} reducedMotion={reducedMotion}>
          <group position={[0, 0.05, -0.4]}>
            {isBlaze ? (
              <Clapperboard scrollProgressRef={scrollProgressRef} reducedMotion={reducedMotion} />
            ) : (
              <DiscoBall reducedMotion={reducedMotion} />
            )}
          </group>
        </SyncSpin>
      </Float>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={7} blur={2.8} far={2.4} color="#000000" />

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.62} luminanceSmoothing={0.3} />
        <Vignette offset={0.32} darkness={0.62} />
      </EffectComposer>
    </Canvas>
  );
}
