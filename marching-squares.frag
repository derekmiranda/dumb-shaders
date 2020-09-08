#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define CIRCLE_RAD 0.10
#define LINE_WIDTH 0.01
#define UNIT_HYP_LEN 1.41421356237

float randomFromVec2( vec2 p ) {
    return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}

float filledCircle(in vec2 f_st) {
	return 1. - step(CIRCLE_RAD, distance(vec2(0., 0.), f_st));
}

float emptyCircle(in vec2 f_st) {
	float distFromOrigin = distance(vec2(0., 0.), f_st);
	return (1. - step(CIRCLE_RAD, distFromOrigin))
		* (step(CIRCLE_RAD - LINE_WIDTH, distFromOrigin));
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

	st *= 5.;
	st += 10.;

	vec2 i_st = floor(st);
	vec2 f_st = fract(st);

	// get points of subspace square
	float randBotLeft = randomFromVec2(i_st);
	float randBotRight = randomFromVec2(i_st + vec2(0., 1.));
	float randUpLeft = randomFromVec2(i_st + vec2(1., 0.));
	float randUpRight = randomFromVec2(i_st + vec2(1., 1.));

	vec3 color = vec3(0.);
	color += step(0.5, f_st.x + f_st.y);
	// color += step(.5, f_st.y - f_st.x);
	// color += step(.5, f_st.x - f_st.y);

  gl_FragColor = vec4(color, 1.);
}