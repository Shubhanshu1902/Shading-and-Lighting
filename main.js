import * as THREE from "three";
import "./style.css";
import { GUI } from "dat.gui";
import { gouroudV, phongV, gouroudPhongBingV } from "./vertexShader";
import { gouroudF, phongBlingF, phongF } from "./fragmentShader";

// Creating scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0065b3);

// Window Sizes
const constants = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let Shading = {
    Shading: "Gouraud",
    Lighting: "Default",
};

let uniforms = {
    light: {
        value: {
            lightPos: new THREE.Vector3(0, 0, 0),
            ka: 1,
            ambientColor: new THREE.Color("#341900"),
            kd: 1,
            diffuseColor: new THREE.Color("#CC6600"),
            ks: 1,
            specularColor: new THREE.Color("#ffffff"),
            shininess: 80,
        },
    },
};

const getObject = (uniforms, vShader, fShader) => {
    // const geometry = new THREE.CapsuleGeometry(3, 6, 8, 8);
    const geometry = new THREE.SphereGeometry(4,256);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

var mesh = getObject(uniforms, gouroudV, gouroudF);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    constants.width / constants.height,
    0.1,
    100
);
camera.position.z = 20;
scene.add(camera);

const getShader = () => {
    scene.remove(mesh);
    let vShader = gouroudV;
    let fShader = gouroudF;

    if (Shading.Shading === "Phong" && Shading.Lighting === "Default") {
        vShader = phongV;
        fShader = phongF;
    } else if (
        Shading.Shading === "Gouraud" &&
        Shading.Lighting === "Blinn-Phong"
    ) {
        vShader = gouroudPhongBingV;
    } else if (
        Shading.Shading === "Phong" &&
        Shading.Lighting === "Blinn-Phong"
    ) {
        vShader = phongV;
        fShader = phongBlingF;
    }

    mesh = getObject(uniforms, vShader, fShader);
    scene.add(mesh);
};

// GUI
const gui = new GUI();
const objectGUI = gui.addFolder("Object Properties");
objectGUI
    .add(Shading, "Shading", ["Gouraud", "Phong"])
    .onChange(() => getShader())
    .setValue("Gouraud");

objectGUI.add(uniforms.light.value, "ka", 0, 1);
objectGUI.add(uniforms.light.value, "kd", 0, 1);
objectGUI.add(uniforms.light.value, "ks", 0, 1);
objectGUI.add(uniforms.light.value, "shininess", 1, 128);

const lightProp = gui.addFolder("Light Properties");
let settings = {
    ambientColor: "#341900",
    diffuseColor: "#CC6600",
    specularColor: "#ffffff",
};
lightProp.addColor(settings, "ambientColor").onChange(c => {
    var c1 = new THREE.Color(c);
    uniforms.light.value.ambientColor = c1;
});
lightProp.addColor(settings, "diffuseColor").onChange(c => {
    var c1 = new THREE.Color(c);
    uniforms.light.value.diffuseColor = c1;
});
lightProp.addColor(settings, "specularColor").onChange(c => {
    var c1 = new THREE.Color(c);
    uniforms.light.value.specularColor = c1;
});

lightProp
    .add(Shading, "Lighting", ["Default", "Blinn-Phong"])
    .onChange(() => getShader())
    .setValue("Default");

const lightPosFolder = gui.addFolder("Lighting Position");
let pos = {
    x: 0,
    y: 0,
    z: 0,
};

lightPosFolder
    .add(pos, "x", -10, 10)
    .step(0.1)
    .onChange(x => {
        var t1 = new THREE.Vector3(x, pos.y, pos.z);
        uniforms.light.value.lightPos = t1;
    });

lightPosFolder
    .add(pos, "y", -10, 10)
    .step(0.1)
    .onChange(y => {
        var t1 = new THREE.Vector3(pos.x, y, pos.z);
        uniforms.light.value.lightPos = t1;
    });

lightPosFolder
    .add(pos, "z", -10, 10)
    .step(0.1)
    .onChange(z => {
        var t1 = new THREE.Vector3(pos.x, pos.y, z);
        uniforms.light.value.lightPos = t1;
    });

// Renderer
const canvas = document.querySelector(".webgl");
console.log(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(constants.width, constants.height);
renderer.render(scene, camera);

// Animation
const loop = () => {
    mesh.rotation.x += 0.006;
    mesh.rotation.z += 0.006;
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();
