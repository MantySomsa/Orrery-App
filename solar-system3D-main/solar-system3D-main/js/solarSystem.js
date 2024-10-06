// Import necessary modules
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import TWEEN from "https://unpkg.com/@tweenjs/tween.js@18.6.4/dist/tween.esm.js"; // Corrected import for TWEEN
import { EffectComposer } from "https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/UnrealBloomPass.js";

//////////////////////////////////////
const orbitalParams = {
  Mercury: { a: 57.91, e: 0.2056, period: 88 }, // a in million km, period in days
  Venus: { a: 108.21, e: 0.0067, period: 224.7 },
  Earth: { a: 149.6, e: 0.0167, period: 365.25 },
  Mars: { a: 227.92, e: 0.0934, period: 687 },
  Jupiter: { a: 778.57, e: 0.0484, period: 4331 },
  Saturn: { a: 1427.0, e: 0.0565, period: 10747 },
  Uranus: { a: 2871.0, e: 0.0463, period: 30589 },
  Neptune: { a: 4497.1, e: 0.0102, period: 59800 },
  Pluto: { a: 5906.4, e: 0.2488, period: 90560 },
};

// NOTE Creating renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const bloomScene = new THREE.Scene();
const apiKey = "iDmtQgAoGNSW2J4QfR5XqKjXeFWWi0gh5GoRywNQ"; // Replace with your actual NASA API key
const apiUrl = "https://api.le-systeme-solaire.net/rest/bodies/";

async function fetchPlanetData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.bodies.filter((planet) => planet.isPlanet);
  } catch (error) {
    console.error("Error fetching planet data:", error);
    return [];
  }
}

async function init() {
  const planetsInfo = await fetchPlanetData(); // Assuming this is fetching your 'planets' array
  createAsteroidBelt(260, 550);
  createAsteroidBelt(150, 60);
  createAsteroidBelt(130, 80);
  createAsteroidBelt(90, 100);

  // Set up the initial display for planet name or other data if needed
  document.getElementById("planetName").innerText = planetsInfo[0].name;

  // Event listener for the Encyclopedia button
  document.getElementById("encyclopediaBtn").addEventListener("click", () => {
    const planet = planetsInfo[0]; // Assuming you want to display the first planet, adjust as needed
    const size = planet.diameter; // in km
    const gravitationalPull = planet.gravity; // in m/s²
    const distanceFromSun = planet.distanceFromSun; // in arbitrary units or AU
    document.getElementById("encyclopediaInfo").style.display = "block"; // Show the info panel
    document.getElementById("planetDiameter").innerText = size + " km";
    document.getElementById("planetMass").innerText =
      planet.mass + " x 10^24 kg";
    document.getElementById("planetGravity").innerText =
      gravitationalPull + " m/s²";
    document.getElementById("planetDistance").innerText =
      distanceFromSun + " AU";

    ///////////////////////////////////////
    const planetName = document.getElementById("planetName").innerText; // Get the selected planet's name
    const planetFactSearch = planetFacts.find((p) => p.name === planetName); // Find the corresponding planet in planetFacts

    if (planetFactSearch && planetFactSearch.facts) {
      const planetFactsElement = document.getElementById("planetFacts");
      planetFactsElement.innerHTML = ""; // Clear any previous facts

      // Loop through the facts and display them
      planetFactSearch.facts.forEach((fact) => {
        const paragraph = document.createElement("p"); // Creating a paragraph instead of <li>
        paragraph.innerText = fact;
        planetFactsElement.appendChild(paragraph); // Append to planetFactsElement
      });
    }

    // Hide the button container
    document.querySelector(".button-container").style.display = "none";
  });

  // Event listener for the Structure button
  document.getElementById("structureBtn").addEventListener("click", () => {
    const planetName = document.getElementById("planetName").innerText; // Get the selected planet's name
    const planet = planet_desc.find((p) => p.name === planetName); // Find the corresponding planet in planet_desc

    if (planet && planet.structureLayers) {
      const structureDisplay = document.getElementById("layers");
      structureDisplay.innerHTML = ""; // Clear any previous structure info

      // Loop through the structure layers and display them
      planet.structureLayers.forEach((layer) => {
        const paragraph = document.createElement("li");
        paragraph.innerText = layer;
        structureDisplay.appendChild(paragraph);
      });

      // Show the structure display and its layers
      document.getElementById("structureDisplay").style.display = "block";
      document.querySelector(".button-container").style.display = "none";
    }
  });

  // Event listener for the close button

  document.getElementById("closeInfo").addEventListener("click", () => {
    document.getElementById("encyclopediaInfo").style.display = "none"; // Hide the info panel
    document.getElementById("structureDisplay").style.display = "none"; // Hide the info panel
    document.querySelector(".button-container").style.display = "flex"; // Show the buttons again
  });
}

