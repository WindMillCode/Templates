// @ts-nocheck
import { Observable, from, tap, timer } from 'rxjs';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import {
  Renderer,
  WebGLRenderer,
  Object3D,
  Scene,
  Camera,
  TextureLoader,
  ACESFilmicToneMapping,
  PerspectiveCamera,
  GridHelper,
  Vector3,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  Group,
  BufferGeometry,
  MeshBasicMaterial,
  RepeatWrapping,
  DoubleSide,
  Material,
} from 'three';
import {
  World,
  Vec3,
  Body,
  Box,
  Material as CANNONMaterial,
  ContactMaterial,
} from 'cannon-es';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSSVARS } from './common-utils';
export class WMLThreeParams<R = Renderer> {
  constructor(params: Partial<WMLThreeParams> = {}) {
    Object.assign(this, {
      ...params,
    });
    this.params = params;
  }

  private params: Partial<WMLThreeParams>;
  renderer: R = new WebGLRenderer({ antialias: true });
  rendererParentElement = document.body;
  scene: Object3D = new Scene();
  camera: Camera;
  orbit: OrbitControls;
  gui: GUI;
  textureLoader = new TextureLoader();
  world: World;
  objs: WMLThreeObj[] = [];
  orbitControlsViaMouseIsPresent = true;
  guiControlsIsPresent = true;
  updateChildrenOnResizeIsPresent = true;
  worldIsPresent = true;

  // init
  private addRendererToDOM = () => {
    let rect = this.getContainerDimensionDetails();
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.useLegacyLights = false;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.rendererParentElement.appendChild(this.renderer.domElement);
  };
  private initCamera = () => {
    let rect = this.getContainerDimensionDetails();
    this.camera = new PerspectiveCamera(55, rect.width / rect.height, 1, 20000);
  };
  private listenForMouseToMoveCamera = () => {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.target.set(0, 10, 0);
  };
  animate = () => {
    this.animateWorld();
    this.letWaterFlow();
    this.renderer.render(this.scene, this.camera);
  };
  init = () => {
    return timer(100).pipe(
      tap(() => {
        this.addRendererToDOM();
        if (!this.params.camera) {
          this.initCamera();
        }
        if (!this.params.orbit && this.orbitControlsViaMouseIsPresent) {
          this.listenForMouseToMoveCamera();
        }
        this.addGUIControls();
        this.createPhysicalWorld();
        this.resizeRendererBasedOnWindowResize();
        this.renderer.setAnimationLoop(this.animate);
      })
    );
  };

  // aux
  private updateChildrenOnResize = (rect) => {
    if (!this.updateChildrenOnResizeIsPresent) return;
    let prevViewportWidth = this.renderer.domElement.clientWidth;
    let prevViewportHeight = this.renderer.domElement.clientHeight;

    let viewportWidth = rect.width;
    let viewportHeight = rect.height;

    this.objs.forEach((obj) => {
      let target;
      if (obj.isWorldPart) {
        target = obj.physBody;
      } else {
        target = obj.getMesh();
      }
      let prevPosition = target.position.clone();

      let positionAdjustmentX =
        (prevPosition.x / prevViewportWidth) *
        (viewportWidth - prevViewportWidth);
      let positionAdjustmentY =
        (prevPosition.y / prevViewportHeight) *
        (viewportHeight - prevViewportHeight);

      let newPositionX = prevPosition.x + positionAdjustmentX;
      let newPositionY = prevPosition.y + positionAdjustmentY;
      let newPositionZ = prevPosition.z;
      let newPosition = new Vector3(newPositionX, newPositionY, newPositionZ);
      target.position.copy(newPosition);
    });
  };
  private resizeRendererBasedOnWindowResize = () => {
    window.addEventListener('resize', () => {
      let rect = this.getContainerDimensionDetails();
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
      this.updateChildrenOnResize(rect);
      this.renderer.setSize(rect.width, rect.height);
    });
  };
  getWorldSurface = ()=>{
    return this.objs.find((obj)=>obj.isWorldSurface)
  }
  getWaterWorldSurface = ()=>{
    return this.objs.find((obj)=>obj.isWorldSurface && obj.isWaterObj)
  }
  setObjPosRelativeToCameraViewport = (
    obj: WMLThreeObj,
    x:WMLThreeObj,
    offsetXPercent?,
    offsetYPercent?
  ) => {
    let target
    let source
    if (obj.isWorldPart) {
      target = obj.physBody;
      source = x.physBody
    } else {
      target = obj.getMesh();
      source = x.getMesh()
    }
    let waterWorldSurface = x.isWaterObj && x.isWorldSurface
    let visibleHeightAtZDepth = ( depth, camera ) => {
      let cameraOffset = camera.position.z;
      if(waterWorldSurface){
        cameraOffset = camera.position.y
      }
      if ( depth < cameraOffset ) depth -= cameraOffset;
      else depth += cameraOffset;

      let vFOV = camera.fov * Math.PI / 180;

      return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );

    };

