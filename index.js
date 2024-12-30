import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const loader = new GLTFLoader();
let fordGT;

loader.load('./fordGT.glb',
    function (glb) {
        console.log(glb);
        fordGT = glb.scene;
        fordGT.scale.set(8, 8, 8);
        scene.add(fordGT);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.error('An error occurred!', error);
    }
);

// Add a background texture
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('./background.jpg'); // Path to your image file
scene.background = backgroundTexture;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft ambient light
scene.add(ambientLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Initial camera position
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 1, 50);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

// Variables for rotation
const radius = 25;  // Distance from the dog (radius of the circle)
let angle = 5;      // Angle for rotation (starting from 0 degrees)
const rotationSpeed = 0.005;  // Speed of rotation in radians per frame

// Position of the dog (which we will use as the center of rotation)
const carPosition = new THREE.Vector3(0, -5, 0);

window.addEventListener('resize', () => {
    sizes.width = canvas.parentElement.offsetWidth;
    sizes.height = canvas.parentElement.offsetHeight;
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);

    // Increment the angle for rotation
    angle += rotationSpeed;

    // Update the camera position to rotate around the dog
    camera.position.x = carPosition.x + radius * Math.cos(angle);
    camera.position.y = 10;
    camera.position.z = carPosition.z + radius * Math.sin(angle);

    // Look at the dog to keep it centered
    camera.lookAt(carPosition);

    renderer.render(scene, camera);
}

animate();