// Call the init function to set everything up
init();

// NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
// NOTE import all textures
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/2k_mercury.jpg");
const venusTexture = textureLoader.load("./image/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const cloudTextureUrl = textureLoader.load("./image/8k_earth_clouds.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");

//////////////////////////////////////

//////////////////////////////////////
// NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
// NOTE screen background
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
// NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
//////////////////////////////////////

//////////////////////////////////////
// NOTE Orbit Controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true; // Enable damping for smoother controls
//////////////////////////////////////

//////////////////////////////////////
// NOTE - Sun

const composer = new EffectComposer(renderer);

// RenderPass: Renders the scene
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// UnrealBloomPass: Adds bloom effect
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), // resolution
  6, // strength
  0.4, // radius
  0.9 // threshold
);
composer.addPass(bloomPass);

const sungeo = new THREE.SphereGeometry(15, 64, 64); // Increased segments for smoother appearance

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
  emissive: 0xffffff, // Makes the sun emit light
  emissiveIntensity: 1, // Intensity of the emission
});

const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

//////////////////////////////////////

//////////////////////////////////////
// NOTE - Sun light (Point Light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
// NOTE - Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Default to low intensity
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - Path for planets
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Increased from 50 to 100 for smoother appearance
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}

//////////////////////////////////////

//////////////////////////////////////
// NOTE: Create planet with detailed userData
const generatePlanet = (
  size,
  planetTexture,
  x,
  ring,
  name,
  diameter,
  mass,
  gravity,
  cloudTexture
) => {
  const planetGeometry = new THREE.SphereGeometry(size, 64, 64);
  const planetMaterial = new THREE.MeshBasicMaterial({
    map: planetTexture,
  });

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.userData = {
    type: "planet",
    name: name,
    diameter: diameter,
    mass: mass,
    gravity: gravity,
    distanceFromSun: x,
  };

  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  planetObj.add(planet);

  // Add additional code for rings and clouds...

  scene.add(planetObj);
  createLineLoopWithMesh(x, 0xffffff, 3);

  return {
    planetObj: planetObj,
    planet: planet,
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  };
};

