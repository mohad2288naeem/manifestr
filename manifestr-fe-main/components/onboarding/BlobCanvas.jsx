import { useEffect, useRef, memo } from 'react'
import * as THREE from 'three'

// ============================================
// BLOB CONFIGURATION - Easy to adjust values
// ============================================
const BLOB_CONFIG = {
  // Noise/Displacement Properties
  frequency: 0.8,        // Controls the size of noise patterns (higher = smaller patterns)
  amplitude: 0.4,        // Controls the depth of displacement (higher = more deformation)

  // Color Properties
  colors: {
    color1: 0xffffff,   // Pure white
    color2: 0xf5f5f5,   // Very light grey
    color3: 0xe5e5e5,   // Light grey
    color4: 0xd4d4d4,   // Medium-light grey
    color5: 0xa3a3a3,   // Medium grey
    color6: 0xa3a3a3,   // Darker grey
  },
  colorsAngle: { x: 0.0, y: 0.0, z: -50.0 },  // Rotation angles for color segments
  colorSinusoidal: 0.5,  // Sinusoidal variation for color blending
  segmentColors: {
    segment1: 0.1,
    segment2: 0.1,
    segment3: 0.1,
    segment4: 0.1,
    segment5: 0.1,
    segment6: 0.1,
  },

  // Material Properties
  metallic: 1,        // Metallic value (0 = non-metallic, 1 = fully metallic)
  smoothness: 0.2,      // Surface smoothness (0 = rough, 1 = smooth)

  // Wiggle Properties (for interactive effects)
  wiggleFrequency: 1.5,  // Frequency of wiggle effect
  wiggleAmplitude: 1.5,  // Amplitude of wiggle effect
  wiggleSpeed: 15.0,     // Speed of wiggle animation

  // Lighting
  directionalLightIntensity: 1.5,  // Directional light intensity (main light source)
  ambientLightIntensity: 1.5,      // Ambient light intensity (fill light)
  lightIntensity: 1.2,              // Shader light intensity multiplier (controls overall brightness in shader)

  // Geometry
  blobRadius: 5.5,       // Base radius of the blob sphere (increased to make blob bigger)
  sphereSegments: 128,   // Number of segments for sphere geometry (higher = smoother but slower)
}

