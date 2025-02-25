import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import NormalMap from '../static/textures/NormalMap.png';

const ThreeSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  let isMouseDown = false;
  let lastRotationX = 0;
  let lastRotationY = 0;
  let prevMouseX = 0;
  let prevMouseY = 0;

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
    sphere.rotation.x = Math.PI / 2;
    sphere.rotation.y = Math.PI / 4;
    scene.add(sphere);

    // Marks
    const markGeometry = new THREE.SphereGeometry(0.05, 8, 8);

    const marks: { position: THREE.Vector3; info: string; color: number }[] = [
      {
        position: new THREE.Vector3(-0.7, 0.7, -0.2),
        info: 'Contacts',
        color: 0xff0000,
      },
      {
        position: new THREE.Vector3(0.1, 0.5, -0.9),
        info: 'Experience',
        color: 0x0000ff,
      },
      {
        position: new THREE.Vector3(0.9, 0.4, -0.4),
        info: 'Skills',
        color: 0x00ff00,
      },
      {
        position: new THREE.Vector3(0.9, 0.3, -0.4),
        info: 'About',
        color: 0x00fff0,
      },
    ];

    const markMeshes = marks.map((mark) => {
      const markMaterial = new THREE.MeshBasicMaterial({ color: mark.color });
      const markMesh = new THREE.Mesh(markGeometry, markMaterial);
      markMesh.position.copy(mark.position);
      sphere.add(markMesh);
      return {
        mesh: markMesh,
        info: mark.info,
        position: mark.position,
        color: mark.color,
      };
    });

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
    const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
    camera.position.set(0, 0, 3);
    camera.lookAt(sphere.position);
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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([
        ...markMeshes.map((mark) => mark.mesh),
        sphere,
      ]);

      if (intersects.length > 0) {
        const clickedMark = intersects[0].object;
        const mark = markMeshes.find((m) => m.mesh === clickedMark);
        if (mark) {
          setSelectedPoint(mark.info);
        }

        if (!isMouseDown) {
          lastRotationX = sphere.rotation.x;
          lastRotationY = sphere.rotation.y;
        }
        isMouseDown = true;
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      lastRotationX = sphere.rotation.x;
      lastRotationY = sphere.rotation.y;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        const deltaX = (event.clientX - prevMouseX) * 0.005;
        const deltaY = (event.clientY - prevMouseY) * 0.005;

        sphere.rotation.y = lastRotationY + deltaX;
        sphere.rotation.x = lastRotationX + deltaY;
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

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

    const marksFolder = gui.addFolder('Marks Positions');

    markMeshes.forEach((mark) => {
      const markFolder = marksFolder.addFolder(`Mark ${mark.info}`);
      markFolder
        .add(mark.position, 'x', -3, 5, 0.1)
        .name('Position X')
        .onChange(() => mark.mesh.position.copy(mark.position));
      markFolder
        .add(mark.position, 'y', -3, 5, 0.1)
        .name('Position Y')
        .onChange(() => mark.mesh.position.copy(mark.position));
      markFolder
        .add(mark.position, 'z', -3, 5, 0.1)
        .name('Position Z')
        .onChange(() => mark.mesh.position.copy(mark.position));
    });
    // Animation

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
      gui.destroy(); // Destroy GUI on unmount
    };
  }, []);

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