const planet_desc = [
  {
    name: "Mercury",
    structureLayers: [
      "Crust: Mercury's crust is made of silicate minerals, forming a thin rocky outer layer.",
      "Mantle: Beneath the crust, Mercury has a silicate mantle, which is much thinner compared to Earth's mantle.",
      "Core: Mercury's core is massive for its size, consisting primarily of iron and nickel, making up about 85% of the planet's radius.",
    ],
  },
  {
    name: "Venus",
    structureLayers: [
      "Crust: Venus has a basaltic crust made up of volcanic rock.",
      "Mantle: The mantle is composed of silicate materials, where convective currents might be driving volcanic activity.",
      "Core: Venus likely has a core of iron and nickel, similar to Earth's, though its exact size and state are not fully known.",
    ],
  },
  {
    name: "Earth",
    structureLayers: [
      "Crust: Earth's outer layer, consisting of continental and oceanic plates, rich in silicates and metals.",
      "Mantle: Made of semi-solid silicate rock, the mantle moves slowly, driving plate tectonics.",
      "Outer Core: A liquid layer composed mostly of molten iron and nickel, responsible for Earth's magnetic field.",
      "Inner Core: The solid innermost part of Earth, composed primarily of iron and nickel.",
    ],
  },
  {
    name: "Mars",
    structureLayers: [
      "Crust: Mars has a thin crust made of iron, magnesium, aluminum, and calcium silicate minerals.",
      "Mantle: The mantle of Mars consists of silicate rock with a less active tectonic system than Earth's.",
      "Core: Mars likely has a solid iron-nickel core, though its size and composition are not fully understood.",
    ],
  },
  {
    name: "Jupiter",
    structureLayers: [
      "Cloud Layers: Jupiter's outer layer is composed of thick clouds of hydrogen, helium, and trace gases.",
      "Metallic Hydrogen Layer: Underneath the clouds, Jupiter has a layer of liquid metallic hydrogen, creating its strong magnetic field.",
      "Core: The core is hypothesized to be a dense mixture of rock, metal, and hydrogen compounds.",
    ],
  },
  {
    name: "Saturn",
    structureLayers: [
      "Cloud Layers: Saturn's outer layer consists of hydrogen and helium clouds with some traces of methane and ammonia.",
      "Metallic Hydrogen Layer: Below the atmosphere, Saturn has a layer of liquid metallic hydrogen.",
      "Core: Saturn's core is likely composed of rock and metal, surrounded by icy materials.",
    ],
  },
  {
    name: "Uranus",
    structureLayers: [
      "Atmosphere: Uranus' outer atmosphere consists of hydrogen, helium, and methane, giving it a blue-green color.",
      "Icy Mantle: Beneath the atmosphere, there's a mantle of water, ammonia, and methane ices.",
      "Core: Uranus likely has a small, rocky core made of silicate and metals.",
    ],
  },
  {
    name: "Neptune",
    structureLayers: [
      "Atmosphere: Neptune has a thick atmosphere composed of hydrogen, helium, and methane.",
      "Icy Mantle: The planet's mantle is made of water, ammonia, and methane ices.",
      "Core: Neptune likely has a rocky core, similar to Uranus, surrounded by dense ices.",
    ],
  },
  {
    name: "Pluto",
    structureLayers: [
      "Surface Ice: Pluto's outer layer consists of nitrogen, methane, and carbon monoxide ices.",
      "Rocky Mantle: Beneath the icy surface, Pluto has a rocky mantle.",
      "Core: Pluto's core is thought to be composed of silicate rock.",
    ],
  },
];

