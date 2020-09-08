#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

  // scale space
  st *= 4.;

  // tile space
  vec2 i = floor(st);
  vec2 f = fract(st);


  // keep track of minimum distance(s) to point
  float m_dist_1 = 10.;
  float m_dist_2 = 10.;
  vec2 p1 = vec2(0.);
  vec2 p2 = vec2(0.);
  vec3 color = vec3(0.);

  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighbor = vec2(float(x), float(y));

      // get neighboring point
      vec2 p = random2(i + neighbor);

      // animate points
      p = 0.5 + 0.5 * sin(u_time + 7. * p);

      vec2 diff = neighbor + p - f;

      float dist = length(diff);

      if (dist <= m_dist_1) {
        m_dist_2 = m_dist_1;
        m_dist_1 = dist;

        p2 = p1;
        p1 = p;
      }
      else if (dist <= m_dist_2) {
        m_dist_2 = dist;

        p2 = p;
      }
    }
  }

  // normalize
  color.gb = p1;
  color.rg = p2;

  // mark points in each subspace
  // color += 1. - step(0.02, m_dist_1);

  // Draw grid
  // color.r += step(.98, f.x) + step(.98, f.y);

  gl_FragColor = vec4(color, 1.);
}