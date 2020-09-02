#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265
#define black vec3(0.)
#define blue vec3(0.051, 0.8824, 0.9137)
#define pink vec3(0.8745, 0.3373, 0.5882)
#define linewt 1.
#define zoom 15.
#define amp 5.

uniform float u_time;
uniform vec2 u_resolution;

float rand(float x) {
  return fract(sin(x)*1.0);;
}

float plot(float val, float target) {
  return smoothstep(target - linewt, target, val)
    * (1. - smoothstep(target, target + linewt, val));
}

float horizontalLines(in vec2 st) {
  float xVal = (mod(st.x, 1.));
  return smoothstep(-linewt, 0., xVal)
    * (1. - smoothstep(0., linewt, xVal));
}

float bumpyCircle(float radius, in vec2 center, in vec2 st) {
  vec2 ptFromCenter = st - center;
  float angle = atan(ptFromCenter.y, ptFromCenter.x);
  angle *= 50. / PI;
  float f = fract(angle);

  float bump = mix(
    rand(angle + u_time),
    rand(angle + u_time + 1.),
    f
  ); 
  return plot(length(ptFromCenter), radius + 10. * bump); 
}

void main() {
  vec2 st = gl_FragCoord.xy;
  vec2 center = u_resolution.xy / 2.;

  vec3 color = vec3(bumpyCircle(200., center, st));
  gl_FragColor = vec4(color, 1.);
}