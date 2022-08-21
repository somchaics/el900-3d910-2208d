
import {
    BoxBufferGeometry,
    Fog,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Vector3,
    Scene,
    WebGLRenderer,
    GridHelper,
    PolarGridHelper,
    TextureLoader,
    MeshPhongMaterial,
    BoxGeometry,
    PlaneBufferGeometry,
    HemisphereLight,
    DirectionalLight,
   
    ObjectLoader
} from '../../../build/three.module.js';

import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';

let camera;
let renderer;
let scene, mixer;
let model1, model2, model3, model4, model5;

class World {
    constructor() {
      
        camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.set(112, 100, 600);
        camera.lookAt(new Vector3(0, 2, 0));

        scene = new Scene();
        scene.background = new Color(0xa0a0a0);
        scene.fog = new Fog(0xa0a0a0, 1000, 5000);

        //camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        //camera.position.z = 400;

        //scene = new Scene();
        //scene.background = new Color('skyblue');

        let light = new HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 200, 0);
        scene.add(light);

        const shadowSize = 200;
        light = new DirectionalLight(0xffffff);
        light.position.set(0, 200, 100);
        light.castShadow = true;
        light.shadow.camera.top = shadowSize;
        light.shadow.camera.bottom = -shadowSize;
        light.shadow.camera.left = -shadowSize;
        light.shadow.camera.right = shadowSize;
        scene.add(light);

        // ground
        var mesh = new Mesh(new PlaneBufferGeometry(10000, 10000), new MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);

        var grid = new GridHelper(5000, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        renderer = new WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        const textureloader = new TextureLoader();
        const material = new MeshBasicMaterial({ map: textureloader.load('../textures/hardwood2_diffuse.jpg') });
        //const material = new MeshBasicMaterial({ color: 0xff09ff });

        const materials = [
            new MeshBasicMaterial({ map: textureloader.load('../textures/crate.gif') }),
            new MeshBasicMaterial({ map: textureloader.load('../textures/uv-test-bw.png') }),
            new MeshBasicMaterial({ map: textureloader.load('../textures/uv-test-col.png') }),
            new MeshBasicMaterial({ map: textureloader.load('../textures/disturb.jpg') }),
            new MeshBasicMaterial({ map: textureloader.load('../textures/golfball.jpg') }),
            new MeshBasicMaterial({ map: textureloader.load('../textures/hardwood2_diffuse.jpg') }),
        ];

        const boxGeometry = new BoxGeometry();
        const cube = new Mesh(boxGeometry, material);
        cube.scale.set(90, 50, 50);
        cube.position.set(160, 100, 160);
        scene.add(cube);

        /* loader */
        //const loader = new GLTFLoader();
        //loader.load('../models/gltf/Horse.glb', function (object) {
        //    model3 = object.scene;
            
        //    //player.scale.set(20, 20, 20);
        //    object.scene.traverse(function (child) {
        //        if (child.isMesh) {
        //            //child.material = materialr;
        //            //child.material = material;
        //        }
        //    });
        //    scene.add(model3);


        //}, undefined, function (e) {
        //    console.error(e);
        //});

        let p3 = this.loadModel('../models/gltf/Horse.glb').then(result => {
            model3 = result.scene;
           // var children = [];
            result.scene.traverse(function (child) {
                if (child.isMesh) {
                    //child.material = materialr;
                    child.material = materials[3];
                //    children.push(child);
                }
            });
            
           // scene.add(model3);
        });

        Promise.all([p3]).then(() => {
         
           // model3.scale.set(50, 50, 50);
           // model3.position.set(200, 100, 300);
                    
            scene.add(model3);
          
        });


        this.animate();
    }

    animate() {
        // requestAnimationFrame(animate);
        requestAnimationFrame(() => { this.animate() });
        const time = -performance.now() * 0.0003;
        camera.position.y = 200;//400 * Math.cos(time);
        camera.position.x = 500 * Math.cos(time);
        camera.position.z = 500 * Math.sin(time);
        //// alert(camera.position.x + "," + camera.position.z);
        camera.lookAt(scene.position);

        renderer.render(scene, camera);

    }

    loadModel(url) {
        return new Promise(resolve => {
            new GLTFLoader().load(url, resolve);
        });
    }
    loadObj(url) {
        return new Promise(resolve => {
            new ObjectLoader().load(url, resolve);
        });
    }

}

export { World };
