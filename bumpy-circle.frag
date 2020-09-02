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

float bump(float c) {
  float i = floor(c);
  float f = fract(c);

  return mix(
    rand(i),
    rand(i + 1.),
    smoothstep(0., 1., f)
  );
}

vec3 bumpyCircle(float radius, in vec2 center, in vec2 st) {
  vec2 ptFromCenter = st - center;

  float angle = abs(atan(ptFromCenter.y, ptFromCenter.x));

  // subdividing angles
  angle *= 10. / PI;

  // time to offset color channels by
  float timeOffset = 1.;

  float r = angle + u_time;
  float g = angle + 1.5 * u_time + timeOffset;
  float b = angle + 3. * u_time + 2. * timeOffset;

  float bumpAmp = 20.;

  return vec3(
    plot(length(ptFromCenter), radius + bumpAmp * bump(r)),
    plot(length(ptFromCenter), radius + bumpAmp * bump(g)),
    plot(length(ptFromCenter), radius + bumpAmp * bump(b))
  ); 
}

void main() {
  vec2 st = gl_FragCoord.xy;
  vec2 center = u_resolution.xy / 2.;

  vec3 color = bumpyCircle(200., center, st);
  gl_FragColor = vec4(color, 1.);
}