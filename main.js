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

let objProperties = {
    value: {
        ka: 1,
        kd: 1,
        ks: 1,
        shininess: 80,
    },
};

let light = [
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: true,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: true,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: true,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
    {
        lightPos: new THREE.Vector3(0, 0, 0),
        ambientColor: new THREE.Color("#341900"),
        diffuseColor: new THREE.Color("#CC6600"),
        specularColor: new THREE.Color("#ffffff"),
        on: false,
    },
];

let uniforms = {
    n: { value: 3 },
    objProperties: objProperties,
    lights: { value: light },
    aColor: { value: new THREE.Color("#ff33ff") },
};

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
    ObjectColor: "#ff33ff",
};
objectGUI
    .add(Shading, "Shading", ["Gouraud", "Phong"])
    .onChange(() => getShader())
    .setValue("Gouraud");

objectGUI.add(props, "ka", 0, 1).onChange(v => {
    objProperties.value.ka = v;
});
objectGUI.add(props, "kd", 0, 1).onChange(v => {
    objProperties.value.kd = v;
});
objectGUI.add(props, "ks", 0, 1).onChange(v => {
    objProperties.value.ks = v;
});
objectGUI.add(props, "shininess", 1, 128).onChange(v => {
    light.lobjProperties.value.shininess = v;
});
objectGUI
    .add(Shading, "Lighting", ["Default", "Blinn-Phong"])
    .onChange(() => getShader())
    .setValue("Default");

objectGUI.addColor(props, "ObjectColor").onChange(c => {
    var c1 = new THREE.Color(c);
    uniforms.aColor.value = c1;
});

const gui2 = new GUI();
for (let i = 0; i < uniforms.n.value; i++) {
    const l = gui2.addFolder("Lighting Properties " + (i + 1));
    let settings = {
        ambientColor: "#341900",
        diffuseColor: "#CC6600",
        specularColor: "#ffffff",
        switch: true,
        x: 0,
        y: 0,
        z: 0,
    };

    l.add(settings, "switch").onChange(c => {
        light[i].on = c;
    });

    l.addColor(settings, "ambientColor").onChange(c => {
        var c1 = new THREE.Color(c);
        light[i].ambientColor = c1;
    });
    l.addColor(settings, "diffuseColor").onChange(c => {
        var c1 = new THREE.Color(c);
        light[i].diffuseColor = c1;
    });
    l.addColor(settings, "specularColor").onChange(c => {
        var c1 = new THREE.Color(c);
        light[i].specularColor = c1;
    });

    l.add(settings, "x", -10, 10)
        .step(0.1)
        .onChange(x => {
            var t1 = new THREE.Vector3(x, settings.y, settings.z);
            light[i].lightPos = t1;
        });

    l.add(settings, "y", -10, 10)
        .step(0.1)
        .onChange(y => {
            var t1 = new THREE.Vector3(settings.x, y, settings.z);
            light[i].lightPos = t1;
        });

    l.add(settings, "z", -10, 10)
        .step(0.1)
        .onChange(z => {
            var t1 = new THREE.Vector3(settings.x, settings.y, z);
            light[i].lightPos = t1;
        });
}

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