function BlobCanvas({ fullscreen = false, blobRadius = null, width = 320, height = 250, isAiSpeaking = false, disableHover = false, audioAnalyser = null, onHoverChange = null }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const animationFrameRef = useRef(null)
  const onHoverChangeRef = useRef(onHoverChange)

  // Update ref when prop changes
  useEffect(() => {
    onHoverChangeRef.current = onHoverChange
  }, [onHoverChange])

  useEffect(() => {
    if (!canvasRef.current) return


    const canvas = canvasRef.current
    const scene = new THREE.Scene()

    // Background transparent
    scene.background = null

    const sizes = {
      width: canvas.clientWidth,
      height: canvas.clientHeight
    }

    // Lights - Pure white directional light
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, BLOB_CONFIG.directionalLightIntensity)
    directionalLight1.position.set(5, 6, 5)
    directionalLight1.color.set(0xffffff) // Ensure pure white
    scene.add(directionalLight1)

    // Add additional ambient light for better illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, BLOB_CONFIG.ambientLightIntensity)
    scene.add(ambientLight)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0, 0, 10)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Transparent background

    // Use custom blobRadius if provided, otherwise use config
    const radius = blobRadius !== null ? blobRadius : BLOB_CONFIG.blobRadius

    // Blob properties - using configuration values
    const blobProperties = {
      u_time: { value: 0.0 },
      _mousePos: { value: new THREE.Vector3(0.0, 0.0, 4.0) },
      _wiggleDampening: { value: 0.0 },
      _wiggleFrequency: { value: BLOB_CONFIG.wiggleFrequency },
      _wiggleAmplitude: { value: BLOB_CONFIG.wiggleAmplitude },
      _wiggleSpeed: { value: BLOB_CONFIG.wiggleSpeed },
      _mouseRotate: { value: 0.0 },
      _baseColor1: { value: new THREE.Color(BLOB_CONFIG.colors.color1) },
      _baseColor2: { value: new THREE.Color(BLOB_CONFIG.colors.color2) },
      _baseColor3: { value: new THREE.Color(BLOB_CONFIG.colors.color3) },
      _baseColor4: { value: new THREE.Color(BLOB_CONFIG.colors.color4) },
      _baseColor5: { value: new THREE.Color(BLOB_CONFIG.colors.color5) },
      _baseColor6: { value: new THREE.Color(BLOB_CONFIG.colors.color6) },
      _colorsAngle: { value: new THREE.Vector3(BLOB_CONFIG.colorsAngle.x, BLOB_CONFIG.colorsAngle.y, BLOB_CONFIG.colorsAngle.z) },
      _colorSinusoidal: { value: BLOB_CONFIG.colorSinusoidal },
      _segmentColor1: { value: BLOB_CONFIG.segmentColors.segment1 },
      _segmentColor2: { value: BLOB_CONFIG.segmentColors.segment2 },
      _segmentColor3: { value: BLOB_CONFIG.segmentColors.segment3 },
      _segmentColor4: { value: BLOB_CONFIG.segmentColors.segment4 },
      _segmentColor5: { value: BLOB_CONFIG.segmentColors.segment5 },
      _segmentColor6: { value: BLOB_CONFIG.segmentColors.segment6 },
      _frequency: { value: BLOB_CONFIG.frequency },
      _amplitude: { value: BLOB_CONFIG.amplitude },
      _metallic: { value: BLOB_CONFIG.metallic },
      _smoothness: { value: BLOB_CONFIG.smoothness },
      _lightintensity: { value: BLOB_CONFIG.lightIntensity }
    }

    // Shader material
    const blobMaterial = new THREE.ShaderMaterial({
      uniforms: blobProperties,
      vertexShader: `
        attribute vec3 tangent;

        uniform float u_time;         
        uniform vec3 _mousePos;
        uniform float _frequency; 
        uniform float _amplitude;  
        
        uniform float _wiggleDampening;
        uniform float _wiggleFrequency;
        uniform float _wiggleAmplitude;
        uniform float _wiggleSpeed;

        uniform float _mouseRotate;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 PositionVS;        
        varying vec3 PositionWS;
        varying vec3 PositionOS;

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+10.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        float pnoise(vec3 P, vec3 rep) {
          vec3 Pi0 = mod(floor(P), rep);
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P);
          vec3 Pf1 = Pf0 - vec3(1.0);
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
          return 2.2 * n_xyz;
        }

        mat4 createRotationMatrix(vec3 angles) {
          float cosX = cos(angles.x);
          float sinX = sin(angles.x);
          float cosY = cos(angles.y);
          float sinY = sin(angles.y);
          float cosZ = cos(angles.z);
          float sinZ = sin(angles.z);

          mat4 rotationX = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, cosX, -sinX, 0.0,
            0.0, sinX, cosX, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          mat4 rotationY = mat4(
            cosY, 0.0, sinY, 0.0,
            0.0, 1.0, 0.0, 0.0,
            -sinY, 0.0, cosY, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          mat4 rotationZ = mat4(
            cosZ, -sinZ, 0.0, 0.0,
            sinZ, cosZ, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          return rotationZ * rotationY * rotationX;
        }

        void main() {
          vUv = uv;
          float time = u_time * 0.5;
          vec3 rep = vec3(10.0);
          float frequency = _frequency;
          float amplitude = _amplitude;
          PositionOS = position;

          vec3 mousepos = (inverse(modelMatrix) * vec4(_mousePos, 1.0)).xyz;
          float mdistance = length(mousepos - position);
          vec3 wiggleOffset = normal * sin(-time * _wiggleSpeed + mdistance * _wiggleFrequency) * clamp(1.0/mdistance, 0.0, 1.0) * _wiggleDampening * _wiggleAmplitude;
          
          vec3 rotateOffset = -(createRotationMatrix(vec3(0.0, _mouseRotate,  0.0)) * vec4(position, 1.0)).xyz + position;

          float displacement = pnoise((position + wiggleOffset + rotateOffset) * frequency + time, rep) * amplitude;            
          vec3 newPosition = position + normal * displacement;

          vec3 posPlusTangent = position + tangent * 0.01;
          displacement = pnoise((posPlusTangent + wiggleOffset + rotateOffset) * frequency + time, rep) * amplitude;
          posPlusTangent = posPlusTangent + normal * displacement;

          vec3 bitangent = cross(normal, tangent);
          vec3 posPlusBitangent = position + bitangent * 0.01;
          displacement = pnoise((posPlusBitangent + wiggleOffset + rotateOffset) * frequency + time, rep) * amplitude;
          posPlusBitangent = posPlusBitangent + normal * displacement;

          vec3 modifiedTangent = posPlusTangent - newPosition;
          vec3 modifiedBitangent = posPlusBitangent - newPosition;
          vec3 modifiedNormal = cross(modifiedTangent, modifiedBitangent);
          vNormal = normalize(modifiedNormal);
          vNormal = normalize(normalMatrix * vNormal);
          
          PositionWS = vec3(modelMatrix * vec4(newPosition, 1.0));
          PositionVS = vec3(modelViewMatrix * vec4(newPosition, 1.0));

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 _baseColor1;
        uniform vec3 _baseColor2;        
        uniform vec3 _baseColor3;
        uniform vec3 _baseColor4;
        uniform vec3 _baseColor5;
        uniform vec3 _baseColor6;   
        uniform vec3 _colorsAngle;  
        uniform float _colorSinusoidal; 
        uniform float _segmentColor1;  
        uniform float _segmentColor2; 
        uniform float _segmentColor3; 
        uniform float _segmentColor4; 
        uniform float _segmentColor5; 
        uniform float _segmentColor6; 
        uniform float _metallic;
        uniform float _smoothness;
        uniform float _lightintensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 PositionWS;
        varying vec3 PositionVS;  
        varying vec3 PositionOS;
        
        mat4 createRotationMatrix(vec3 angles) {
          float cosX = cos(angles.x);
          float sinX = sin(angles.x);
          float cosY = cos(angles.y);
          float sinY = sin(angles.y);
          float cosZ = cos(angles.z);
          float sinZ = sin(angles.z);

          mat4 rotationX = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, cosX, -sinX, 0.0,
            0.0, sinX, cosX, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          mat4 rotationY = mat4(
            cosY, 0.0, sinY, 0.0,
            0.0, 1.0, 0.0, 0.0,
            -sinY, 0.0, cosY, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          mat4 rotationZ = mat4(
            cosZ, -sinZ, 0.0, 0.0,
            sinZ, cosZ, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
          );

          return rotationZ * rotationY * rotationX;
        }

        vec3 SegmentColor(vec3 positionos) {
          vec3 angles = vec3(radians(_colorsAngle.x), radians(_colorsAngle.y), radians(_colorsAngle.z));
          mat4 rotationMatrix = createRotationMatrix(angles);
          vec4 transformedPosition = rotationMatrix * vec4(positionos, 1.0);

          float segmentBounds[6];
          segmentBounds[0] = _segmentColor1;
          segmentBounds[1] = _segmentColor2;
          segmentBounds[2] = _segmentColor3;
          segmentBounds[3] = _segmentColor4;
          segmentBounds[4] = _segmentColor5;
          segmentBounds[5] = _segmentColor6;

          float totalWidth = 0.0;
          for (int i = 0; i < 6; ++i) {
            totalWidth += segmentBounds[i];
          }

          transformedPosition.y += sin(transformedPosition.x) * _colorSinusoidal;
          float normalizedY = (transformedPosition.y + 5.0) / 10.0;
          float cumulativeWidth = 0.0;
          int segmentIndex = 0;

          for (int i = 0; i < 7; ++i) {
            cumulativeWidth += segmentBounds[i] / totalWidth;
            if (normalizedY <= cumulativeWidth) {
              segmentIndex = i;
              break;
            }
          }

          float segmentFraction = (normalizedY - (cumulativeWidth - segmentBounds[segmentIndex] / totalWidth)) / (segmentBounds[segmentIndex] / totalWidth);
          float sineFraction = 0.5 * (1.0 - cos(segmentFraction * 3.14159265));

          vec3 colors[6];
          colors[0] = _baseColor1;
          colors[1] = _baseColor2;
          colors[2] = _baseColor3;
          colors[3] = _baseColor4;
          colors[4] = _baseColor5;
          colors[5] = _baseColor6;

          vec3 colorA = colors[segmentIndex];
          vec3 colorB = colors[(segmentIndex + 1) % 6];

          return mix(colorA, colorB, sineFraction);
        }

        void main() {           
          vec2 uv = vUv;
          vec3 vnormal = normalize(vNormal);

          vec3 albedo = SegmentColor(PositionOS);

          vec3 mate = vec3(1.0) * albedo;
          
          vec3 lightdir = normalize(vec3(0.8, 0.4, 0.7));
          float sunDiffuse = clamp(dot(vnormal, lightdir), 0.0, 1.0);
          float skyDiffuse = clamp(0.5 + 0.5 * dot(vnormal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
          float bounceDiffuse = clamp(0.5 + 0.5 * dot(vnormal, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);       

          vec3 diffuseCol = mate * vec3(1.0, 1.0, 1.0) * sunDiffuse * _lightintensity;
          diffuseCol += mate * vec3(1.0, 1.0, 1.0) * skyDiffuse;
          diffuseCol += mate * vec3(1.0, 1.0, 1.0) * bounceDiffuse * (1.0 - _metallic);

          vec3 viewDir = normalize(-PositionVS);
          vec3 reflectDir = reflect(-lightdir, vnormal);  
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), _smoothness * 128.0);   
          vec3 specular = vec3(1.0) * spec * 1.5 * _metallic; 

          vec3 finalcol = (diffuseCol + specular);
          finalcol = pow(finalcol, vec3(0.4545));
          gl_FragColor = vec4(finalcol, 1.0);
        }
      `,
      side: THREE.DoubleSide
    })

    // Create sphere mesh
    const blobGeometry = new THREE.SphereGeometry(radius, BLOB_CONFIG.sphereSegments, BLOB_CONFIG.sphereSegments)
    blobGeometry.computeTangents()
    const blob = new THREE.Mesh(blobGeometry, blobMaterial)
    scene.add(blob)

    // Mouse interaction - click to wiggle (no drag/rotation)
    const onMouseDown = (event) => {
      // Only handle clicks, not drags
      const rect = canvas.getBoundingClientRect()
      const mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObject(blob)
      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point
        blobProperties._mousePos.value.copy(intersectPoint)
        animateDamp()
      }
    }

    // Simple dampening animation (replacing gsap)
    const animateDamp = () => {
      const duration = 1200 // 1.2 seconds total
      const peakTime = 200 // 0.2 seconds to peak
      const startTime = Date.now()
      const startValue = blobProperties._wiggleDampening.value

      const animate = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < peakTime) {
          // Rise to peak
          blobProperties._wiggleDampening.value = THREE.MathUtils.lerp(startValue, 0.5, elapsed / peakTime)
          requestAnimationFrame(animate)
        } else if (elapsed < duration) {
          // Fall back to 0
          const fallProgress = (elapsed - peakTime) / (duration - peakTime)
          blobProperties._wiggleDampening.value = THREE.MathUtils.lerp(0.5, 0.0, fallProgress)
          requestAnimationFrame(animate)
        } else {
          blobProperties._wiggleDampening.value = 0.0
        }
      }
      animate()
    }

    canvas.addEventListener('mousedown', onMouseDown)

    // Hover interaction - change frequency, amplitude, position, rotation, scale, and lighting
    let isHovered = false
    const baseFrequency = BLOB_CONFIG.frequency
    const baseAmplitude = BLOB_CONFIG.amplitude
    const hoverFrequency = baseFrequency * 1.2 // Increase frequency by 20%
    const hoverAmplitude = baseAmplitude * 1.15 // Increase amplitude by 15%

    // Current target values (for smooth interpolation)
    let targetFrequency = baseFrequency
    let targetAmplitude = baseAmplitude
    let targetScale = 1.0
    let targetLightIntensity = BLOB_CONFIG.lightIntensity
    let targetPosition = new THREE.Vector3(0, 0, 0)
    let targetRotation = new THREE.Vector3(0, 0, 0)

    // Current values for smooth interpolation
    let currentScale = 1.0
    let currentLightIntensity = BLOB_CONFIG.lightIntensity
    let currentPosition = new THREE.Vector3(0, 0, 0)
    let currentRotation = new THREE.Vector3(0, 0, 0)

    // Mouse position in normalized device coordinates
    let mouseNDC = new THREE.Vector2(0, 0)

    // Throttle mouse position updates
    let lastMouseUpdate = 0
    const mouseUpdateInterval = 16 // ~60fps

    // Batch state updates to prevent blocking
    let pendingHoverState = null
    let rafId = null

    const scheduleHoverUpdate = (newHoverState) => {
      if (pendingHoverState === newHoverState) return // Already scheduled
      pendingHoverState = newHoverState

      if (rafId) return // Already scheduled

      rafId = requestAnimationFrame(() => {
        if (onHoverChangeRef.current && pendingHoverState !== null) {
          onHoverChangeRef.current(pendingHoverState)
        }
        pendingHoverState = null
        rafId = null
      })
    }

    const onMouseMove = (event) => {
      const now = Date.now()

      // Throttle mouse position updates
      if (now - lastMouseUpdate < mouseUpdateInterval) return
      lastMouseUpdate = now

      const rect = canvas.getBoundingClientRect()
      const mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Store mouse position for position/rotation effects (always update for smooth movement)
      mouseNDC.copy(mouse)

      // Calculate position offset towards mouse (subtle movement)
      const offsetAmount = 0.4
      targetPosition.set(
        mouse.x * offsetAmount,
        -mouse.y * offsetAmount,
        0
      )

      // Calculate rotation towards mouse
      const angleX = mouse.y * 0.3
      const angleY = mouse.x * 0.3
      targetRotation.set(angleX, angleY, 0)

      // Set hover state (mouse is always over canvas when this fires)
      if (!disableHover && !isHovered) {
        isHovered = true
        targetFrequency = hoverFrequency
        targetAmplitude = hoverAmplitude
        targetScale = 1.08
        targetLightIntensity = BLOB_CONFIG.lightIntensity * 1.3
        scheduleHoverUpdate(true)
      }
    }

    const onMouseEnter = () => {
      if (!disableHover && !isHovered) {
        isHovered = true
        targetFrequency = hoverFrequency
        targetAmplitude = hoverAmplitude
        targetScale = 1.08
        targetLightIntensity = BLOB_CONFIG.lightIntensity * 1.3
      }
    }

    const onMouseLeave = () => {
      if (isHovered) {
        isHovered = false
        targetFrequency = baseFrequency
        targetAmplitude = baseAmplitude
        targetScale = 1.0
        targetLightIntensity = BLOB_CONFIG.lightIntensity
        // Return to center position and neutral rotation
        targetPosition.set(0, 0, 0)
        targetRotation.set(0, 0, 0)
      }
    }

    canvas.addEventListener('mousemove', onMouseMove, { passive: true })
    canvas.addEventListener('mouseenter', onMouseEnter)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // Effect to handle speaking state and disable mode
    const updateState = () => {
      if (isAiSpeaking) {
        // SPEAKING STATE: Energetic
        targetFrequency = baseFrequency * 2.0
        targetAmplitude = baseAmplitude * 3.5
        targetScale = 1.15
        targetLightIntensity = BLOB_CONFIG.lightIntensity * 1.5

        // Reset position to center if we were hovering
        targetPosition.set(0, 0, 0)
        targetRotation.set(0, 0, 0)
      } else if (disableHover) {
        // LISTENING STATE: Calm breathing
        targetFrequency = baseFrequency * 0.8
        targetAmplitude = baseAmplitude * 0.8
        targetScale = 1.05
        targetLightIntensity = BLOB_CONFIG.lightIntensity * 1.1

        targetPosition.set(0, 0, 0)
        targetRotation.set(0, 0, 0)
      } else if (!isHovered) {
        // IDLE NORMAL STATE
        targetFrequency = baseFrequency
        targetAmplitude = baseAmplitude
        targetScale = 1.0
        targetLightIntensity = BLOB_CONFIG.lightIntensity
      }
      // If hovered and not disabled, the hover handlers above take care of it
      // If hovered and not disabled, the hover handlers above take care of it
    }

    // Call updateState when relevant props change (handled by effect dependency)
    updateState()

    // Audio Data Array
    const dataArray = new Uint8Array(256);



    // Handle resize
    const handleResize = () => {
      sizes.width = canvas.clientWidth
      sizes.height = canvas.clientHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const startTime = performance.now() / 1000
    let animationFrameId = null

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const currentTime = performance.now() / 1000
      const elapsedTime = currentTime - startTime
      blobProperties.u_time.value = elapsedTime

      // Audio Reactivity
      if (disableHover && audioAnalyser) {
        audioAnalyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        // We only need the lower frequencies mostly for voice
        const binCount = audioAnalyser.frequencyBinCount;
        // Use a subset for better voice reaction (lower half)
        for (let i = 0; i < binCount / 2; i++) {
          sum += dataArray[i];
        }
        const average = sum / (binCount / 2);
        const volume = average / 255.0; // 0.0 to 1.0

        // Map volume to blob properties
        // Baseline + Reaction
        // Boost 2.0 -> 3.0 frequency range
        // Boost 1.5 -> 4.0 amplitude range

        // Boost low signals using sqrt but clamp to requested limits
        const sensitiveVolume = Math.sqrt(volume);

        // Calculate potential values (Baseline + Reaction)
        const potentialFreq = (baseFrequency * 0.8) + (sensitiveVolume * 3.0);
        const potentialAmp = (baseAmplitude * 0.8) + (sensitiveVolume * 3.0);

        // Limits depend on who is speaking
        let maxFreq, maxAmp;

        if (isAiSpeaking) {
          // AI Speaking: Higher energy allowed (User liked this)
          maxFreq = 3.0;
          maxAmp = 2.0;
        } else {
          // User Speaking / Listening: Strict limits as requested
          // Frequency: 1, Amplitude: 1
          maxFreq = 1.0;
          maxAmp = 1.0;
        }

        // Clamp to defined maximums
        targetFrequency = Math.min(maxFreq, potentialFreq);
        targetAmplitude = Math.min(maxAmp, potentialAmp);

        targetScale = 1.05 + (sensitiveVolume * 0.3);
        targetLightIntensity = (BLOB_CONFIG.lightIntensity * 1.0) + (sensitiveVolume * 2.0);

        // If volume is very low, snap to idle slowly (handled by lerp below)
      } else if (disableHover && !audioAnalyser) {
        // Fallback to "Is Speaking" boolean state if analyser fails or disconnected
        // Logic already set by updateState() above
      }

      // Smoothly interpolate frequency and amplitude towards target values
      const lerpSpeed = 0.1
      blobProperties._frequency.value = THREE.MathUtils.lerp(
        blobProperties._frequency.value,
        targetFrequency,
        lerpSpeed
      )
      blobProperties._amplitude.value = THREE.MathUtils.lerp(
        blobProperties._amplitude.value,
        targetAmplitude,
        lerpSpeed
      )

      // Smoothly interpolate scale
      currentScale = THREE.MathUtils.lerp(currentScale, targetScale, lerpSpeed)
      blob.scale.setScalar(currentScale)

      // Smoothly interpolate position (follow mouse)
      currentPosition.lerp(targetPosition, lerpSpeed)
      blob.position.copy(currentPosition)

      // Smoothly interpolate rotation (tilt towards mouse)
      currentRotation.lerp(targetRotation, lerpSpeed)
      blob.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z)

      // Smoothly interpolate light intensity
      currentLightIntensity = THREE.MathUtils.lerp(
        currentLightIntensity,
        targetLightIntensity,
        lerpSpeed
      )
      blobProperties._lightintensity.value = currentLightIntensity

      // Update directional light intensity for more dramatic effect
      directionalLight1.intensity = BLOB_CONFIG.directionalLightIntensity * (isHovered ? 1.2 : 1.0)

      renderer.render(scene, camera)
    }

    animate()

    sceneRef.current = { scene, blob, blobProperties }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseenter', onMouseEnter)
      canvas.removeEventListener('mouseleave', onMouseLeave)

      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }

      blobGeometry.dispose()
      blobMaterial.dispose()
      renderer.dispose()
    }
  }, [blobRadius, isAiSpeaking, disableHover, audioAnalyser])

  if (fullscreen) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
    )
  }

  return (
    <div className="rounded-full overflow-hidden" style={{ width: `${width}px`, height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}

// Memoize to prevent re-renders when parent re-renders
export default memo(BlobCanvas, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.fullscreen === nextProps.fullscreen &&
    prevProps.blobRadius === nextProps.blobRadius &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.isAiSpeaking === nextProps.isAiSpeaking &&
    prevProps.disableHover === nextProps.disableHover &&
    prevProps.audioAnalyser === nextProps.audioAnalyser
    // Note: onHoverChange is handled via ref, so we don't need to compare it
  )
})
