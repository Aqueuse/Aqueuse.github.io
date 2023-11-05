
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//fbx
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//export
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

//let stats;
let container;
let camera, controls, scene, renderer;
let meshs = [];

let skyBox;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

fetch('config.json').then(response => response.json()).then(data => {
  init(data.map.file, data.map.scale);
  animate();
})


function init(url, scale) {

  container = document.getElementById('container');
  container.innerHTML = '';

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  //fog
//  scene.fog = new THREE.Fog(0xbfd1e5, 1000, 10000);

  //skybox
  const skySphereGeometry = new THREE.SphereGeometry(10000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
  skyBox = new THREE.Mesh(skySphereGeometry, skyMaterial);

  scene.add(skyBox);

  //plane
  const planeGeometry = new THREE.PlaneGeometry(100000, 100000);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: "#66f469", side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(Math.PI / 2);
  plane.position.y = -110;
  scene.add(plane);

  const outlineMaterial = new THREE.MeshStandardMaterial(
    {
      color: "#ff0000",
      side: THREE.BackSide,
      emissive: "#ff0000",
      emissiveIntensity: 1.5,
    });


  let fbxLoader = new FBXLoader();

  fbxLoader.load(url, function (object) {
    object.traverse(function (child) {

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      if (child.type === "Mesh") {
        let newMesh = child.clone();

        newMesh.material = outlineMaterial.clone();
        //newMesh.scale.multiplyScalar(1.05);
        child.scale.set(scale, scale, scale);
        //newMesh.visible = true;

        const material = new THREE.MeshLambertMaterial();
        child.material = material;

        meshs.push({
          id: meshs.length,
          name: child.name,
          mesh: child,
          outlineMesh: newMesh
        });

        scene.add(newMesh);

        console.log(child);
      }
    });
    console.log(object);
    scene.add(object);
  })

  // Lights

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

  controls = new OrbitControls(camera, renderer.domElement);

  controls.minDistance = 1000;
  controls.maxDistance = 10000;
  controls.maxPolarAngle = Math.PI / 2;


  controls.target.y = 100;
  camera.position.y = controls.target.y + 2000;
  camera.position.x = 4000;

  controls.update();

  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('click', onPointerClick);
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  //skyBox follow camera
  skyBox.position.copy(camera.position);

  render();
}

function render() {
  renderer.render(scene, camera);
}

const modelName = document.body.querySelector("#model-name");
const modelDescription = document.body.querySelector("#model-description");
const modelUser = document.body.querySelector("#model-user");

const modelNameDownload = document.body.querySelector("#model-name-download");

let selectedObject = null;

function GetInfos(name) {
  const _split = name.split("#");
  return {
    name: _split[0],
    user: _split[1],
    description: _split[2],
  }
}

function onPointerClick(event) {

  for (let i = 0; i < meshs.length; i++) {
    const mesh = meshs[i];
    mesh.outlineMesh.visible = false;
  }

  if (selectedObject) {
    modelNameDownload.style.visibility = "visible"
    selectedObject.outlineMesh.visible = true;

    const infos = GetInfos(selectedObject.name);

    modelName.innerHTML = infos.name;
    modelUser.innerHTML = infos.user;
    modelDescription.innerHTML = infos.description;
  }

}

modelNameDownload.addEventListener('click', function () {
  if (selectedObject) {
    const exporter = new GLTFExporter();
    exporter.parse(selectedObject.mesh, function (result) {

      const output = JSON.stringify(result, null, 2);

      const blob = new Blob([output], {
        type: 'text/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const infos = GetInfos(selectedObject.name);

      link.href = url;
      link.download = infos.name + '.gltf';
      link.click();

    });
  }
});

function onPointerMove(event) {

  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  if (meshs !== undefined && meshs !== null) {

    for (let i = 0; i < meshs.length; i++) {
      const objectData = meshs[i];

      const intersects = raycaster.intersectObject(objectData.mesh, false);

      if (intersects.length > 0) {
        selectedObject = objectData;

        break;
      }
    }
  }
}