    let visibleWidthAtZDepth = ( depth, camera ) => {
      let height = visibleHeightAtZDepth( depth, camera );
      return height * camera.aspect;
    };
    let cameraDirection = new Vector3();
    this.camera.getWorldDirection(cameraDirection);

    let sceneCenter = new Vector3();
    this.scene.getWorldPosition(sceneCenter);

    let distance = sceneCenter.distanceTo(this.camera.position);

    let dims = {
      width:visibleWidthAtZDepth(distance,this.camera),
      height:visibleHeightAtZDepth(distance,this.camera),
    }
    let resultWidth = offsetXPercent * dims.width
    resultWidth = -(dims.width/2) + resultWidth
    let resultHeight = offsetYPercent * dims.height
    resultHeight = -(dims.height/2) + resultHeight
    if(waterWorldSurface){
      target.position.x = resultWidth
      target.position.z= resultHeight
    }
    else{
      target.position.x = resultWidth
      target.position.y= resultHeight
    }


  };
  moveCameraToPosition = (vec3: Vector3) => {
    this.camera.position.copy(vec3);
    this.camera.lookAt(this.scene.position);
    if (this.orbit) {
      this.orbit.update();
    }
  };
  private getContainerDimensionDetails = () => {
    if (this.rendererParentElement === document.body) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else {
      let rect = this.rendererParentElement.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    }
  };
  addGridHelper = () => {
    let gridHelper = new GridHelper(12, 12);
    scene.add(gridHelper);
  };
  addDirectionalLight = (vec3 = new Vector3(-30, 2000, -1220)) => {
    directionalLight = new DirectionalLight();
    directionalLight.position.set(vec3);
    scene.add(directionalLight);
  };
  addDirectionalLightHelper = () => {
    let dLightHelper = new DirectionalLightHelper(directionalLight, 10);
    scene.add(dLightHelper);
  };
  private addGUIControls = () => {
    if (!this.guiControlsIsPresent) return;
    this.gui = new GUI();
    this.gui.open();
  };

  // water methods
  private letWaterFlow = () => {
    this.objs
      .filter((water) => {
        return water.isWaterObj;
      })
      .forEach((water) => {
        water.getMesh().material.uniforms['time'].value += 1.0 / 60.0;
      });
  };

  // world methods
  private animateWorld = () => {
    if (this.world) {
      this.world.step(1 / 60);
      this.objs
        .filter((part) => {
          return part.isWorldPart;
        })
        .forEach((part) => {
          this.makeMeshFollowPhysBody(part.getMesh(), part.physBody);
        });
      if (this.getWorldSurface()) {
        this.objs
          .filter((part) => {
            return part.isFloating && part.isWorldPart;
          })
          .map((part) => {
            this.applyBuoyancy(this.getWorldSurface(), part);
          });
      }
    }
  };

  createPhysicalWorld = () => {
    if (!this.worldIsPresent) return;
    this.world = new World({
      gravity: new Vec3(0,0 , -9.81),
    });
  };

  private makeMeshFollowPhysBody = (mesh, physBody) => {
    if (physBody) {
      mesh.position.copy(physBody.position);
      mesh.quaternion.copy(physBody.quaternion);
    }
  };
  private applyBuoyancy = (surface: WMLThreeObj, object: WMLThreeObj) => {
    let objectMesh = object.getMesh();
    if (objectMesh) {
      let worldMesh = surface.getMesh();

      let objectBody = object.physBody;
      let waterHeight = worldMesh.position.y;
      let submergedVolume = objectMesh.position.y - waterHeight - 10;

      let positionAttribute;
      if (objectMesh instanceof Group) {
        positionAttribute =
          objectMesh.children[0].geometry.getAttribute('position');
      } else if (objectMesh instanceof Mesh) {
        positionAttribute = objectMesh.geometry.getAttribute('position');
      }

      let vertexIndex = 0;
      let vertexPosition = new Vector3();

      vertexPosition.fromBufferAttribute(positionAttribute, vertexIndex);

      let height = vertexPosition.y;

      let submergedRatio = submergedVolume / (height * 2);
      let buoyancyForce = new Vec3(
        0,
        submergedRatio * objectBody.mass * 9.81,
        0
      );
      objectBody.applyForce(buoyancyForce, objectBody.position);
    }
  };
}

