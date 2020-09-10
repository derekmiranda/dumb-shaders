#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define CIRCLE_RAD 0.10
#define LINE_WIDTH 0.01
#define PI 3.1415

float randomFromVec2(in vec2 p) {
  return fract(sin(dot(p,vec2(30.3331,320.5547)))*40000.);
}

bool randBool(in vec2 p) {
	return randomFromVec2(p) > 0.5;
}

float filledCircle(in vec2 f_st) {
	return 1. - step(CIRCLE_RAD, distance(vec2(0., 0.), f_st));
}

float emptyCircle(in vec2 f_st) {
	float distFromOrigin = distance(vec2(0., 0.), f_st);
	return (1. - step(CIRCLE_RAD, distFromOrigin))
		* (step(CIRCLE_RAD - LINE_WIDTH, distFromOrigin));
}

int getState(bool a, bool b, bool c, bool d) {
	return int(a) * 1
			 + int(b) * 2
			 + int(c) * 4
			 + int(d) * 8;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

	st *= 64.;

	vec2 i_st = floor(st);
	vec2 f_st = fract(st);

	// get points of subspace square
	bool randBotLeft = randBool(i_st);
	bool randBotRight = randBool(i_st + vec2(1., 0.));
	bool randUpLeft = randBool(i_st + vec2(0., 1.));
	bool randUpRight = randBool(i_st + vec2(1., 1.));

	// get state of subspace
	int state = getState(randBotLeft, randBotRight, randUpLeft, randUpRight);

	// initialize color
	vec3 color = vec3(0.);

	// handle each of 16 states
	if (state == 1) {
		color += 1. - step(.5, f_st.x + f_st.y);
	} else if (state == 2) {
		color += step(0.5, f_st.x - f_st.y);
	} else if (state == 3) {
		color += step(0.5, 1. - f_st.y);
	} else if (state == 4) {
		color += step(0.5, f_st.y - f_st.x);
	} else if (state == 5) {
		color += step(0.5, 1. - f_st.x);
	} else if (state == 6) {
		color += step(0.5, f_st.x + f_st.y) * (1. - step(1.5, f_st.x + f_st.y));
	} else if (state == 7) {
		color += 1. - step(1.5, f_st.x + f_st.y);
	} else if (state == 8) {
		color += step(1.5, f_st.x + f_st.y);
	} else if (state == 9) {
		color += step(-0.5, f_st.y - f_st.x) * (1. - step(0.5, f_st.y - f_st.x));
	} else if (state == 10) {
		color += step(0.5, f_st.x);
	} else if (state == 11) {
		color += step(-0.5, f_st.x - f_st.y);
	} else if (state == 12) {
		color += step(0.5, f_st.y);
	} else if (state == 13) {
		color += step(-0.5, f_st.y - f_st.x);
	} else if (state == 14) {
		color += step(0.5, f_st.x + f_st.y);
	} else if (state == 15) {
		color += 1.;
	}

  gl_FragColor = vec4(color, 1.);
}