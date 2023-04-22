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

let light = {
    light1: {
        value: {
            lightPos: new THREE.Vector3(0, 0, 0),
            ka: 1,
            ambientColor: new THREE.Color("#341900"),
            kd: 1,
            diffuseColor: new THREE.Color("#CC6600"),
            ks: 1,
            specularColor: new THREE.Color("#ffffff"),
            shininess: 80,
            on: true,
        },
    },
    light2: {
        value: {
            lightPos: new THREE.Vector3(0, 0, 0),
            ka: 1,
            ambientColor: new THREE.Color("#341900"),
            kd: 1,
            diffuseColor: new THREE.Color("#CC6600"),
            ks: 1,
            specularColor: new THREE.Color("#ffffff"),
            shininess: 80,
            on: true,
        },
    },
    light3: {
        value: {
            lightPos: new THREE.Vector3(0, 0, 0),
            ka: 1,
            ambientColor: new THREE.Color("#341900"),
            kd: 1,
            diffuseColor: new THREE.Color("#CC6600"),
            ks: 1,
            specularColor: new THREE.Color("#ffffff"),
            shininess: 80,
            on: true,
        },
    },
};

let uniforms = {
    n: {value: 3},
    lights: {value: [light.light1,light.light2,light.light3]}
}

//TODO: Different Geometries
const getObject = (uniforms, vShader, fShader) => {
    // const geometry = new THREE.CapsuleGeometry(3, 6, 8, 8);
    const geometry = new THREE.SphereGeometry(4, 256);
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

let props = {
    ka: 1,
    kd: 1,
    ks: 1,
    shininess: 80,
};
objectGUI
    .add(Shading, "Shading", ["Gouraud", "Phong"])
    .onChange(() => getShader())
    .setValue("Gouraud");

objectGUI.add(props, "ka", 0, 1).onChange(v => {
    light.light1.value.ka = v;
    light.light2.value.ka = v;
    light.light3.value.ka = v;
});
objectGUI.add(props, "kd", 0, 1).onChange(v => {
    light.light1.value.kd = v;
    light.light2.value.kd = v;
    light.light3.value.kd = v;
});
objectGUI.add(props, "ks", 0, 1).onChange(v => {
    light.light1.value.ks = v;
    light.light2.value.ks = v;
    light.light3.value.ks = v;
});
objectGUI.add(props, "shininess", 1, 128).onChange(v => {
    light.light1.value.shininess = v;
    light.light2.value.shininess = v;
    light.light3.value.shininess = v;
});
objectGUI
    .add(Shading, "Lighting", ["Default", "Blinn-Phong"])
    .onChange(() => getShader())
    .setValue("Default");

// Light 1
const lightProp1 = gui.addFolder("Light Properties 1");
let settings1 = {
    ambientColor: "#341900",
    diffuseColor: "#CC6600",
    specularColor: "#ffffff",
    switch: true,
    x: 0,
    y: 0,
    z: 0,
};
lightProp1.add(settings1, "switch").onChange(c => {
    light.light1.value.on = c;
});
lightProp1.addColor(settings1, "ambientColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light1.value.ambientColor = c1;
});
lightProp1.addColor(settings1, "diffuseColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light1.value.diffuseColor = c1;
});
lightProp1.addColor(settings1, "specularColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light1.value.specularColor = c1;
});

lightProp1
    .add(settings1, "x", -10, 10)
    .step(0.1)
    .onChange(x => {
        var t1 = new THREE.Vector3(x, settings1.y, settings1.z);
        light.light1.value.lightPos = t1;
    });

lightProp1
    .add(settings1, "y", -10, 10)
    .step(0.1)
    .onChange(y => {
        var t1 = new THREE.Vector3(settings1.x, y, settings1.z);
        light.light1.value.lightPos = t1;
    });

lightProp1
    .add(settings1, "z", -10, 10)
    .step(0.1)
    .onChange(z => {
        var t1 = new THREE.Vector3(settings1.x, settings1.y, z);
        light.light1.value.lightPos = t1;
    });

// light 2
const lightProp2 = gui.addFolder("Light Properties 2");
let settings2 = {
    ambientColor: "#341900",
    diffuseColor: "#CC6600",
    specularColor: "#ffffff",
    switch: true,
    x: 0,
    y: 0,
    z: 0,
};
lightProp2.add(settings2, "switch").onChange(c => {
    light.light2.value.on = c;
});
lightProp2.addColor(settings2, "ambientColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light2.value.ambientColor = c1;
});
lightProp2.addColor(settings2, "diffuseColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light2.value.diffuseColor = c1;
});
lightProp2.addColor(settings2, "specularColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light2.value.specularColor = c1;
});

lightProp2
    .add(settings2, "x", -10, 10)
    .step(0.1)
    .onChange(x => {
        var t1 = new THREE.Vector3(x, settings2.y, settings2.z);
        light.light2.value.lightPos = t1;
    });

lightProp2
    .add(settings2, "y", -10, 10)
    .step(0.1)
    .onChange(y => {
        var t1 = new THREE.Vector3(settings2.x, y, settings2.z);
        light.light2.value.lightPos = t1;
    });

lightProp2
    .add(settings2, "z", -10, 10)
    .step(0.1)
    .onChange(z => {
        var t1 = new THREE.Vector3(settings2.x, settings2.y, z);
        light.light2.value.lightPos = t1;
    });

// Light 3
const lightProp3 = gui.addFolder("Light Properties 3");
let settings3 = {
    ambientColor: "#341900",
    diffuseColor: "#CC6600",
    specularColor: "#ffffff",
    switch: true,
    x: 0,
    y: 0,
    z: 0,
};
lightProp3.add(settings3, "switch").onChange(c => {
    light.light3.value.on = c;
});
lightProp3.addColor(settings3, "ambientColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light3.value.ambientColor = c1;
});
lightProp3.addColor(settings3, "diffuseColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light3.value.diffuseColor = c1;
});
lightProp3.addColor(settings3, "specularColor").onChange(c => {
    var c1 = new THREE.Color(c);
    light.light3.value.specularColor = c1;
});

lightProp3
    .add(settings3, "x", -10, 10)
    .step(0.1)
    .onChange(x => {
        var t1 = new THREE.Vector3(x, settings3.y, settings3.z);
        light.light3.value.lightPos = t1;
    });

lightProp3
    .add(settings3, "y", -10, 10)
    .step(0.1)
    .onChange(y => {
        var t1 = new THREE.Vector3(settings3.x, y, settings3.z);
        light.light3.value.lightPos = t1;
    });

lightProp3
    .add(settings3, "z", -10, 10)
    .step(0.1)
    .onChange(z => {
        var t1 = new THREE.Vector3(settings3.x, settings3.y, z);
        light.light3.value.lightPos = t1;
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