export class WMLThreeObj {
  constructor(params: Partial<WMLThreeObj> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  mesh: Mesh;
  meshGroup: Group;
  material: Material;
  geometry: BufferGeometry;
  physMat = new CANNONMaterial();
  physBody: Body;
  textureURL: string;
  geometryURL: string;
  guiName = '';
  isFloating = false;
  isWaterObj = false;
  isWorldPart = false;
  isWorldSurface = false

  getMesh = () => {
    return this.mesh ?? this.meshGroup;
  };

  // cannon methods
  createPhysBodyFromMesh = (
    helper: WMLThreeParams,
    mass = 0.0001,
    mesh = this.getMesh()
  ) => {
    if (!helper.world) return;
    this.physMat = new CANNONMaterial();
    this.physBody = new Body({
      mass,
      shape: this.isWorldSurface
        ? new Box(
            new Vec3(
              this.geometry.parameters.width,
              this.geometry.parameters.height,
              0.1
            )
          )
        : mesh.geometry,
      position: mesh.position,
      material: this.physMat,
    });
    helper.world.addBody(this.physBody);
    this.physBody.quaternion.copy(mesh.quaternion);
    if (this.isWorldSurface) {
      this.physBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      helper.world.gravity = new Vec3(0,-9.81,0)
    }
  };

  createContactPhysics = (helper: WMLThreeParams) => {
    if (helper.world) {
      let surface = helper.objs.find((obj)=>obj.isWorldSurface)
      let contactMat = new ContactMaterial(surface, this.physMat, {
        friction: 0.04,
        restitution: 0.9,
      });
      helper.world.addContactMaterial(contactMat);
    }
  };

  addWater = (
    helper: WMLThreeParams,
    waterNormalsURL = 'assets/media/threejs-background/beach_water_normals.png',
    waterColor = 'rgba('+CSSVARS.wmlTertiary+')'
  ) => {
    this.geometry.rotateX(-Math.PI / 2);
    let waterNormals = new TextureLoader().load(
      waterNormalsURL,
      function (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
      }
    );
    let water = new Water(this.geometry, {
      side: DoubleSide,
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new Vector3(),
      waterColor,
      distortionScale: 3.7,
      fog: helper.scene.fog !== undefined,
    });
    water.material.uniforms.size.value = 0.5;
    helper.scene.add(water);
    this.meshGroup = water;
    this.isWaterObj = true;
    helper.objs.push(this);
    helper.moveCameraToPosition(new Vector3(0, 200, 65));
  };

  addItemViaTextureAndAssetLoader = (
    helper: WMLThreeParams,
    assetType: 'obj' = 'obj'
  ): Observable<Group> => {
    let assetLoader = {
      obj: () => new OBJLoader(),
    }[assetType]();
    let textureLoader = new TextureLoader();

    let obs$ = from(
      new Promise((res, rej) => {
        textureLoader.load(this.textureURL, (texture) => {
          let material = new MeshBasicMaterial({ map: texture });
          assetLoader.load(this.geometryURL, (obj) => {
            this.meshGroup = obj;
            helper.scene.add(obj);
            obj.traverse((child) => {
              if (child instanceof Mesh) {
                child.material = material;
              }
            });
            helper.objs.push(this);
            res(this.getMesh());
          });
        });
      })
    );
    return obs$;
  };

  addToPhysicsWorld = (helper: WMLThreeParams) => {
    if (helper.world) {
      this.createPhysBodyFromMesh(helper);
      this.createContactPhysics(helper);
      this.isWorldPart = true;
      if (helper.guiControlsIsPresent) {
        let folder = helper.gui.addFolder(this.guiName + '_Physics');
        ['x', 'y', 'z'].forEach((val) => {
          folder
            .add(this.physBody.position, val, -100, 100)
            .name('position ' + val);
        });
        ['x', 'y', 'z', 'w'].forEach((val) => {
          folder
            .add(this.physBody.quaternion, val, -1, 1)
            .name('quaternion ' + val);
        });
        folder.open();
      }
    }
  };
}