const planetFacts = [
  {
    name: "Mercury",
    facts: [
      "- Mercury is the smallest planet in the solar system and the closest to the Sun, yet it has ice in permanently shadowed craters near its poles.",
      "- It has no atmosphere to retain heat, so temperatures can reach as high as 430°C (800°F) during the day and plummet to -180°C (-290°F) at night.",
      "- A day on Mercury (one full rotation) takes 59 Earth days, but it takes just 88 Earth days to complete one orbit around the Sun.",
    ],
  },
  {
    name: "Venus",
    facts: [
      "- Venus is the hottest planet in the solar system, with surface temperatures reaching up to 465°C (900°F), hotter than Mercury, despite being further from the Sun.",
      "- Its thick, toxic atmosphere of carbon dioxide traps heat in a runaway greenhouse effect, while clouds of sulfuric acid make it inhospitable to life as we know it.",
      "- A day on Venus is longer than a year, as it takes about 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
    ],
  },
  {
    name: "Mars",
    facts: [
      "- Mars, known as the 'Red Planet,' gets its reddish appearance from iron oxide (rust) on its surface.",
      "- It has the largest volcano in the solar system, Olympus Mons, which stands at 22 km (13.6 miles) high, almost three times the height of Mount Everest.",
      "- Mars has seasons, polar ice caps, and weather patterns similar to Earth, but its thin atmosphere is primarily carbon dioxide.",
    ],
  },
  {
    name: "Jupiter",
    facts: [
      "- Jupiter is the largest planet in the solar system and has a mass over 300 times that of Earth, with a volume that could fit more than 1,300 Earths inside it.",
      "- Its Great Red Spot is a massive storm system, larger than Earth, that has been raging for at least 400 years.",
      "- Jupiter has at least 79 moons, with four large ones (Io, Europa, Ganymede, and Callisto) known as the Galilean moons.",
    ],
  },
  {
    name: "Saturn",
    facts: [
      "- Saturn is famous for its spectacular ring system, made up of ice and rock particles, some as small as grains of sand and others as large as mountains.",
      "- It is the second largest planet in the solar system, and like Jupiter, it is a gas giant composed mainly of hydrogen and helium.",
      "- Saturn has 83 moons, and its largest moon, Titan, is bigger than the planet Mercury and has a thick atmosphere.",
    ],
  },
  {
    name: "Uranus",
    facts: [
      "- Uranus is unique among the planets because it rotates on its side, with its axis tilted by about 98 degrees, likely due to a massive collision early in its history.",
      "- It is often called an 'ice giant' because its atmosphere contains water, ammonia, and methane ices, giving it a blue-green color.",
      "- Uranus has 13 faint rings and at least 27 known moons, all named after characters from the works of William Shakespeare and Alexander Pope.",
    ],
  },
  {
    name: "Neptune",
    facts: [
      "- Neptune is the most distant planet in the solar system and is known for its deep blue color, caused by methane in its atmosphere.",
      "- It has the strongest winds of any planet, with speeds exceeding 2,100 kilometers per hour (1,300 mph).",
      "- Neptune has 14 moons, the largest of which, Triton, is thought to be a captured object from the Kuiper Belt.",
    ],
  },
  {
    name: "Pluto",
    facts: [
      "- Although classified as a dwarf planet, Pluto has five moons, with its largest moon, Charon, being so large that the two bodies are sometimes considered a binary system.",
      "- Pluto's surface is composed mainly of nitrogen, methane, and carbon monoxide ice, and it has a very thin atmosphere that expands and contracts depending on its distance from the Sun.",
      "- A day on Pluto lasts about 153 hours, and it takes 248 Earth years to complete one orbit around the Sun.",
    ],
  },
];

