"use client";

import { Environment, Float, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LOGO_BARS, LOGO_VIEWBOX } from "@/lib/brand";
import { heroState } from "@/lib/heroState";

/** Convert the LogoMark SVG paths into centred THREE shapes (y flipped). */
function useBarShapes() {
  return useMemo(() => {
    const cx = LOGO_VIEWBOX.width / 2;
    const cy = LOGO_VIEWBOX.height / 2;
    const scale = 1 / 110;
    return LOGO_BARS.map((d) => {
      const points = [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map(
        ([, x, y]) => new THREE.Vector2((Number(x) - cx) * scale, -(Number(y) - cy) * scale),
      );
      return new THREE.Shape(points);
    });
  }, []);
}

const BAR_COLORS = ["#6D28D9", "#8B5CF6", "#A855F7"];

function LogoBars() {
  const shapes = useBarShapes();
  const group = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(
    () =>
      shapes.map((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.55,
          bevelEnabled: true,
          bevelThickness: 0.06,
          bevelSize: 0.04,
          bevelSegments: 4,
        });
        geo.center();
        return geo;
      }),
    [shapes],
  );

  // Bar centres in the original layout (so we can re-centre after geo.center()).
  const offsets = useMemo(
    () =>
      shapes.map((shape) => {
        const box = new THREE.Box2().setFromPoints(shape.getPoints());
        return box.getCenter(new THREE.Vector2());
      }),
    [shapes],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = heroState.scroll;
    // Mouse parallax + slow idle rotation.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.45 - 0.35, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.25 + 0.12, 3, delta);
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;

    // Scroll: bars drift apart in depth and sideways.
    bars.current.forEach((mesh, i) => {
      if (!mesh) return;
      const o = offsets[i]!;
      const spread = (i - 1) * p;
      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, o.x + spread * 1.6, 6, delta);
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, o.y + p * (i % 2 ? 0.8 : -0.4), 6, delta);
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, spread * -2.2, 6, delta);
      mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, spread * 0.35, 6, delta);
    });
  });

  return (
    <group ref={group} scale={0.82}>
      {geometries.map((geo, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bars.current[i] = m;
          }}
          geometry={geo}
          position={[offsets[i]!.x, offsets[i]!.y, 0]}
        >
          <meshPhysicalMaterial
            color={BAR_COLORS[i]}
            emissive="#4C1D95"
            emissiveIntensity={0.35}
            metalness={0.35}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.4}
            iridescenceIOR={1.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Angular glass "skyscraper" prisms behind the mark. */
function Prisms() {
  const ref = useRef<THREE.Group>(null);
  const prisms = useMemo(
    () => [
      { pos: [-2.4, -0.8, -3], h: 4.5, w: 0.45 },
      { pos: [-0.9, 0.6, -4.5], h: 6, w: 0.6 },
      { pos: [1.5, -0.4, -3.6], h: 5, w: 0.5 },
      { pos: [2.8, 0.9, -5], h: 6.5, w: 0.7 },
    ],
    [],
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, state.pointer.x * -0.35, 2, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, heroState.scroll * 1.5, 4, delta);
  });

  return (
    <group ref={ref} rotation={[0, 0, -0.66]}>
      {prisms.map((p, i) => (
        <mesh key={i} position={p.pos as [number, number, number]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0, p.w, p.h, 4, 1]} />
          <meshPhysicalMaterial
            color="#2E1065"
            emissive="#5B21B6"
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={0.35}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene({ active = true, onReady }: { active?: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} color="#E9D5FF" />
      <pointLight position={[-4, -2, 3]} intensity={12} color="#7C3AED" />

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <LogoBars />
      </Float>
      <Prisms />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} color="#C084FC" position={[3, 3, 4]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#7C3AED" position={[-4, -1, 3]} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#F5F3FF" position={[0, 4, -2]} scale={2} />
      </Environment>

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.25} intensity={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
