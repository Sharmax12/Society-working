"use client";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CampusCore() {
  const group = useRef<THREE.Group>(null);
  return <group ref={group}>
    <mesh position={[0,-0.5,0]}><cylinderGeometry args={[2.7,3.1,.4,48]}/><meshStandardMaterial color="#17171f" metalness={.75} roughness={.28}/></mesh>
    {[-1.35,0,1.35].map((x,i)=><Float key={i} speed={1.2} rotationIntensity={.15} floatIntensity={.35}><mesh position={[x,.45,i===1?.15:0]}><boxGeometry args={[1.05,1.7+i*.2,.8]}/><meshStandardMaterial color={i===1?"#e5484d":"#292932"} metalness={.5} roughness={.3}/></mesh></Float>)}
  </group>;
}

export default function CampusScene() {
  return <div className="absolute inset-0 pointer-events-none opacity-80"><Canvas camera={{position:[0,1.2,6],fov:42}} dpr={[1,1.5]}><ambientLight intensity={1.3}/><directionalLight position={[4,6,4]} intensity={3}/><pointLight position={[-4,2,3]} intensity={7} color="#e5484d"/><CampusCore/><Sparkles count={80} scale={[8,5,6]} size={1.3} speed={.25}/><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.25}/></Canvas></div>;
}
