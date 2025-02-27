import { useLoader } from '@react-three/fiber';
import * as dat from 'dat.gui';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import NormalMap from '../assets/images/mercury.jpg';
import AstronautModel from '../assets/models/astronaut.glb';
import AstronautTexture from '../static/textures/astronaut-texture.png';

interface AstronautMesh {
  astronaut: THREE.Object3D;
  info: string;
  position: THREE.Vector3;
}

const ThreeSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  let isMouseDown = false;
  let lastRotationY = 0;
  let prevMouseX = 0;

  // Load astronaut model once
  const astronaut = useLoader(GLTFLoader, AstronautModel);

  const radius = 1.1;

  const astronautModels = [
    { latitude: 45, longitude: 20, info: 'Contacts' },
    { latitude: -45, longitude: 90, info: 'Experience' },
    { latitude: 30, longitude: -20, info: 'Skills' },
    { latitude: -30, longitude: 135, info: 'About' },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load(NormalMap);
    const astronautTexture = textureLoader.load(
      AstronautTexture,
      () => {
        astronaut.scene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.MeshBasicMaterial) {
              child.material.map = astronautTexture;

              child.material.needsUpdate = true;
            }
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
    // Sphere Object
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: normalTexture,
      })
    );
    sphere.rotation.y = Math.PI / 4;
    scene.add(sphere);

    // Astronaut Marks
    const astronautMeshes: AstronautMesh[] = [];
    // const astronautModels = [
    //   { position: new THREE.Vector3(-0.7, 0.7, -0.2), info: 'Contacts' },
    //   { position: new THREE.Vector3(-0.9, -0.4, 0.3), info: 'Experience' },
    //   { position: new THREE.Vector3(0.1, 0.2, 1), info: 'Skills' },
    //   { position: new THREE.Vector3(0.9, 0.5, 0.1), info: 'About' },
    // ];

    astronautModels.forEach((mark) => {
      const modelClone = astronaut.scene.clone();

      const latitude = mark.latitude * (Math.PI / 180);
      const longitude = mark.longitude * (Math.PI / 180);

      const x = radius * Math.cos(latitude) * Math.cos(longitude);
      const y = radius * Math.sin(latitude);
      const z = radius * Math.cos(latitude) * Math.sin(longitude);

      modelClone.position.set(x, y, z);

      modelClone.lookAt(new THREE.Vector3(0, 10, 0));
      modelClone.scale.set(0.25, 0.25, 0.25);

      modelClone.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material = new THREE.MeshStandardMaterial({
              map: child.material.map || null,
              color: 0xffffff,
            });
          }
        }
      });

      sphere.add(modelClone); // Add to the main sphere
    });

    // Lights

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0000ff, 1);
    pointLight1.position.set(2, 1.34, 0.17);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0000, 1);
    pointLight2.position.set(2.58, -1.65, -0.15);
    scene.add(pointLight2);

    // Camera
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
    camera.position.set(0, 0, 3);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize Handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        astronautMeshes.map((mesh) => mesh.astronaut)
      );

      if (intersects.length > 0) {
        const clickedAstronaut = intersects[0].object;
        const astronautMesh = astronautMeshes.find(
          (m) => m.astronaut === clickedAstronaut
        );
        if (astronautMesh) {
          setSelectedPoint(astronautMesh.info);
        }
      }

      isMouseDown = true;
      prevMouseX = event.clientX;
      lastRotationY = sphere.rotation.y;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        const deltaX = (prevMouseX - event.clientX) * 0.005;
        sphere.rotation.y = lastRotationY + deltaX;
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    // GUI Controls
    const gui = new dat.GUI();
    const lightFolder = gui.addFolder('Lights');
    lightFolder.add(pointLight1, 'intensity', 0, 10);
    lightFolder.add(pointLight2, 'intensity', 0, 10);

    // Animation Loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);

      renderer.dispose();
      gui.destroy();
    };
  }, [astronaut]);

  return (
    <div>
      <canvas ref={canvasRef} className="webgl" />
      {selectedPoint && (
        <div>
          <h2>Details</h2>
          <p>{selectedPoint}</p>
        </div>
      )}
    </div>
  );
};

export default ThreeSphere;
