import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthmap from "./assets/earthmap-high.jpg";
import circle from "./assets/circle.png";
import { parseTleFile, getPositionFromTle } from "./tle";
import { earthRadius } from "satellite.js/lib/constants";
// import color_palette from "../Model/ModelDetails/ColorPalette";
import color_palette from './satColorPalette';
import axios from "axios";

const SatelliteSize = 50;
const ixpdotp = 1440 / (2.0 * 3.141592654);

let TargetDate = new Date();

const defaultOptions = {
  backgroundColor: 0x1C2530,
  defaultSatelliteColor: 0xff0000,
  onStationClicked: null,
};

const defaultStationOptions = {
  orbitMinutes: 0,
  satelliteSize: 75, // default = 50
};

export class Engine {
  stations = [];

  initialize(container, options = {}) {
    this.el = container;
    this.raycaster = new THREE.Raycaster();
    this.options = { ...defaultOptions, ...options };

    console.log("this.options: ", this.options);
    this._setupScene();
    this._setupLights();
    this._addBaseObjects();

    this.render();

    window.addEventListener("resize", this.handleWindowResize);
    // window.addEventListener("mousedown", this.handleMouseDown);
  }

  dispose() {
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("resize", this.handleWindowResize);
    //window.cancelAnimationFrame(this.requestID);

    this.raycaster = null;
    this.el = null;

    this.controls.dispose();
  }

  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width / 4, height / 4);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.render();
  };

  handleMouseDown = (e) => {
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);

    let station = null;

    var intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects && intersects.length > 0) {
      const picked = intersects[0].object;
      if (picked) {
        station = this._findStationFromMesh(picked);
      }
    }

    const cb = this.options.onStationClicked;
    if (cb) cb(station);
  };

  // __ API _________________________________________________________________

  addSatellite = (station, color, size) => {
    // console.log('color: ', color)
    //const sat = this._getSatelliteMesh(color, size);
    const sat = this._getSatelliteSprite(color, size);
    const pos = this._getSatellitePositionFromTle(station);
    if (!pos) return;
    //const pos = { x: Math.random() * 20000 - 10000, y: Math.random() * 20000 - 10000 , z: Math.random() * 20000 - 10000, }

    sat.position.set(pos.x, pos.y, pos.z);
    station.mesh = sat;

    this.stations.push(station);

    if (station.orbitMinutes > 0) this.addOrbit(station);
    // sat.material.color.set( Math.random() * 0xffffff )
    this.earth.add(sat);
  };

  loadLteFileStations = (url, color, stationOptions, rawChartData) => {
    const options = { ...defaultStationOptions, ...stationOptions };
    return fetch(url).then((res) => {
      // return res.text().then(text => {
      //     return this._addTleFileStations(text, color, options);
      // });
      if (res.ok) {
        return res.text().then((text) => {
        console.log('rawChartData: ', rawChartData)
          return this._addTleFileStations(text, color, options, rawChartData);
        });
      }
    });
  };

  addOrbit = (station) => {
    console.log('newSelected add orbit: ', station)
    if (station.orbitMinutes > 0 || !station.satrec) return;
    const revsPerDay = station.satrec.no * ixpdotp;
    const intervalMinutes = 1;
    const minutes = station.orbitMinutes || 1440 / revsPerDay;
    const initialDate = new Date();

    //console.log('revsPerDay', revsPerDay, 'minutes', minutes);

    if (!this.orbitMaterial) {
      this.orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xFF0000,
        opacity: 1.0,
        transparent: true,
        lineWidth: 1,
        linecap: 'square'
      });
    }

    this.orbitMaterial.linewidth = 5.5
    var geometry = new THREE.Geometry();

    for (var i = 0; i <= minutes; i += intervalMinutes) {
      const date = new Date(initialDate.getTime() + i * 60000);

      const pos = getPositionFromTle(station, date);
      if (!pos) continue;

      geometry.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }

    console.log('this.orbitMaterial: ', this.orbitMaterial);
    var orbitCurve = new THREE.Line(geometry, this.orbitMaterial);
    station.orbit = orbitCurve;
    station.mesh.material = this.selectedMaterial;

    this.earth.add(orbitCurve);
    this.render();
  };

  removeOrbit = (station) => {
    console.log('newSelected delete orbit: ', station)
    if (!station || !station.orbit) return;

    this.earth.remove(station.orbit);
    station.orbit.geometry.dispose();
    station.orbit = null;
    station.mesh.material = this.material;
    this.render();
  };

  _addTleFileStations = (
    lteFileContent,
    color,
    stationOptions,
    rawChartData
  ) => {
    const stations = parseTleFile(lteFileContent, stationOptions);

    console.log('rawChartData: ', rawChartData)
    const { satelliteSize } = stationOptions;

    function getCorsFreeUrl(url) {
      // return 'https://cors-anywhere.herokuapp.com/' + url;
      return "https://api.allorigins.win/raw?url=" + url;
    }

        const formattedData = axios
        .get(getCorsFreeUrl("https://spacetest.azurewebsites.net/data"))
        .then((response) => {
          return response.data;
        });
  
      formattedData.then((res) => {
        console.log("res: ", res);
        let filteredRes;
        let filteredSatellites;
        console.log('this.earth: ', this.earth)
        if (rawChartData.selectedClusters.length > 0) {
            for( var i = this.earth.children.length - 1; i >= 0; i--) { 
                let obj = this.earth.children[i];
                if (obj.type === 'Sprite') {
                    this.earth.remove(obj); 
                }
           }
        //     console.log('real rawChartData: ', rawChartData.selectedClusters)
            filteredRes = res.filter((d) => rawChartData.selectedClusters.includes(d.clusters)).map((sat) => sat.OBJECT_NAME)
            console.log('real filteredRes: ', filteredRes)
            stations.forEach((s) => {

                if (filteredRes.includes(s.name)) {
                    let targetSatellite = res.filter(
                        (satellite) => satellite.OBJECT_NAME === s.name
                      );
                      console.log('targetSatellite: ', targetSatellite)
                      if (targetSatellite) {
                        this.addSatellite(s, color_palette[targetSatellite[0].clusters], satelliteSize);
                      }
                //   let cluster = targetSatellite[0].clusters;
                }
              });
        } else {
            filteredRes = res
            console.log("stations: ", stations);
            stations.forEach((s) => {
              let targetSatellite = filteredRes.filter(
                (satellite) => satellite.OBJECT_NAME === s.name
              );
              if (targetSatellite.length > 0) {
                let cluster = targetSatellite[0].clusters;
                this.addSatellite(s, color_palette[cluster], satelliteSize);
              }
            });
        }

  
        this.render();
      });

    return stations;

  };

  _getSatelliteMesh = (color, size) => {
    color = color || this.options.defaultSatelliteColor;
    size = size || SatelliteSize;

    if (!this.geometry) {
      this.geometry = new THREE.BoxBufferGeometry(size, size, size);
      this.material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: 0xff4040,
        flatShading: false,
        side: THREE.DoubleSide,
      });
    }

    return new THREE.Mesh(this.geometry, this.material);
  };

  newColor;
  _getSatelliteSprite = (color, size) => {
    const SpriteScaleFactor = 10000;
    // console.log('color: ', color)
    if (color !== this.newColor) {
      this._satelliteSprite = new THREE.TextureLoader().load(
        circle,
        this.render
      );

      this.selectedMaterial = new THREE.SpriteMaterial({
        map: this._satelliteSprite,
        color: 0xff0000,
        sizeAttenuation: false,
      });
      this.newColor = color;
      this.material = new THREE.SpriteMaterial({
        map: this._satelliteSprite,
        color: color,
        sizeAttenuation: false,
      });
    }

    // console.log('this.material: ', this.material)
    
    const result = new THREE.Sprite(this.material);
    result.scale.set(size / SpriteScaleFactor, size / SpriteScaleFactor, 1);
    return result;
  };

  _getSatellitePositionFromTle = (station, date) => {
    date = date || TargetDate;
    return getPositionFromTle(station, date);
  };

  updateSatellitePosition = (station, date) => {
    date = date || TargetDate;

    const pos = getPositionFromTle(station, date);
    if (!pos) return;

    station.mesh.position.set(pos.x, pos.y, pos.z);
  };

  updateAllPositions = (date) => {
    if (!this.stations) return;

    this.stations.forEach((station) => {
      this.updateSatellitePosition(station, date);
    });

    this.render();
  };

  // __ Scene _______________________________________________________________

  _setupScene = () => {
    const width = this.innerWidth;
    const height = this.innerHeight;

    this.scene = new THREE.Scene();

    this._setupCamera(width, height);

    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
    });

    this.renderer.setClearColor(new THREE.Color(this.options.backgroundColor));
    this.renderer.setSize(width / 2, height / 2);

    this.el.appendChild(this.renderer.domElement);

    this.renderer.setSize(width / 2, height / 2);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.render();
  };

  _setupCamera(width, height) {
    var NEAR = 1e-6,
      FAR = 1e27;
    this.camera = new THREE.PerspectiveCamera(54, width / height, NEAR, FAR);
    this.controls = new OrbitControls(this.camera, this.el);
    //this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.addEventListener("change", () => this.render());
    this.camera.position.z = -15000;
    this.camera.position.x = 15000;
    this.camera.lookAt(0, 0, 0);
  }

  _setupLights = () => {
    const sun = new THREE.PointLight(0xffffff, 1, 0);
    //sun.position.set(0, 0, -149400000);
    sun.position.set(0, 59333894, -137112541);

    const ambient = new THREE.AmbientLight(0x909090);

    this.scene.add(sun);
    this.scene.add(ambient);
  };

  _addBaseObjects = () => {
    this._addEarth();
  };

  render = () => {
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
    //this.requestID = window.requestAnimationFrame(this._animationLoop);
  };

  // __ Scene contents ______________________________________________________

  _addEarth = () => {
    const textLoader = new THREE.TextureLoader();

    const group = new THREE.Group();

    // Planet
    let geometry = new THREE.SphereGeometry(earthRadius, 50, 50);
    let material = new THREE.MeshPhongMaterial({
      //color: 0x156289,
      //emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: false,
      map: textLoader.load(earthmap, this.render),
    });

    const earth = new THREE.Mesh(geometry, material);
    group.add(earth);

    // // Axis
    // material = new THREE.LineBasicMaterial({color: 0xffffff});
    // geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //     new THREE.Vector3(0, -7000, 0),
    //     new THREE.Vector3(0, 7000, 0)
    // );

    // var earthRotationAxis = new THREE.Line(geometry, material);
    // group.add(earthRotationAxis);

    this.earth = group;
    this.scene.add(this.earth);
  };

  _findStationFromMesh = (threeObject) => {
    for (var i = 0; i < this.stations.length; ++i) {
      const s = this.stations[i];

      if (s.mesh === threeObject) return s;
    }

    return null;
  };
}
