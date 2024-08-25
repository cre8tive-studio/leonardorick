import * as dither from './dither.png';
import * as defaults from './defaults';

let active = false;
const _cancel = false;
let ditherURL = './assets/dither.png';

/**
 * Initiate WebGL Object
 *  Gets WebGL context and compiles shader programs.
 * @param canvas the <canvas> element from which we get the WebGL context
 */
export function initWebGL(canvas) {
  /* Add default pointer */
  const pointers = [];
  pointers.push(new Pointer());

  /* Get webGL context */
  let webGL = canvas.getContext('webgl2', defaults.DRAWING_PARAMS);
  const isWebGL2 = !!webGL;
  if (!isWebGL2) {
    webGL =
      canvas.getContext('webgl', defaults.DRAWING_PARAMS) ||
      canvas.getContext('experimental-webgl', defaults.DRAWING_PARAMS);
  }

  /* Get color formats */
  const colorFormats = getFormats();

  /* Case support adjustments */
  if (isMobile()) {
    defaults.behavior.render_shaders = false;
  }
  if (!colorFormats.supportLinearFiltering) {
    defaults.behavior.render_shaders = false;
    defaults.behavior.render_bloom = false;
  }

  /* Make our shaders and shader programs */
  const SHADER = {
    baseVertex: compileShader(webGL.VERTEX_SHADER, defaults.SHADER_SOURCE.vertex),

    clear: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.clear),
    color: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.color),
    background: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.background),
    display: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.display),
    displayBloom: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.displayBloom),
    displayShading: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.displayShading),
    displayBloomShading: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.displayBloomShading),
    bloomPreFilter: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.bloomPreFilter),
    bloomBlur: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.bloomBlur),
    bloomFinal: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.bloomFinal),
    splat: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.splat),
    advectionManualFiltering: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.advectionManualFiltering),
    advection: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.advection),
    divergence: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.divergence),
    curl: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.curl),
    vorticity: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.vorticity),
    pressure: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.pressure),
    gradientSubtract: compileShader(webGL.FRAGMENT_SHADER, defaults.SHADER_SOURCE.gradientSubtract),
  };
  const programs = formShaderPrograms(colorFormats.supportLinearFiltering);

  /* Worker Classes and Functions */
  /**
   *  Is It Mobile?:
   *  Detects whether or not a device is mobile by checking the user agent string
   *
   * @returns {boolean}
   */
  function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  /**
   *  Get Formats:
   *  Enable color extensions, linear filtering extensions, and return usable color formats RGBA,
   *  RG (Red-Green), and R (Red).
   *
   * @returns {{formatRGBA: {internalFormat, format}, supportLinearFiltering: OES_texture_half_float_linear,
   * formatR: {internalFormat, format}, halfFloatTexType: *, formatRG: {internalFormat, format}}}
   */
  function getFormats() {
    /* Color Formats */
    let formatRGBA;
    let formatRG;
    let formatR;

    let halfFloat;
    let supportLinearFiltering;

    /* Enables webGL color extensions and get linear filtering extension */
    if (isWebGL2) {
      webGL.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = webGL.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = webGL.getExtension('OES_texture_half_float');
      supportLinearFiltering = webGL.getExtension('OES_texture_half_float_linear');
    }
    const HALF_FLOAT_TEXTURE_TYPE = isWebGL2 ? webGL.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;

    /* Set color to black for when color buffers are cleared */
    webGL.clearColor(0.0, 0.0, 0.0, 1.0);

    /* Retrieve color formats */
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(webGL.RGBA16F, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
      formatRG = getSupportedFormat(webGL.RG16F, webGL.RG, HALF_FLOAT_TEXTURE_TYPE);
      formatR = getSupportedFormat(webGL.R16F, webGL.RED, HALF_FLOAT_TEXTURE_TYPE);
    } else {
      formatRGBA = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
      formatRG = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
      formatR = getSupportedFormat(webGL.RGBA, webGL.RGBA, HALF_FLOAT_TEXTURE_TYPE);
    }

    /** Get Supported Format
     *  Using the specified internal format, we retrieve and return the desired color format to be
     *  rendered with
     *
     * @param internalFormat: A GLenum that specifies the color components within the texture
     * @param format: Another GLenum that specifies the format of the texel data.
     * @returns {{internalFormat: *, format: *}|null|({internalFormat, format}|null)}
     */
    function getSupportedFormat(internalFormat, format, type) {
      const texture = webGL.createTexture();

      /* Set texture parameters */
      webGL.bindTexture(webGL.TEXTURE_2D, texture);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.NEAREST);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.NEAREST);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
      webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);

      /* Specify a 2D texture image */
      webGL.texImage2D(webGL.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      /* Attach texture to frame buffer */
      const fbo = webGL.createFramebuffer();
      webGL.bindFramebuffer(webGL.FRAMEBUFFER, fbo);
      webGL.framebufferTexture2D(webGL.FRAMEBUFFER, webGL.COLOR_ATTACHMENT0, webGL.TEXTURE_2D, texture, 0);

      /* Check if current format is supported */
      const status = webGL.checkFramebufferStatus(webGL.FRAMEBUFFER);
      const isSupportRenderTextureFormat = status === webGL.FRAMEBUFFER_COMPLETE;

      /* If not supported use fallback format, until we have no fallback */
      if (!isSupportRenderTextureFormat) {
        switch (internalFormat) {
          case webGL.R16F:
            return getSupportedFormat(webGL.RG16F, webGL.RG, type);
          case webGL.RG16F:
            return getSupportedFormat(webGL.RGBA16F, webGL.RGBA, type);
          default:
            return null;
        }
      }

      return { internalFormat, format };
    }

    return {
      formatRGBA,
      formatRG,
      formatR,

      halfFloatTexType: HALF_FLOAT_TEXTURE_TYPE,
      supportLinearFiltering,
    };
  }

  /**
   *  Compile Shader:
   *  Makes a new webGL shader of type `type` using the provided GLSL source. The `type` is either of
   *  `VERTEX_SHADER` or `FRAGMENT_SHADER`
   *
   * @param type: Passed to `createShader` to define the shader type
   * @param source: A GLSL source script, used to define the shader properties
   * @returns {WebGLShader}: A webGL shader of the parameterized type and source
   */
  function compileShader(type, source) {
    /* Create shader, link the source, and compile the GLSL */
    const shader = webGL.createShader(type);
    webGL.shaderSource(shader, source);
    webGL.compileShader(shader);

    /* TODO: Finish error checking */
    if (!webGL.getShaderParameter(shader, webGL.COMPILE_STATUS)) {
      throw webGL.getShaderInfoLog(shader);
    }

    return shader;
  }

  /**
   *  Form Shader Programs:
   *  Assembles shaders into a webGl program we can use to write to our context
   *
   * @param supportLinearFiltering: A bool letting us know if we support linear filtering
   * @returns {{displayBloomProgram: GLProgram, vorticityProgram: GLProgram, displayShadingProgram: GLProgram,
   * displayBloomShadingProgram: GLProgram, gradientSubtractProgram: GLProgram, advectionProgram: GLProgram,
   * bloomBlurProgram: GLProgram, colorProgram: GLProgram, divergenceProgram: GLProgram, clearProgram: GLProgram,
   * splatProgram: GLProgram, displayProgram: GLProgram, bloomPreFilterProgram: GLProgram, curlProgram: GLProgram,
   * bloomFinalProgram: GLProgram, pressureProgram: GLProgram, backgroundProgram: GLProgram}}: Programs used to
   * render shaders
   *
   */
  function formShaderPrograms(supportLinearFiltering) {
    return {
      clearProgram: new GLProgram(SHADER.baseVertex, SHADER.clear, webGL),
      colorProgram: new GLProgram(SHADER.baseVertex, SHADER.color, webGL),
      backgroundProgram: new GLProgram(SHADER.baseVertex, SHADER.background, webGL),
      displayProgram: new GLProgram(SHADER.baseVertex, SHADER.display, webGL),
      displayBloomProgram: new GLProgram(SHADER.baseVertex, SHADER.displayBloom, webGL),
      displayShadingProgram: new GLProgram(SHADER.baseVertex, SHADER.displayShading, webGL),
      displayBloomShadingProgram: new GLProgram(SHADER.baseVertex, SHADER.displayBloomShading, webGL),
      bloomPreFilterProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomPreFilter, webGL),
      bloomBlurProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomBlur, webGL),
      bloomFinalProgram: new GLProgram(SHADER.baseVertex, SHADER.bloomFinal, webGL),
      splatProgram: new GLProgram(SHADER.baseVertex, SHADER.splat, webGL),
      advectionProgram: new GLProgram(
        SHADER.baseVertex,
        supportLinearFiltering ? SHADER.advection : SHADER.advectionManualFiltering,
        webGL
      ),
      divergenceProgram: new GLProgram(SHADER.baseVertex, SHADER.divergence, webGL),
      curlProgram: new GLProgram(SHADER.baseVertex, SHADER.curl, webGL),
      vorticityProgram: new GLProgram(SHADER.baseVertex, SHADER.vorticity, webGL),
      pressureProgram: new GLProgram(SHADER.baseVertex, SHADER.pressure, webGL),
      gradientSubtractProgram: new GLProgram(SHADER.baseVertex, SHADER.gradientSubtract, webGL),
    };
  }

  return {
    programs,
    webGL,
    colorFormats,
    pointers,
  };
}

