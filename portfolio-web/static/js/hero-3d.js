/* ── 3D particle network background (hero) ────────────────────────────────── */
(function () {
  const mount = document.getElementById('hero-canvas');
  if (!mount || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width  = mount.clientWidth;
  let height = mount.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  mount.appendChild(renderer.domElement);

  /* ── Particles ─────────────────────────────────────────────────────────── */
  const PARTICLE_COUNT = width < 700 ? 55 : 110;
  const RANGE = 70;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * RANGE * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities.push({
      x: (Math.random() - 0.5) * 0.03,
      y: (Math.random() - 0.5) * 0.03,
      z: (Math.random() - 0.5) * 0.03,
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 1.6,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(particleGeo, particleMat);
  scene.add(points);

  /* ── Connecting lines (rebuilt each frame within a max distance) ─────────── */
  const MAX_DIST = 15;
  const lineGeo = new THREE.BufferGeometry();
  const maxLineVerts = PARTICLE_COUNT * PARTICLE_COUNT * 2;
  const linePositions = new Float32Array(maxLineVerts * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.18 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* ── Mouse parallax ────────────────────────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  let lastWidth = width;
  function onResize() {
    const newWidth  = mount.clientWidth;
    const newHeight = mount.clientHeight;
    // Mobile browsers fire resize when the address bar hides/shows on scroll —
    // that's a height-only change and re-sizing the renderer for it is what
    // made the particle field visually snap/misplace. Only react to real
    // width changes (actual device rotation / window resize).
    if (Math.abs(newWidth - lastWidth) < 2) return;
    lastWidth = newWidth;
    width  = newWidth;
    height = newHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);

    const posAttr = particleGeo.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.array[i * 3]     += velocities[i].x;
      posAttr.array[i * 3 + 1] += velocities[i].y;
      posAttr.array[i * 3 + 2] += velocities[i].z;

      if (Math.abs(posAttr.array[i * 3])     > RANGE) velocities[i].x *= -1;
      if (Math.abs(posAttr.array[i * 3 + 1]) > RANGE / 1.4) velocities[i].y *= -1;
      if (Math.abs(posAttr.array[i * 3 + 2]) > 20) velocities[i].z *= -1;
    }
    posAttr.needsUpdate = true;

    let vertexIdx = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = posAttr.array[i * 3] - posAttr.array[j * 3];
        const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
        const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < MAX_DIST) {
          linePositions[vertexIdx++] = posAttr.array[i * 3];
          linePositions[vertexIdx++] = posAttr.array[i * 3 + 1];
          linePositions[vertexIdx++] = posAttr.array[i * 3 + 2];
          linePositions[vertexIdx++] = posAttr.array[j * 3];
          linePositions[vertexIdx++] = posAttr.array[j * 3 + 1];
          linePositions[vertexIdx++] = posAttr.array[j * 3 + 2];
        }
      }
    }
    lineGeo.setDrawRange(0, vertexIdx / 3);
    lineGeo.attributes.position.needsUpdate = true;

    targetRotY += ((mouseX * 0.3) - targetRotY) * 0.02;
    targetRotX += ((-mouseY * 0.2) - targetRotX) * 0.02;
    scene.rotation.y = targetRotY + performance.now() * 0.00002;
    scene.rotation.x = targetRotX;

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!raf && !prefersReducedMotion) animate();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
  }, { threshold: 0 });
  io.observe(mount);
})();
