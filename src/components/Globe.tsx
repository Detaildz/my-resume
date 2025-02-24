import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import NormalMap from '../static/textures/NormalMap.png';

const ThreeSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let mouseX = 0;
  let mouseY = 0;

  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const onDocumentMouseMove = (event: MouseEvent) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  };
  document.addEventListener('mousemove', onDocumentMouseMove);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(NormalMap);

    // Object
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Material
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 1.2;
    material.roughness = 0.5;
    material.normalMap = normalTexture;
    material.color = new THREE.Color(0xffffff);

    // Mesh
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const pointLight = new THREE.PointLight(0x0000ff, 1);
    pointLight.position.set(-1.6, 1.34, 0.17);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff0000, 1);
    pointLight2.position.set(2.58, -1.65, -0.15);
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(0xff0, 0.5);
    scene.add(ambientLight);

    // Helpers
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
    // scene.add(pointLightHelper);

    // const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
    // scene.add(pointLightHelper2);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 2.5;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // GUI controls
    const gui = new dat.GUI();
    const light1 = gui.addFolder('Light 1');
    light1.add(pointLight.position, 'x').min(-3).max(3).step(0.01);
    light1.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
    light1.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
    light1.add(pointLight, 'intensity').min(0).max(10).step(0.01);

    const light2 = gui.addFolder('Light 2');
    light2.add(pointLight2.position, 'x').min(-3).max(3).step(0.01);
    light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
    light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
    light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = 0.35 * elapsedTime;

      sphere.rotation.x += (targetX - sphere.rotation.x) * 0.05;
      sphere.rotation.y += (targetY - sphere.rotation.y) * 0.05;
      sphere.rotation.z += (targetY - sphere.rotation.x) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      gui.destroy(); // Destroy GUI on unmount
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default ThreeSphere;
