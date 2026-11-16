import { useEffect, useRef } from "react";
import * as THREE from "three";

function tubeBetween(group, a, b, radius, material, radialSegments = 12) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = new THREE.Vector3().subVectors(end, start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), radialSegments),
    material
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function makeBicycle(scene, paintColor) {
  const bike = new THREE.Group();
  scene.add(bike);
  const frame = new THREE.MeshStandardMaterial({ color: paintColor || "#1558d6", metalness: 0.48, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: "#151b25", metalness: 0.18, roughness: 0.7 });
  const rubber = new THREE.MeshStandardMaterial({ color: "#11151c", roughness: 0.92 });
  const alloy = new THREE.MeshStandardMaterial({ color: "#b9c5d3", metalness: 0.82, roughness: 0.24 });
  const accent = new THREE.MeshStandardMaterial({ color: "#e5edf8", metalness: 0.72, roughness: 0.3 });
  const hubMat = new THREE.MeshStandardMaterial({ color: "#66788d", metalness: 0.8, roughness: 0.25 });
  const rear = [-1.22, 0.66, 0], front = [1.22, 0.66, 0];
  const crank = [-0.18, 0.66, 0], seat = [-0.56, 1.66, 0], head = [0.72, 1.48, 0];
  const wheelRadius = 0.61;

  // Both wheels, rims, hubs and fine spokes.
  [rear, front].forEach(([x, y]) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(wheelRadius, 0.055, 14, 80), rubber);
    wheel.position.set(x, y, 0);
    wheel.castShadow = true;
    bike.add(wheel);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelRadius - 0.075, 0.018, 8, 80), alloy);
    rim.position.set(x, y, 0);
    bike.add(rim);
    [-0.045, 0.045].forEach(z => {
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const end = [x + Math.cos(angle) * (wheelRadius - 0.085), y + Math.sin(angle) * (wheelRadius - 0.085), z];
        tubeBetween(bike, [x, y, z], end, 0.0065, alloy, 5);
      }
    });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 20), hubMat);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, y, 0);
    bike.add(hub);
  });

  // Diamond frame and fork.
  tubeBetween(bike, rear, crank, 0.035, frame);
  tubeBetween(bike, crank, seat, 0.04, frame);
  tubeBetween(bike, seat, head, 0.04, frame);
  tubeBetween(bike, head, crank, 0.04, frame);
  tubeBetween(bike, rear, seat, 0.03, frame);
  tubeBetween(bike, head, front, 0.045, frame);
  tubeBetween(bike, head, [0.82, 1.7, 0], 0.065, dark);
  tubeBetween(bike, [0.82, 1.7, 0], [0.94, 1.76, 0], 0.035, alloy);
  tubeBetween(bike, [0.58, 1.78, 0], [1.16, 1.78, 0], 0.035, dark);
  tubeBetween(bike, seat, [-0.62, 1.93, 0], 0.055, dark);
  tubeBetween(bike, [-0.9, 1.94, 0], [-0.34, 1.94, 0], 0.09, dark);

  // Chainring, chain, crank arms and pedals.
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.014, 8, 48), alloy);
  ring.position.set(crank[0], crank[1], 0.07);
  bike.add(ring);
  tubeBetween(bike, [-1.22, 0.66, 0.09], [-0.18, 0.66, 0.09], 0.009, alloy, 6);
  tubeBetween(bike, [-1.22, 0.66, 0.09], [-0.18, 0.66, 0.09], 0.009, alloy, 6);
  tubeBetween(bike, crank, [-0.02, 0.45, 0.13], 0.025, dark);
  tubeBetween(bike, crank, [-0.34, 0.87, 0.13], 0.025, dark);
  tubeBetween(bike, [-0.12, 0.43, 0.13], [0.08, 0.43, 0.13], 0.035, dark);
  tubeBetween(bike, [-0.45, 0.88, 0.13], [-0.25, 0.88, 0.13], 0.035, dark);

  // Seat, grips, fenders-free clean showroom finish.
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.2), dark);
  saddle.position.set(-0.58, 2.02, 0);
  saddle.rotation.z = -0.04;
  bike.add(saddle);
  tubeBetween(bike, [0.88, 1.73, 0], [0.88, 1.91, 0], 0.025, alloy);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.028, 8, 28, Math.PI), dark);
  handle.rotation.z = Math.PI;
  handle.position.set(0.88, 1.91, 0);
  bike.add(handle);

  // Small frame details and reflectors.
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.018), accent);
  badge.position.set(0.16, 1.15, 0.045);
  badge.rotation.z = -0.42;
  bike.add(badge);
  const reflector = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), new THREE.MeshStandardMaterial({ color: "#f5a623", emissive: "#4b2600" }));
  reflector.position.set(1.22, 0.66, 0.1);
  bike.add(reflector);

  bike.position.y = -0.28;
  bike.rotation.y = -0.12;
  bike.scale.setScalar(0.98);
  return bike;
}

export default function Bicycle3D({ color = "#1558d6", className = "" }) {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer, frameId, observer, bike;
    let dragging = false, lastX = 0, lastY = 0, velocity = 0;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.05, 2.65, 6.4);
    camera.lookAt(0, 1.02, 0);
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      host.classList.add("three-unavailable");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.setAttribute("aria-label", "Interactive 3D bicycle. Drag to rotate.");
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight("#eaf2ff", "#34445b", 2.0));
    const key = new THREE.DirectionalLight("#ffffff", 3.2);
    key.position.set(-3, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rimLight = new THREE.DirectionalLight("#8fbaff", 2.1);
    rimLight.position.set(4, 2.5, -3);
    scene.add(rimLight);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(2.35, 64), new THREE.MeshBasicMaterial({ color: "#9bb5d6", transparent: true, opacity: 0.13 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.035;
    scene.add(floor);

    bike = makeBicycle(scene, color);
    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const down = event => { dragging = true; lastX = event.clientX; lastY = event.clientY; host.setPointerCapture?.(event.pointerId); };
    const move = event => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      bike.rotation.y += dx * 0.009;
      bike.rotation.x = THREE.MathUtils.clamp(bike.rotation.x + dy * 0.002, -0.13, 0.13);
      velocity = dx * 0.0005;
      lastX = event.clientX; lastY = event.clientY;
    };
    const up = () => { dragging = false; };
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", up);
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.04);
      if (!dragging) {
        bike.rotation.y += velocity || delta * 0.13;
        velocity *= 0.94;
        if (Math.abs(velocity) < 0.00008) velocity = 0;
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [color]);
  return <div className={`bicycle-3d ${className}`} ref={hostRef}>
    <span className="bicycle-3d-hint">DRAG TO ROTATE <span>↻</span></span>
  </div>;
}
