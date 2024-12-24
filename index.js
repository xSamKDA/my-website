import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const loader = new GLTFLoader();
let xenomorph;
loader.load('./xenomorph.glb',
    function (glb) {
        console.log(glb);
        xenomorph = glb.scene;
        xenomorph.scale.set(0.1, 0.1, 0.1);
        scene.add(xenomorph);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.error('An error occurred!', error);
    }
);

// Fix: Correct light declaration
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Set fixed canvas size
const sizes = {
    width: 800,  // Fixed width
    height: 600  // Fixed height
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Track the mouse position
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Function to update camera's look at position
function updateCamera() {
    // Always set the camera to look at the Xenomorph position (center of the scene)
    camera.lookAt(xenomorph.position);
}

function animate() {
    requestAnimationFrame(animate);

    // Update Xenomorph's rotation to follow the mouse
    if (xenomorph) {
        xenomorph.rotation.y = mouse.x * Math.PI; // Rotate around the Y-axis based on mouse x
        xenomorph.rotation.x = -mouse.y * Math.PI; // Rotate around the X-axis based on mouse y
    }

    updateCamera(); // Ensure the camera always looks at the center (Xenomorph)

    renderer.render(scene, camera);
}

animate();