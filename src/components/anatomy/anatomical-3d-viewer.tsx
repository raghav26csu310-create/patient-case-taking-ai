"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Anatomical3DViewerProps {
  activeRegionName?: string;
  severityScale?: number;
  className?: string;
}

export function Anatomical3DViewer({
  activeRegionName = "Thorax / Retrosternal",
  severityScale = 7,
  className,
}: Anatomical3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // Three.js Scene Setup
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Anatomical Spatial Hologram Group
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const head = new THREE.Mesh(headGeo, wireframeMat);
    head.position.y = 2.4;
    mannequinGroup.add(head);

    // Torso / Chest
    const torsoGeo = new THREE.CylinderGeometry(0.7, 0.55, 1.8, 16, 8, true);
    const torso = new THREE.Mesh(torsoGeo, wireframeMat);
    torso.position.y = 1.1;
    mannequinGroup.add(torso);

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.7, 16, 6, true);
    const pelvis = new THREE.Mesh(pelvisGeo, wireframeMat);
    pelvis.position.y = -0.15;
    mannequinGroup.add(pelvis);

    // Limbs (Arms & Legs as wireframe cylinders)
    const limbMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.25 });

    // Left Arm
    const leftArmGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.6, 8);
    const leftArm = new THREE.Mesh(leftArmGeo, limbMat);
    leftArm.position.set(1.1, 1.0, 0);
    leftArm.rotation.z = -0.15;
    mannequinGroup.add(leftArm);

    // Right Arm
    const rightArmGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.6, 8);
    const rightArm = new THREE.Mesh(rightArmGeo, limbMat);
    rightArm.position.set(-1.1, 1.0, 0);
    rightArm.rotation.z = 0.15;
    mannequinGroup.add(rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.24, 0.18, 2.2, 8);
    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(0.4, -1.6, 0);
    mannequinGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(-0.4, -1.6, 0);
    mannequinGroup.add(rightLeg);

    // Active Region Glowing Pulse Marker (e.g. Chest / Retrosternal)
    const markerGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({
      color: severityScale >= 7 ? 0xef4444 : 0x0284c7,
      transparent: true,
      opacity: 0.85,
    });
    const pulseMarker = new THREE.Mesh(markerGeo, markerMat);
    pulseMarker.position.set(0, 1.3, 0.45); // Retrosternal chest position
    mannequinGroup.add(pulseMarker);

    // Subtle Particle Cloud (Ambient Clinical Data Ring)
    const particleCount = 120;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.8;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating) {
        mannequinGroup.rotation.y += 0.008;
        particleSystem.rotation.y -= 0.004;
      }

      // Pulse active region marker
      const time = Date.now() * 0.004;
      const scale = 1 + Math.sin(time) * 0.2;
      pulseMarker.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating, severityScale]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden min-h-[420px]",
        className
      )}
    >
      {/* Top Overlay Bar */}
      <div className="flex items-center justify-between w-full z-10">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            3D SPATIAL ANATOMY
          </Badge>
          <Badge variant={severityScale >= 7 ? "danger" : "primary"} size="sm">
            {activeRegionName}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsRotating((r) => !r)}
          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          className="h-7 text-xs"
        >
          {isRotating ? "Pause 3D" : "Auto-Rotate"}
        </Button>
      </div>

      {/* WebGL 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-[320px] flex items-center justify-center my-auto cursor-grab active:cursor-grabbing" />

      {/* Fallback Notice if WebGL is disabled */}
      {!webglSupported && (
        <div className="p-4 rounded-xl bg-[var(--muted)] text-center text-xs text-[var(--muted-foreground)]">
          3D WebGL acceleration is unavailable on this device. Displaying 2D clinical mapping coordinates.
        </div>
      )}

      {/* Bottom Legal Clinical Notice */}
      <div className="flex items-center justify-between w-full pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--muted-foreground)] z-10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Patient Orientation Only • Non-Diagnostic</span>
        </div>
        <span className="font-mono">Severity: {severityScale}/10</span>
      </div>
    </div>
  );
}
