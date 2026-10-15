"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export function SpatialLandingCanvas({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsSupported(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Clinical Neural Data Lattice (Nodes & Connecting Lines)
    const nodeCount = 45;
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const positions: THREE.Vector3[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const redFlagMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12
      );
      positions.push(pos);

      // Make 3 nodes glowing red for red flag clinical alerts
      const mesh = new THREE.Mesh(sphereGeo, i < 3 ? redFlagMat : nodeMat);
      mesh.position.copy(pos);
      nodesGroup.add(mesh);
    }

    // Connect close nodes with lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (positions[i].distanceTo(positions[j]) < 7) {
          linePoints.push(positions[i], positions[j]);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(lineMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      nodesGroup.rotation.y += 0.003;
      nodesGroup.rotation.x += 0.0015;

      // Subtle mouse parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 350;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center p-6 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--surface)] to-[var(--primary)]/5 rounded-3xl", className)}>
        <span className="text-xs font-mono text-[var(--muted-foreground)]">
          Clinical Evidence Network Active (2D Accelerated Mode)
        </span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={cn("w-full h-full min-h-[300px] pointer-events-none select-none relative overflow-hidden", className)}
      aria-hidden="true"
    />
  );
}
