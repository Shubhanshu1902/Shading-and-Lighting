import * as THREE from "three";
import "./style.css";
import { GUI } from "dat.gui";
import { v1 } from "./vertexShader";
import { v1f, v2f } from "./fragmentShader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Creating scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e2e2e);

// Window Sizes
const constants = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Renderer
const canvas = document.querySelector(".webgl");
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(constants.width, constants.height);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.render(scene, camera);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    constants.width / constants.height,
    0.1,
    100
);
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(0, 2, 6)
scene.add(camera);

let vals = {
    Object: "Cylinder",
    Mapping: "Cylindrical",
};

let t1 = new THREE.TextureLoader().load('./uv_mapper.jpg')

let uniforms = {
    t1: {value: t1}
};

function addObjects(mapping){
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeo = new THREE.SphereGeometry(1);
    const CylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 1);

    let fshader = v1f;
    if (mapping === "Cylindrical") {
        fshader = v2f;
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: v1,
        fragmentShader: fshader,
    });

    const cube = new THREE.Mesh(cubeGeo, material);
    cube.position.set(0, 0.5, 0)
    const sphere = new THREE.Mesh(sphereGeo, material);
    sphere.position.set(-2, 0.5, 0);
    const cylinder = new THREE.Mesh(CylinderGeo, material);
    cylinder.position.set(2, 0.5, 0)

    return [cube, sphere, cylinder]
}
var meshes = addObjects(vals.Mapping)
for(let mesh of meshes)
    scene.add(mesh);

const gui = new GUI();
const f1 = gui.addFolder("Texture Mapping");


f1.add(vals, "Mapping", ["Spherical", "Cylindrical"]).onChange(() => {
    for(let mesh of meshes)
        scene.remove(mesh);
    meshes = addObjects(vals.Mapping);
    for(let mesh of meshes)
        scene.add(mesh);
});


// Animation
const loop = () => {
    controls.update()
    // mesh.rotation.x += 0.005;
    // mesh.rotation.z += 0.005;
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();
