"use client";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CampusCore() {
  const group = useRef<THREE.Group>(null);
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Insert your new background style here */}
    </div>
  );
}

export default function CampusScene() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Insert your new background style here */}
    </div>
  );
}