const planets = [
  {
    ...generatePlanet(
      3.2,
      mercuryTexture,
      28,
      null,
      "Mercury",
      4879,
      0.33,
      3.7
    ),
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...generatePlanet(5.8, venusTexture, 44, null, "Venus", 12104, 4.87, 8.87),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...generatePlanet(
      6,
      earthTexture,
      62,
      null,
      "Earth",
      12742,
      5.97,
      9.807,
      cloudTextureUrl
    ),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...generatePlanet(4, marsTexture, 78, null, "Mars", 6779, 0.642, 3.711),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...generatePlanet(
      12,
      jupiterTexture,
      100,
      null,
      "Jupiter",
      139820,
      1898,
      24.79
    ),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...generatePlanet(
      10,
      saturnTexture,
      138,
      {
        innerRadius: 10,
        outerRadius: 20,
        ringmat: saturnRingTexture,
      },
      "Saturn",
      116460,
      568,
      10.44
    ),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...generatePlanet(
      7,
      uranusTexture,
      176,
      {
        innerRadius: 7,
        outerRadius: 12,
        ringmat: uranusRingTexture,
      },
      "Uranus",
      50724,
      86.8,
      8.69
    ),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...generatePlanet(
      7,
      neptuneTexture,
      200,
      null,
      "Neptune",
      49244,
      102,
      11.15
    ),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
  {
    ...generatePlanet(2.8, plutoTexture, 216, null, "Pluto", 2376, 0.013, 0.62),
    rotaing_speed_around_sun: 0.0007,
    self_rotation_speed: 0.008,
  },
];
//////////////////////////////////////
// NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 0.4,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms") * 1;
gui.add(options, "speed", 0.4, maxSpeed ? maxSpeed : 20);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - Raycaster and Mouse Vector for Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Store selected planet to manage its state
let selectedPlanet = null;

// Double-click event listener
window.addEventListener("dblclick", onDoubleClick, false);

// Info Panel Elements
const infoPanel = document.getElementById("infoPanel");
const planetNameElem = document.getElementById("planetName");
const planetDiameterElem = document.getElementById("planetDiameter");
const planetMassElem = document.getElementById("planetMass");
const planetGravityElem = document.getElementById("planetGravity");
const planetDistanceElem = document.getElementById("planetDistance");
const closeInfoButton = document.getElementById("closeInfo");

// Close Info Panel
closeInfoButton.addEventListener("click", () => {
  infoPanel.style.display = "none";

  // Resume planet rotation
  if (selectedPlanet) {
    selectedPlanet.rotaing_speed_around_sun =
      selectedPlanet.original_rotaing_speed_around_sun;
    selectedPlanet.self_rotation_speed =
      selectedPlanet.original_self_rotation_speed;
    selectedPlanet = null;
  }

  // Re-enable orbit controls
  orbit.enabled = true; // Ensure that controls are re-enabled
});

// Define the asteroid textures
const asteroidTextures = [
  new THREE.TextureLoader().load("./image/photo-stone-texture-pattern.jpg"),
  new THREE.TextureLoader().load("./image/photo-stone-texture-pattern.jpg"),
  // add more textures as needed
];

// Function to create a random asteroid
function createAsteroid() {
  const geometries = [
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.DodecahedronGeometry(1),
    new THREE.SphereGeometry(1, 5, 5),
    new THREE.BoxGeometry(1, 1, 1),
  ];

  // Choose random geometry and scale it randomly
  const geometry = geometries[Math.floor(Math.random() * geometries.length)];
  const scale = Math.random() * 0.3 + 0.1; // random size
  geometry.scale(scale, scale, scale);

  // Choose a random texture for each asteroid
  const texture =
    asteroidTextures[Math.floor(Math.random() * asteroidTextures.length)];
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // Create the mesh
  const asteroid = new THREE.Mesh(geometry, material);

  return asteroid;
}

// Function to position asteroids in a circular ring outside the solar system
function createAsteroidBelt(asteroidRadius, asteroidNum) {
  const asteroidBeltRadius = asteroidRadius; // 250 Set a radius for the asteroid belt
  const numAsteroids = asteroidNum; // 550 Number of asteroids in the belt
  const asteroidMinSize = 0.3;
  const asteroidMaxSize = 1.9;

  for (let i = 0; i < numAsteroids; i++) {
    const asteroidSize =
      Math.random() * (asteroidMaxSize - asteroidMinSize) + asteroidMinSize;
    const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);

    // Randomly choose a texture from the asteroidTextures array
    const randomTexture =
      asteroidTextures[Math.floor(Math.random() * asteroidTextures.length)];
    const asteroidMaterial = new THREE.MeshBasicMaterial({
      map: randomTexture,
    }); // Apply texture instead of color

    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    // Randomly position the asteroid around a circular orbit
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distanceFromCenter = asteroidBeltRadius + (Math.random() - 0.5) * 20; // Randomize distance a bit
    const x = distanceFromCenter * Math.cos(angle);
    const z = distanceFromCenter * Math.sin(angle);
    asteroid.position.set(x, (Math.random() - 0.5) * 10, z); // Add a bit of random height as well

    scene.add(asteroid);
  }
}

// Call the function to add the asteroid belt

// Adding stars
function createStars() {
  const starGeometry = new THREE.SphereGeometry(0.1, 8, 8); // Small sphere for stars
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color for stars

  const starField = new THREE.Group(); // Create a group to hold all stars

  const numberOfStars = 5000; // Number of stars to create
  for (let i = 0; i < numberOfStars; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Set random position for each star within a certain range
    star.position.set(
      (Math.random() - 0.5) * 1000, // X position
      (Math.random() - 0.5) * 1000, // Y position
      (Math.random() - 0.5) * 1000 // Z position
    );

    starField.add(star); // Add star to the star field group
  }

  scene.add(starField); // Add the star field group to the scene
}

// Call the createStars function to add stars to the scene
createStars();