export function activator(
  canvas,
  webGL,
  colorFormat,
  PROGRAMS,
  pointers,
  { initialColor = null, raf = false, addListeners = true } = {}
) {
  if (active) {
    const nPointers = [];
    nPointers.push(new Pointer());
    pointers = nPointers;
  }

  active = true;

  /* TODO: Retrieve haul style */
  const PARAMS = defaults.behavior;

  const bloomFrameBuffers = [];
  const splatStack = [];

  let simWidth;
  let simHeight;
  let dyeWidth;
  let dyeHeight;
  let density;
  let velocity;
  let divergence;
  let curl;
  let pressure;
  let bloom;
  let isInitialColorUsed = false;

  const blit = (() => {
    webGL.bindBuffer(webGL.ARRAY_BUFFER, webGL.createBuffer());
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), webGL.STATIC_DRAW);

    webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, webGL.createBuffer());
    webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), webGL.STATIC_DRAW);

    webGL.vertexAttribPointer(0, 2, webGL.FLOAT, false, 0, 0);
    webGL.enableVertexAttribArray(0);

    return (destination) => {
      webGL.bindFramebuffer(webGL.FRAMEBUFFER, destination);
      webGL.drawElements(webGL.TRIANGLES, 6, webGL.UNSIGNED_SHORT, 0);
    };
  })();

  /** Dithering Texture
   *  Initialize fluid overlay/dither
   *
   * @type {{texture: WebGLTexture, width: number, attach(*): *, height: number}}
   */
  const ditheringTexture = PARAMS.embedded_dither ? createTextureAsync(dither.default) : createTextureAsync(ditherURL);

  /* Initialize Fluid */
  init();

  // uncomment next line if you want the default red circle appearing at the beginning
  // multipleSplats(getRandomMultipleSplatsArgs());

  /* Game Loop */
  let lastColorChangeTime = Date.now();
  if (raf) {
    update();
  }
  /* Game Loop */

  /**
   * Initialize Fluid
   *  Prepares frame buffers for rendering
   *
   */
  function init() {
    /* Color Formats */
    const texType = colorFormat.halfFloatTexType;
    const rgba = colorFormat.formatRGBA;
    const rg = colorFormat.formatRG;
    const r = colorFormat.formatR;
    const filtering = colorFormat.supportLinearFiltering ? webGL.LINEAR : webGL.NEAREST;

    /* Set simulation and pointer width and height */
    const simRes = getResolution(PARAMS.sim_resolution);
    const dyeRes = getResolution(PARAMS.dye_resolution);
    const bloomRes = getResolution(PARAMS.bloom_resolution);

    simWidth = simRes.width;
    simHeight = simRes.height;
    dyeWidth = dyeRes.width;
    dyeHeight = dyeRes.height;

    /* Density, Velocity, and Bloom Double Frame Buffers */
    density = !density
      ? createDoubleFBO(dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering)
      : resizeDoubleFBO(density, dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering);
    velocity = !velocity
      ? createDoubleFBO(simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering)
      : resizeDoubleFBO(velocity, simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering);

    bloom = createFBO(bloomRes.width, bloomRes.height, rgba.internalFormat, rgba.format, texType, filtering);

    /* Divergence, Curl, and Pressure Frame Buffers */
    divergence = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, webGL.NEAREST);
    curl = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, webGL.NEAREST);
    pressure = createDoubleFBO(simWidth, simHeight, r.internalFormat, r.format, texType, webGL.NEAREST);

    /* Populate bloom's frame buffer stack by iterating through bloom iterations
     *  Each iteration, we offset the scale linearly at a constant rate */
    bloomFrameBuffers.length = 0;
    for (let i = 0; i < PARAMS.bloom_iterations; i++) {
      /* Offset scale by a factor of 1 plus our current iteration */
      const width = bloomRes.width >> (i + 1);
      const height = bloomRes.height >> (i + 1);

      /* Don't create frame buffer */
      if (width < 2 || height < 2) {
        break;
      }

      /* Create Frame Buffer for Bloom iterations */
      const fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering);
      bloomFrameBuffers.push(fbo);
    }
  }

  /**
   * Create Double Frame Buffer Object
   *  Creates an object with 2 frame buffers, one for reads and one for writes
   *
   * @param w: Width
   * @param h: Height
   * @param internalFormat: Internal color formats
   * @param format: Color format
   * @param type: Texture type
   * @param param: Extra parameters
   */
  function createDoubleFBO(w, h, internalFormat, format, type, param) {
    /* Create frame buffer objects */
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);

    return {
      /* Get and set Buffer Data */
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },

      /* Swap data between buffers */
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  function createFBO(w, h, internalFormat, format, type, param) {
    webGL.activeTexture(webGL.TEXTURE0);
    const texture = webGL.createTexture();
    webGL.bindTexture(webGL.TEXTURE_2D, texture);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, param);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, param);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
    webGL.texImage2D(webGL.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = webGL.createFramebuffer();
    webGL.bindFramebuffer(webGL.FRAMEBUFFER, fbo);
    webGL.framebufferTexture2D(webGL.FRAMEBUFFER, webGL.COLOR_ATTACHMENT0, webGL.TEXTURE_2D, texture, 0);
    webGL.viewport(0, 0, w, h);
    webGL.clear(webGL.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      attach(id) {
        webGL.activeTexture(webGL.TEXTURE0 + id);
        webGL.bindTexture(webGL.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    return target;
  }

  function resizeFBO(target, w, h, internalFormat, format, type, param) {
    const newFBO = createFBO(w, h, internalFormat, format, type, param);
    PROGRAMS.clearProgram.bind();
    webGL.uniform1i(PROGRAMS.clearProgram.uniforms.uTexture, target.attach(0));
    webGL.uniform1f(PROGRAMS.clearProgram.uniforms.value, 1);
    blit(newFBO.fbo);
    return newFBO;
  }

  function createTextureAsync(url) {
    const texture = webGL.createTexture();
    webGL.bindTexture(webGL.TEXTURE_2D, texture);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.LINEAR);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.REPEAT);
    webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.REPEAT);
    webGL.texImage2D(
      webGL.TEXTURE_2D,
      0,
      webGL.RGB,
      1,
      1,
      0,
      webGL.RGB,
      webGL.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255])
    );

    const obj = {
      texture,
      width: 1,
      height: 1,
      attach(id) {
        webGL.activeTexture(webGL.TEXTURE0 + id);
        webGL.bindTexture(webGL.TEXTURE_2D, texture);
        return id;
      },
    };

    const image = new Image();

    image.src = url;

    image.onload = () => {
      obj.width = image.width;
      obj.height = image.height;
      webGL.bindTexture(webGL.TEXTURE_2D, texture);
      webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGB, webGL.RGB, webGL.UNSIGNED_BYTE, image);
    };

    return obj;
  }

  function rafCallback() {
    resizeCanvas();
    input();
    if (!PARAMS.paused) {
      step(0.016);
    }
    render(null);
  }

  function update() {
    rafCallback();
    requestAnimationFrame(update);

    // /* Destroys if Deactivated */
    // if (cancelled.is) {
    //     webGL.clear(webGL.COLOR_BUFFER_BIT);
    //     cancelAnimationFrame(callback);
    // }
  }

  function input() {
    if (splatStack.length > 0) {
      multipleSplats(splatStack.pop());
    }

    for (let i = 0; i < pointers.length; i++) {
      const p = pointers[i];
      if (p.moved) {
        splat(p.x, p.y, p.dx, p.dy, p.color);
        if (i !== 1) {
          p.moved = false;
        }
      }
    }

    if (!PARAMS.multi_color) {
      return;
    }

    if (lastColorChangeTime + PARAMS.color_change_time_adder < Date.now()) {
      lastColorChangeTime = Date.now();
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i];
        p.color = generateColor();
      }
    }
  }

  function step(dt) {
    webGL.disable(webGL.BLEND);
    webGL.viewport(0, 0, simWidth, simHeight);

    PROGRAMS.curlProgram.bind();
    webGL.uniform2f(PROGRAMS.curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    webGL.uniform1i(PROGRAMS.curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl.fbo);

    PROGRAMS.vorticityProgram.bind();
    webGL.uniform2f(PROGRAMS.vorticityProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    webGL.uniform1i(PROGRAMS.vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    webGL.uniform1i(PROGRAMS.vorticityProgram.uniforms.uCurl, curl.attach(1));
    webGL.uniform1f(PROGRAMS.vorticityProgram.uniforms.curl, PARAMS.curl);
    webGL.uniform1f(PROGRAMS.vorticityProgram.uniforms.dt, dt);
    blit(velocity.write.fbo);
    velocity.swap();

    PROGRAMS.divergenceProgram.bind();
    webGL.uniform2f(PROGRAMS.divergenceProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    webGL.uniform1i(PROGRAMS.divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence.fbo);

    PROGRAMS.clearProgram.bind();
    webGL.uniform1i(PROGRAMS.clearProgram.uniforms.uTexture, pressure.read.attach(0));
    webGL.uniform1f(PROGRAMS.clearProgram.uniforms.value, PARAMS.pressure);
    blit(pressure.write.fbo);
    pressure.swap();

    PROGRAMS.pressureProgram.bind();
    webGL.uniform2f(PROGRAMS.pressureProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    webGL.uniform1i(PROGRAMS.pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < PARAMS.pressure_iteration; i++) {
      webGL.uniform1i(PROGRAMS.pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write.fbo);
      pressure.swap();
    }

    PROGRAMS.gradientSubtractProgram.bind();
    webGL.uniform2f(PROGRAMS.gradientSubtractProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    webGL.uniform1i(PROGRAMS.gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    webGL.uniform1i(PROGRAMS.gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write.fbo);
    velocity.swap();

    PROGRAMS.advectionProgram.bind();
    webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
    if (!colorFormat.supportLinearFiltering) {
      webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.dyeTexelSize, 1.0 / simWidth, 1.0 / simHeight);
    }
    const velocityId = velocity.read.attach(0);
    webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uVelocity, velocityId);
    webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uSource, velocityId);
    webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dt, dt);
    webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dissipation, PARAMS.velocity);
    blit(velocity.write.fbo);
    velocity.swap();

    webGL.viewport(0, 0, dyeWidth, dyeHeight);

    if (!colorFormat.supportLinearFiltering) {
      webGL.uniform2f(PROGRAMS.advectionProgram.uniforms.dyeTexelSize, 1.0 / dyeWidth, 1.0 / dyeHeight);
    }
    webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    webGL.uniform1i(PROGRAMS.advectionProgram.uniforms.uSource, density.read.attach(1));
    webGL.uniform1f(PROGRAMS.advectionProgram.uniforms.dissipation, PARAMS.dissipation);
    blit(density.write.fbo);
    density.swap();
  }

  function render(target) {
    if (PARAMS.render_bloom) {
      applyBloom(density.read, bloom);
    }

    if (target == null || !PARAMS.transparent) {
      webGL.blendFunc(webGL.ONE, webGL.ONE_MINUS_SRC_ALPHA);
      webGL.enable(webGL.BLEND);
    } else {
      webGL.disable(webGL.BLEND);
    }

    const width = target == null ? webGL.drawingBufferWidth : dyeWidth;
    const height = target == null ? webGL.drawingBufferHeight : dyeHeight;

    webGL.viewport(0, 0, width, height);

    if (!PARAMS.transparent) {
      PROGRAMS.colorProgram.bind();
      const bc = PARAMS.background_color;
      webGL.uniform4f(PROGRAMS.colorProgram.uniforms.color, bc.r / 255, bc.g / 255, bc.b / 255, 1);
      blit(target);
    }

    if (target == null && PARAMS.transparent) {
      PROGRAMS.backgroundProgram.bind();
      webGL.uniform1f(PROGRAMS.backgroundProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      blit(null);
    }

    if (PARAMS.render_shaders) {
      const program = PARAMS.render_bloom ? PROGRAMS.displayBloomShadingProgram : PROGRAMS.displayShadingProgram;
      program.bind();
      webGL.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height);
      webGL.uniform1i(program.uniforms.uTexture, density.read.attach(0));
      if (PARAMS.render_bloom) {
        webGL.uniform1i(program.uniforms.uBloom, bloom.attach(1));
        webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
        const scale = getTextureScale(ditheringTexture, width, height);
        webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
      }
    } else {
      const program = PARAMS.render_bloom ? PROGRAMS.displayBloomProgram : PROGRAMS.displayProgram;
      program.bind();
      webGL.uniform1i(program.uniforms.uTexture, density.read.attach(0));
      if (PARAMS.render_bloom) {
        webGL.uniform1i(program.uniforms.uBloom, bloom.attach(1));
        webGL.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
        const scale = getTextureScale(ditheringTexture, width, height);
        webGL.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
      }
    }

    blit(target);
  }

  function applyBloom(source, destination) {
    if (bloomFrameBuffers.length < 2) {
      return;
    }

    let last = destination;

    webGL.disable(webGL.BLEND);
    PROGRAMS.bloomPreFilterProgram.bind();
    const knee = PARAMS.threshold * PARAMS.soft_knee + 0.0001;
    const curve0 = PARAMS.threshold - knee;
    const curve1 = knee * 2;
    const curve2 = 0.25 / knee;
    webGL.uniform3f(PROGRAMS.bloomPreFilterProgram.uniforms.curve, curve0, curve1, curve2);
    webGL.uniform1f(PROGRAMS.bloomPreFilterProgram.uniforms.threshold, PARAMS.threshold);
    webGL.uniform1i(PROGRAMS.bloomPreFilterProgram.uniforms.uTexture, source.attach(0));
    webGL.viewport(0, 0, last.width, last.height);
    blit(last.fbo);

    PROGRAMS.bloomBlurProgram.bind();
    for (let i = 0; i < bloomFrameBuffers.length; i++) {
      const dest = bloomFrameBuffers[i];
      webGL.uniform2f(PROGRAMS.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
      webGL.uniform1i(PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      webGL.viewport(0, 0, dest.width, dest.height);
      blit(dest.fbo);
      last = dest;
    }

    webGL.blendFunc(webGL.ONE, webGL.ONE);
    webGL.enable(webGL.BLEND);

    for (let i = bloomFrameBuffers.length - 2; i >= 0; i--) {
      const baseTex = bloomFrameBuffers[i];
      webGL.uniform2f(PROGRAMS.bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
      webGL.uniform1i(PROGRAMS.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      webGL.viewport(0, 0, baseTex.width, baseTex.height);
      blit(baseTex.fbo);
      last = baseTex;
    }

    webGL.disable(webGL.BLEND);
    PROGRAMS.bloomFinalProgram.bind();
    webGL.uniform2f(PROGRAMS.bloomFinalProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
    webGL.uniform1i(PROGRAMS.bloomFinalProgram.uniforms.uTexture, last.attach(0));
    webGL.uniform1f(PROGRAMS.bloomFinalProgram.uniforms.intensity, PARAMS.intensity);
    webGL.viewport(0, 0, destination.width, destination.height);
    blit(destination.fbo);
  }

  function splat(x, y, dx, dy, color) {
    webGL.viewport(0, 0, simWidth, simHeight);
    PROGRAMS.splatProgram.bind();
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, velocity.read.attach(0));
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    webGL.uniform2f(PROGRAMS.splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, dx, -dy, 1.0);
    webGL.uniform1f(PROGRAMS.splatProgram.uniforms.radius, PARAMS.emitter_size / 100.0);
    blit(velocity.write.fbo);
    velocity.swap();

    webGL.viewport(0, 0, dyeWidth, dyeHeight);
    webGL.uniform1i(PROGRAMS.splatProgram.uniforms.uTarget, density.read.attach(0));
    webGL.uniform3f(PROGRAMS.splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(density.write.fbo);
    density.swap();
  }

  function getRandomMultipleSplatsArgs() {
    // max natural values for r g b is 255 but
    // we can pass hihger values for brighness
    return {
      r: Math.round(Math.random() * 6),
      g: Math.round(Math.random() * 6),
      b: Math.round(Math.random() * 6),
      x: Math.round(Math.random() * canvas.clientWidth),
      y: Math.round(Math.random() * canvas.clientHeight),
      sizeX: Math.round(Math.random() * 200),
      sizeY: Math.round(Math.random() * 100),
    };
  }

  function multipleSplats({
    r = 255,
    g = 0,
    b = 0,
    x = canvas.clientWidth / 2,
    y = canvas.clientHeight / 2,
    sizeX = 100,
    sizeY = 100,
  } = {}) {
    const color = { r, g, b };
    splat(x, y, sizeX, sizeY, color);
  }

  function resizeCanvas() {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      init();
    }
  }

  function generateColor() {
    if (initialColor && !isInitialColorUsed) {
      isInitialColorUsed = true;
      return refineColor(initialColor);
    }

    const c = HSVtoRGB(Math.random(), PARAMS.saturation, PARAMS.brightness);
    return refineColor(c);
  }

  function refineColor(color) {
    const [mr, mg, mb] = PARAMS.rgb.multiplier;
    const [ar, ag, ab] = PARAMS.rgb.adder;
    color.r += ar;
    color.r *= mr;
    color.g += ag;
    color.g *= mg;
    color.b += ab;
    color.b *= mb;
    return color;
  }

  function HSVtoRGB(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r,
      g,
      b,
    };
  }

  function getResolution(resolution) {
    let aspectRatio = webGL.drawingBufferWidth / webGL.drawingBufferHeight;
    if (aspectRatio < 1) {
      aspectRatio = 1.0 / aspectRatio;
    }

    const max = Math.round(resolution * aspectRatio);
    const min = Math.round(resolution);

    if (webGL.drawingBufferWidth > webGL.drawingBufferHeight) {
      return { width: max, height: min };
    } else {
      return { width: min, height: max };
    }
  }

  function getTextureScale(texture, width, height) {
    return {
      x: width / texture.width,
      y: height / texture.height,
    };
  }

  let timeoutId;
  let shouldGenerateColorAgain = true;

  function mousemoveHandler(e) {
    /**
     * use it if you need to put the fluid inside a div that scrolls
     */
    // const scrollX = window.scrollX;
    // const scrollY = document.documentElement.scrollTop;
    const scrollX = 0;
    const scrollY = 0;
    const x = e.clientX + scrollX;
    const y = e.clientY + scrollY;

    pointers[0].dx = (x - pointers[0].x) * 5.0;
    pointers[0].dy = (y - pointers[0].y) * 5.0;
    pointers[0].x = x;
    pointers[0].y = y;

    if (PARAMS.effect_trigger === 'click') {
      pointers[0].moved = pointers[0].down;
      return;
    }

    pointers[0].moved = true;
    pointers[0].down = true; // Keep the pointer as "down" during movement to simulate the drawing behavior

    if (PARAMS.multi_color) {
      pointers[0].color = generateColor();
      return;
    }

    if (shouldGenerateColorAgain) {
      pointers[0].color = generateColor();
      shouldGenerateColorAgain = false;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Start timeout to regenerate color every x seconds
    timeoutId = setTimeout(() => {
      shouldGenerateColorAgain = true;
    }, PARAMS.hover_new_color_generator_timeout_if_multi_color_false);
  }

  function pointerdownHandler(_e) {
    if (PARAMS.effect_trigger === 'click') {
      pointers[0].down = true;
      pointers[0].color = generateColor();
    }
  }

  function pointerupHandler(_e) {
    if (PARAMS.effect_trigger === 'click') {
      pointers[0].down = false;
    }
  }

  function keydownHandler(e) {
    if (e.code === 'KeyP') {
      PARAMS.paused = !PARAMS.paused;
    }
    if (e.key === ' ') {
      splatStack.push({ ...getRandomMultipleSplatsArgs(), sizeX: 1000, sizeY: 500 });
    }
  }

  if (addListeners) {
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('pointerdown', pointerdownHandler);
    document.addEventListener('pointerup', pointerupHandler);
    document.addEventListener('keydown', keydownHandler);
  }

  return {
    getRandomMultipleSplatsArgs,
    multipleSplats,
    rafCallback,

    listeners: {
      mousemove: mousemoveHandler,
      pointerup: pointerupHandler,
      pointerdown: pointerdownHandler,
      keydown: keydownHandler,
    },
  };
}

/**
 * Set Dither URL
 *  Sets the URL to an image to be used for dithering.
 *
 * @param url: Path to dither in root directory.
 */
export function setDitherURL(url) {
  ditherURL = url;
}

/**
 * A WebGL program with the given vertex and fragment shaders.
 */
class GLProgram {
  constructor(vertexShader, fragmentShader, webGL) {
    this.uniforms = {};
    this.webGL = webGL;
    this.program = webGL.createProgram();

    // Create program from shader
    webGL.attachShader(this.program, vertexShader);
    webGL.attachShader(this.program, fragmentShader);
    webGL.linkProgram(this.program);

    // Check linking status
    if (!webGL.getProgramParameter(this.program, webGL.LINK_STATUS)) {
      throw webGL.getProgramInfoLog(this.program);
    }

    // Cache uniforms to class
    const uniformCount = webGL.getProgramParameter(this.program, webGL.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = webGL.getActiveUniform(this.program, i).name;
      this.uniforms[uniformName] = webGL.getUniformLocation(this.program, uniformName);
    }
  }

  /**
   * Sets shader program as part of current rendering state.
   */
  bind() {
    this.webGL.useProgram(this.program);
  }
}

class Pointer {
  constructor() {
    /** Identifier for the pointer object
     *
     *  @type {number} valid IDs are always either zero or a positive integer (-1 is invalid and should
     *  be managed upon creation of a new pointer object.)
     */
    this.id = -1;

    /** Horizontal (x) and vertical (y) position of the pointer
     *
     *  @type {number}
     */
    this.x = 0;
    this.y = 0;

    /** Velocity data describing the positional change in the horizontal (x) and vertical (y) axis of
     *  this pointer
     *
     * @type {number}
     */
    this.dx = 0;
    this.dy = 0;

    /** Boolean data member used to store whether or not the pointer is in a clicked state and/or a
     *  moving state
     *
     *  @type {boolean}
     */
    this.down = false;
    this.moved = false;

    /** The color the pointer will render as
     *
     * @type {number[]}
     */
    this.color = [30, 0, 300];
  }
}
