import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const AnimatedShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const canvas = renderer.domElement
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;'
    container.appendChild(canvas)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: new THREE.Vector2(container.clientWidth || 1, container.clientHeight || 1) },
      },
      transparent: true,
      vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
      fragmentShader: `
        uniform float iTime;
        uniform vec2  iResolution;

        float hash(float n){ return fract(sin(n * 127.1) * 43758.5453); }

        void main(){
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          float aspect = iResolution.x / iResolution.y;
          uv.x *= aspect;

          /* Rotate 45° so the TL→BR diagonal becomes the +x axis.
             After rotation:
               r.x = position ALONG the streak (we scroll this)
               r.y = position ACROSS streaks  (lane assignment) */
          const float C = 0.70710678; // cos/sin of 45°
          vec2 r = vec2(
             uv.x * C + uv.y * C,
            -uv.x * C + uv.y * C
          );

          vec3 col = vec3(0.0);

          for(float i = 0.0; i < 18.0; i++){
            float h1 = hash(i);
            float h2 = hash(i + 50.0);
            float h3 = hash(i + 100.0);
            float h4 = hash(i + 150.0);

            /* Lane: spread across the perpendicular axis */
            float lane = (h1 * 2.0 - 1.0) * aspect * 0.9;

            /* Cross-section: thin Gaussian */
            float thick = 0.003 + h2 * 0.014;
            float dist  = abs(r.y - lane);
            float cross = exp(-dist * dist / (thick * thick));
            if(cross < 0.003) continue;

            /* Per-streak speed — fast range */
            float spd = 2.2 + h3 * 3.0;

            /* Scroll along the diagonal */
            float scroll = r.x - iTime * spd;

            /* Repeating comet segments */
            float period = 0.25 + h4 * 0.55;
            float t  = fract(scroll / period);
            float t2 = fract(scroll / period + 0.48);

            /* Comet profile: sharp bright head → long exponential tail */
            float streak  = exp(-t  * 7.0) * smoothstep(0.0, 0.04, 1.0 - t );
            float streak2 = exp(-t2 * 7.0) * smoothstep(0.0, 0.04, 1.0 - t2) * 0.35;

            /* Color: deep blue core → cyan → white at the cross-section peak */
            vec3 outerCol = vec3(0.04, 0.22, 0.90);
            vec3 innerCol = vec3(0.72, 0.93, 1.00);
            vec3 streakCol = mix(outerCol, innerCol, pow(cross, 0.5));

            float brightness = 0.3 + h2 * 0.7;
            col += streakCol * cross * (streak + streak2) * brightness;
          }

          /* Gentle bloom + tone-map so it never clips hard */
          col  = col * 2.2;
          col  = 1.0 - exp(-col);

          float a = max(col.r, max(col.g, col.b));
          gl_FragColor = vec4(col, a * 0.95);
        }
      `,
    })

    const geo = new THREE.PlaneGeometry(2, 2)
    scene.add(new THREE.Mesh(geo, material))

    let raf: number
    const tick = () => {
      material.uniforms.iTime.value += 0.016
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        renderer.setSize(width, height, false)
        material.uniforms.iResolution.value.set(width, height)
      }
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (container.contains(canvas)) container.removeChild(canvas)
      geo.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

export default AnimatedShaderBackground