// Function to handle double-click
function onDoubleClick(event) {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planets.map((p) => p.planet));

  if (intersects.length > 0) {
    const planetMesh = intersects[0].object;

    // Prevent multiple selections
    if (selectedPlanet) {
      // Resume rotation of previously selected planet
      selectedPlanet.rotaing_speed_around_sun =
        selectedPlanet.original_rotaing_speed_around_sun;
      selectedPlanet.self_rotation_speed =
        selectedPlanet.original_self_rotation_speed;
    }

    // Store original speeds
    selectedPlanet = planets.find((p) => p.planet === planetMesh);
    selectedPlanet.original_rotaing_speed_around_sun =
      selectedPlanet.rotaing_speed_around_sun;
    selectedPlanet.original_self_rotation_speed =
      selectedPlanet.self_rotation_speed;

    // Stop planet rotation
    selectedPlanet.rotaing_speed_around_sun = 0;
    selectedPlanet.self_rotation_speed = 0;

    // Zoom into the planet by repositioning the camera
    zoomIntoPlanet(planetMesh);

    // Display planet info
    displayPlanetInfo(planetMesh.userData);
  }
}

// SCALE UP HOVER OVER
// Create an empty variable to hold the current hovered planet
let hoveredPlanet = null;
const planetMeshes = planets.map((planet) => planet.planet); // Extract only the mesh
let hoverCircles = {}; // Object to hold hover circles for each planet

// Add an event listener for mouse movements
window.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  // Convert the mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function update() {
  raycaster.setFromCamera(mouse, camera); // Assuming you have mouse coordinates set
  const intersects = raycaster.intersectObjects(planetMeshes); // Use the array of meshes

  // Remove any existing circles
  for (const key in hoverCircles) {
    scene.remove(hoverCircles[key]);
  }
  // Reset hover circles
  for (const key in hoverCircles) {
    scene.remove(hoverCircles[key]);
  }
  hoverCircles = {};

  if (intersects.length > 0) {
    const intersectedPlanet = intersects[0].object;

    if (hoveredPlanet !== intersectedPlanet) {
      // Reset the scale of the previously hovered planet
      if (hoveredPlanet) {
        hoveredPlanet.scale.set(1, 1, 1);
      }

      hoveredPlanet = intersectedPlanet;
      hoveredPlanet.scale.set(1.05, 1.05, 1.05); // Scale up the hovered planet

      // Create a hover circle
      const hoverCircle = createHoverCircle(1.2); // Adjust the radius as needed
      hoverCircle.position.copy(hoveredPlanet.position);
      hoverCircle.position.y += 0.01; // Adjust slightly above the planet
      scene.add(hoverCircle);
      hoverCircles[hoveredPlanet.userData.name] = hoverCircle; // Store the hover circle
    }
  } else {
    // Reset scale and hover state if nothing is hovered
    if (hoveredPlanet) {
      hoveredPlanet.scale.set(1, 1, 1);
      hoveredPlanet = null;
    }
  }

  // Continue with your animation loop...
  requestAnimationFrame(update);
}

const createHoverCircle = (radius) => {
  const circleGeometry = new THREE.CircleGeometry(radius, 32); // Circle with 32 segments
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    opacity: 0.5, // Semi-transparent
    transparent: true,
  });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.rotation.x = Math.PI / 2; // Rotate to lie flat on the ground
  return circle;
};

// Call the update function to start the animation loop
update();

// Function to zoom into a planet
function zoomIntoPlanet(planet) {
  const targetPosition = new THREE.Vector3();
  planet.getWorldPosition(targetPosition);

  const direction = new THREE.Vector3()
    .subVectors(camera.position, targetPosition)
    .normalize();

  const newCameraPosition = targetPosition
    .clone()
    .add(direction.multiplyScalar(30));

  new TWEEN.Tween(camera.position)
    .to(newCameraPosition, 1000) // 1000 ms for the zoom
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}
orbit.enabled = true; // Re-enable orbit controls

// Function to display planet info
function displayPlanetInfo(data) {
  planetNameElem.innerText = data.name;
  planetDiameterElem.innerText = data.diameter;
  planetMassElem.innerText = data.mass;
  planetGravityElem.innerText = data.gravity;
  planetDistanceElem.innerText = data.distanceFromSun;

  infoPanel.style.display = "block";
}

