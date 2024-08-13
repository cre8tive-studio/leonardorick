<template>
  <canvas id="renderSurface"></canvas>
</template>
<script setup>
import { Fluid } from './fluid.js';
onMounted(() => {
  const canvas2 = document.getElementById('renderSurface');
  const fluid = new Fluid(canvas2);
  fluid.mapBehaviors({
    sim_resolution: 128,
    dye_resolution: 512,

    paused: false,
    embedded_dither: true,

    dissipation: 0.97,
    velocity: 0.98,
    pressure: 0.8,
    pressure_iteration: 20,
    curl: 0,
    emitter_size: 0.5,

    render_shaders: true,

    multi_color: false,

    render_bloom: false,
    bloom_iterations: 8,
    bloom_resolution: 256,
    intensity: 0.8,
    threshold: 0.6,
    soft_knee: 0.7,

    background_color: { r: 15, g: 15, b: 15 },
    transparent: true,
    saturation: 1,
    brightness: 1,
    effect_trigger: 'hover',
    rgb: {
      multiplier: [0.15, 0.15, 0.15],
      adder: [-0.1, 0, 0.4],
    },
  });
  fluid.activate();
});
</script>
<style scoped lang="scss">
canvas {
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  position: fixed;
  z-index: -2;
}
</style>
