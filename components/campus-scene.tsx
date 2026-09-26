// Note: this is intentionally a plain, dependency-free component. It used
// to import three.js/@react-three/fiber/@react-three/drei at module scope
// while only ever rendering an empty div, which meant the homepage shipped
// a large unused 3D library in its client bundle. Removed for bundle size;
// the rendered output (an empty positioned div) is unchanged. If a real
// scene is added here later, re-import what's actually used.
export default function CampusScene() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Insert your new background style here */}
    </div>
  );
}

