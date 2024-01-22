
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//fbx
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let container, stats;
let camera, controls, scene, renderer;

let mesh, skyBox;
let helper;

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
  scene.fog = new THREE.Fog(0xbfd1e5, 1000, 10000);

  //skybox
  const skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
  const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
  skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBox);




  let fbxLoader = new FBXLoader();

  fbxLoader.load(url, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    mesh = object;
    mesh.scale.multiplyScalar(scale);
    
    scene.add(object);
  })

  /*var loader = new GLTFLoader();
  loader.load(
    url,
    function (gltf) {
      console.log(gltf);
      gltf.scene.scale.set(scale, scale, scale);
      scene.add(gltf.scene);

      mesh = gltf.scene
      //find ligth
      const lights = [];
      gltf.scene.traverse(function (child) {
        console.log(child);
        if (child.isLight) lights.push(child);
      }
      );

      console.log(lights);

    },
  );*/

  // Lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
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

  const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
  geometryHelper.translate(0, 50, 0);
  geometryHelper.rotateX(Math.PI / 2);
  helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
  scene.add(helper);


  container.addEventListener('pointermove', onPointerMove);

  stats = new Stats();
  container.appendChild(stats.dom);
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
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

function onPointerMove(event) {

  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // See if the ray from the camera into the world hits one of our meshes

  if (mesh !== undefined && mesh !== null) {
    const intersects = raycaster.intersectObject(mesh);

    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {

      helper.position.set(0, 0, 0);
      helper.lookAt(intersects[0].face.normal);

      helper.position.copy(intersects[0].point);

    }
  }

}