//////////////////////////////////////
// NOTE - Animate function with bloom
function animate(time) {
  // Rotate the sun
  sun.rotateY(options.speed * 0.004);

  // Rotate all planets
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );

  // Update TWEEN animations
  TWEEN.update();

  // Update OrbitControls
  orbit.update();

  // Render the scene with post-processing
  composer.render();

  // Continue the animation loop
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
//////////////////////////////////////

// Get the "GO BACK" button, the encyclopedia info div, and the button container
const goBackBtnEncylopedia = document.getElementById("goBackBtnEncyclopedia");
const gobackBtnStructure = document.getElementById("goBackBtnStructure");
const encyclopediaInfo = document.getElementById("encyclopediaInfo");
const buttonContainer = document.querySelector(".button-container");

// Function to show the main buttons and hide the encyclopedia info
function handleGoBack() {
  // Hide encyclopedia info
  encyclopediaInfo.style.display = "none";
  document.getElementById("structureDisplay").style.display = "none"; // Hide the info panel

  // Show the main button panel (with PLANET SYSTEM, ENCYCLOPEDIA, STRUCTURE, etc.)
  buttonContainer.style.display = "flex";
}

// Attach the "GO BACK" button click event
goBackBtnEncylopedia.addEventListener("click", handleGoBack);
gobackBtnStructure.addEventListener("click", handleGoBack);

//////////////////////////////////////
// NOTE - Resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////

// QUIZ
let userCoins = 0;
let currentQuestionIndex = 0;
let quizQuestions = [];

// Function to ask if the user wants to take a quiz
function askQuiz() {
  if (confirm("Do you want to take a quiz?")) {
    startQuiz();
  } else {
    return; // Go back to the original place
  }
}

// Function to start the quiz
async function startQuiz() {
  const selectedPlanet = document.getElementById("planetName").innerText;
  const planetData = await getPlanetData(selectedPlanet);

  quizQuestions = generateQuestions(planetData);
  currentQuestionIndex = 0;
  userCoins = 0;

  document.querySelector(".button-container").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";

  displayQuestion();
}

// Function to fetch planet data from NASA's API
async function getPlanetData(planetName) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  const planet = data.bodies.find(
    (body) => body.englishName.toLowerCase() === planetName.toLowerCase()
  );
  return planet;
}

