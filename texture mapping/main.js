import * as THREE from "three";
import "./style.css";
import { GUI } from "dat.gui";
import { v1 } from "./vertexShader";
import { v1f, v2f } from "./fragmentShader";

// Creating scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e2e2e);

// Window Sizes
const constants = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    constants.width / constants.height,
    0.1,
    100
);
camera.position.z = 20;
scene.add(camera);

let vals = {
    Object: "Cylinder",
    Mapping: "Cylindrical",
};

let t1 = new THREE.TextureLoader().load('./uv_mapper.jpg')

let uniforms = {
    c1: { value: new THREE.Color(0xff0000) },
    c2: { value: new THREE.Color(0x00ff00) },
    c3: { value: new THREE.Color(0x0000ff) },
    c4: { value: new THREE.Color(0x00ffff) },
    t1: {value: t1}
};

const getObject = (object, mapping, uniforms) => {
    let geometry;
    if (object === "Cube") geometry = new THREE.BoxGeometry(3, 3, 3);
    else if (object === "Sphere") geometry = new THREE.SphereGeometry(3);
    else geometry = new THREE.CylinderGeometry(4, 4, 10);

    let fshader = v1f;
    if (mapping === "Cylindrical") {
        fshader = v2f;
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: v1,
        fragmentShader: fshader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

let mesh = getObject(vals.Object, vals.Mapping, uniforms);
scene.add(mesh);

const gui = new GUI();
const f1 = gui.addFolder("Texture Mapping");
f1.add(vals, "Object", ["Sphere", "Cube", "Cylinder"]).onChange(() => {
    scene.remove(mesh);
    mesh = getObject(vals.Object, vals.Mapping, uniforms);
    scene.add(mesh);
});

f1.add(vals, "Mapping", ["Spherical", "Cylindrical"]).onChange(() => {
    scene.remove(mesh);
    mesh = getObject(vals.Object, vals.Mapping, uniforms);
    scene.add(mesh);
});


// Renderer
const canvas = document.querySelector(".webgl");
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(constants.width, constants.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// Animation
const loop = () => {
    mesh.rotation.x += 0.005;
    mesh.rotation.z += 0.005;
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();
