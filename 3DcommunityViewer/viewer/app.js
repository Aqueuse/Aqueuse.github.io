
import * as THREE from 'three';

<<<<<<< HEAD
=======
import Stats from 'three/addons/libs/stats.module.js';

>>>>>>> parent of 93d6d45 (update !)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//fbx
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let container, stats;
let camera, controls, scene, renderer;

<<<<<<< HEAD
let skyBox;
=======
let mesh, skyBox;
let helper;
>>>>>>> parent of 93d6d45 (update !)

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

fetch('config.json').then(response => response.json()).then(data => {
  init(data.map.file, data.map.scale);
  animate();
})

function init(url, scale) {

  container = document.getElementById('container');
  container.innerHTML = '';

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  //fog
//  scene.fog = new THREE.Fog(0xbfd1e5, 1000, 10000);

  //skybox
<<<<<<< HEAD
  const skySphereGeometry = new THREE.SphereGeometry(10000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
  skyBox = new THREE.Mesh(skySphereGeometry, skyMaterial);

  scene.add(skyBox);

=======
  const skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
  const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
  skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBox);




>>>>>>> parent of 93d6d45 (update !)
  let fbxLoader = new FBXLoader();

  fbxLoader.load(url, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
<<<<<<< HEAD

      if (child.type === "Mesh") {
        let newMesh = child.clone();

        child.scale.set(scale, scale, scale);

        meshs.push({
          id: meshs.length,
          name: child.name,
          mesh: child
        });

        scene.add(newMesh);

        console.log(child);
      }
=======
>>>>>>> parent of 93d6d45 (update !)
    });

    mesh = object;
    
    scene.add(object);
  })

  // Lights
<<<<<<< HEAD
  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
  dirLight1.rotation.set(0, 45, 0);
=======

  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
>>>>>>> parent of 93d6d45 (update !)
  scene.add(dirLight1);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1000;
  controls.maxDistance = 10000;
  controls.maxPolarAngle = Math.PI / 2;


  controls.target.y = 100;
  camera.position.y = controls.target.y + 2000;
  camera.position.x = 4000;

  controls.update();

<<<<<<< HEAD
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('click', onPointerClick);
=======
  const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
  geometryHelper.translate(0, 50, 0);
  geometryHelper.rotateX(Math.PI / 2);
  helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
  scene.add(helper);


  container.addEventListener('pointermove', onPointerMove);

  stats = new Stats();
  container.appendChild(stats.dom);
>>>>>>> parent of 93d6d45 (update !)
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
<<<<<<< HEAD
=======
  stats.update();
>>>>>>> parent of 93d6d45 (update !)
}

function render() {
  renderer.render(scene, camera);
}

<<<<<<< HEAD
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

=======
>>>>>>> parent of 93d6d45 (update !)
function onPointerMove(event) {

  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // See if the ray from the camera into the world hits one of our meshes

  if (mesh !== undefined && mesh !== null) {
    const intersects = raycaster.intersectObject(mesh);

    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {

<<<<<<< HEAD
      if (intersects.length > 0) {
        selectedObject = objectData;

        break;
      }
=======
      helper.position.set(0, 0, 0);
      helper.lookAt(intersects[0].face.normal);

      helper.position.copy(intersects[0].point);

>>>>>>> parent of 93d6d45 (update !)
    }
  }

}