// Function to generate questions based on the planet data
function generateQuestions(planet) {
  return [
    {
      question: `What is the diameter of ${planet.englishName} in km?`,
      answer: planet.meanRadius * 2,
      options: [
        planet.meanRadius * 2,
        planet.meanRadius * 2 + 1000, // Incorrect option
        planet.meanRadius * 2 - 1000, // Incorrect option
      ],
    },
    {
      question: `What is the mass of ${planet.englishName} in kg?`,
      answer: planet.mass.massValue * 1e24,
      options: [
        planet.mass.massValue * 1e24,
        planet.mass.massValue * 1e24 + 1e24, // Incorrect option
        planet.mass.massValue * 1e24 - 1e24, // Incorrect option
      ],
    },
    {
      question: `What is the gravity on ${planet.englishName} in m/s²?`,
      answer: planet.gravity,
      options: [
        planet.gravity,
        planet.gravity + 2, // Incorrect option
        planet.gravity - 2, // Incorrect option
      ],
    },
    {
      question: `What is the distance of ${planet.englishName} from the Sun in km?`,
      answer: planet.semimajorAxis,
      options: [
        planet.semimajorAxis,
        planet.semimajorAxis + 1000000, // Incorrect option
        planet.semimajorAxis - 1000000, // Incorrect option
      ],
    },
    {
      question: `How many moons does ${planet.englishName} have?`,
      answer: planet.moons ? planet.moons.length : 0,
      options: [
        planet.moons ? planet.moons.length : 0,
        (planet.moons ? planet.moons.length : 0) + 1, // Incorrect option
        (planet.moons ? planet.moons.length : 0) - 1, // Incorrect option
      ],
    },
    // Add more questions as needed
  ].map((q) => {
    // Shuffle options for each question
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }
    q.options = shuffledOptions;
    return q;
  });
}

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  document.getElementById("quizQuestion").innerText = question.question;

  const answersContainer = document.getElementById("quizAnswers");
  answersContainer.innerHTML = ""; // Clear previous answers

  question.options.forEach((option) => {
    const answerButton = document.createElement("button");
    answerButton.innerText = option; // Use option directly as the text
    answerButton.onclick = () => checkAnswer(option === question.answer); // Compare option with correct answer
    answersContainer.appendChild(answerButton);
  });

  document.getElementById("nextQuestionBtn").style.display = "none"; // Hide the next button
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    userCoins++;
    alert("Correct! You earned a coin!");
  } else {
    alert("Wrong answer!");
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

// Function to end the quiz and display the results
function endQuiz() {
  alert(`Quiz completed! You earned ${userCoins} coins!`);

  // Store coins in local storage
  localStorage.setItem("userCoins", userCoins);

  // Optionally reset the quiz interface
  document.getElementById("quizContainer").style.display = "none"; // Hide quiz container
  document.querySelector(".button-container").style.display = "block"; // Show button container again
}

// Call the askQuiz function when the quiz button is clicked
document.getElementById("quizBtn").onclick = askQuiz;

// Load coins from local storage on page load
window.onload = () => {
  const storedCoins = localStorage.getItem("userCoins");
  userCoins = storedCoins ? parseInt(storedCoins, 10) : 0;
};

// Updates

const apiUrlNews = `https://api.nasa.gov/DONKI/CME?startDate=&endDate=&api_key=${apiKey}`;

// Function to fetch space news
async function fetchSpaceNews() {
  try {
    const response = await fetch(apiUrlNews, {
      method: "GET",
      redirect: "follow",
    });

    const newsData = await response.json();

    // Pick the first CME event and display its title and summary
    if (newsData.length > 0) {
      const latestNews = newsData[0];

      document.querySelector(".newsUpdate").innerHTML = `
        <strong>Event Time:</strong> ${latestNews.cmeAnalyses[0].time21_5}<br>
        <strong>Speed:</strong> ${latestNews.cmeAnalyses[0].speed} km/s<br>
        <strong>Is Earth Directed:</strong> ${
          latestNews.cmeAnalyses[0].isEarthDirected ? "Yes" : "No"
        }<br>
        <strong>Note:</strong> ${latestNews.note || "No additional information"}
      `;
    } else {
      document.querySelector(".newsUpdate").innerText =
        "No recent news available.";
    }
  } catch (error) {
    console.error("Error fetching space news:", error);
    document.querySelector(".newsUpdate").innerText = "Failed to load news.";
  }
}

// Call the function to load the news when the page loads
window.onload = () => {
  fetchSpaceNews();
};

// AI
export async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  const messagesDiv = document.getElementById("chatbotMessages");

  if (userInput.trim() === "") return;

  // Display user message
  const userMessage = document.createElement("p");
  userMessage.innerText = `You: ${userInput}`;
  messagesDiv.appendChild(userMessage);

  // Show a "thinking" message while waiting
  const botThinkingMessage = document.createElement("p");
  botThinkingMessage.innerText = "Bot is thinking...";
  messagesDiv.appendChild(botThinkingMessage);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userInput }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBUeiXPXthQePqcyqEcP3ySo6fG8Fqt7k4",
      options
    );
    const data = await response.json();

    botThinkingMessage.remove();

    if (data.candidates && data.candidates.length > 0) {
      const botMessage = document.createElement("p");
      botMessage.innerText = `Bot: ${data.candidates[0].content.parts[0].text}`;
      messagesDiv.appendChild(botMessage);
    } else {
      throw new Error("No candidates found in the response.");
    }
  } catch (error) {
    console.error("Error communicating with AI:", error);
    botThinkingMessage.remove();

    const errorMessage = document.createElement("p");
    errorMessage.innerText = "Bot: Error occurred, please try again.";
    messagesDiv.appendChild(errorMessage);
  }

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Add event listener for the send button
document.getElementById("sendBtn").addEventListener("click", sendMessage);
