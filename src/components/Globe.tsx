import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import NormalMap from '../static/textures/NormalMap.png';

// Loading

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load(NormalMap);

// Debug
const gui = new dat.GUI();

const settings = {
  color: '0xffffff',
  spinSpeed: 0.5,
};
gui.add(settings, 'color').onChange((value) => {
  console.log('Color changed to:', value);
});

const ThreeSphere: React.FC = () => {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Materials
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 1;
    material.roughness = 0.5;
    material.normalMap = normalTexture;
    material.color = new THREE.Color(settings.color);

    // Mesh
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xff0, 0.5);
    scene.add(ambientLight);

    // Sizes

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    // Base Camera

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    camera.position.z = 2;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      alpha: true, // Transparent background
    });
    renderer.setClearColor(0x000000, 0);

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // Update renderer
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = 0.5 * elapsedTime;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default ThreeSphere;
