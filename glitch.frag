#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define CIRCLE_RAD 0.10
#define LINE_WIDTH 0.01
#define PI 3.1415

float randomFromVec2_a(in vec2 p) {
  return fract(sin(dot(p,vec2(30.3331,320.5547)))*.8*u_time);
}

float randomFromVec2(in vec2 p) {
  return fract(sin(dot(p,vec2(30.3331,32.5547)))*.8*u_time);
}

float randomFromVec2_c(in vec2 p) {
  return fract(sin(dot(p,vec2(300.3331,32.5547)))*.8*u_time);
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

	st *= 32.;

	float time_disp = 1. * u_time;
	vec2 st_timed = st + 5. * time_disp;
	vec2 i_st = floor(st_timed);
	vec2 f_st = fract(st);
	vec2 f_st_timed = fract(st_timed);

	// get points of subspace square
	bool randBotLeft = randBool(i_st);
	bool randBotRight = randBool(i_st + vec2(1., 0.));
	bool randUpLeft = randBool(i_st + vec2(0., 1.));
	bool randUpRight = randBool(i_st + vec2(1., 1.));

	// get state of subspace
	int state = getState(randBotLeft, randBotRight, randUpLeft, randUpRight);

	// initialize color
	vec3 color = vec3(0.);
	float staticColor, dynamicColor;

	// handle each of 16 states
	if (state == 1) {
		staticColor = 1. - step(0.5, f_st.x + f_st.y);
		dynamicColor = 1. - step(0.5, f_st_timed.x + f_st_timed.y);
	} else if (state == 2) {
		staticColor = step(0.5, f_st.x - f_st.y);
		dynamicColor = step(0.5, f_st_timed.x - f_st_timed.y);
	} else if (state == 3) {
		staticColor = step(0.5, 1. - f_st.y);
		dynamicColor = step(0.5, 1. - f_st_timed.y);
	} else if (state == 4) {
		staticColor = step(0.5, f_st.y - f_st.x);
		dynamicColor = step(0.5, f_st_timed.y - f_st_timed.x);
	} else if (state == 5) {
		staticColor = step(0.5, 1. - f_st.x);
		dynamicColor = step(0.5, 1. - f_st_timed.x);
	} else if (state == 6) {
		staticColor = step(0.5, f_st.x + f_st.y) * (1. - step(1.5, f_st.x + f_st.y));
		dynamicColor = step(0.5, f_st_timed.x + f_st_timed.y) * (1. - step(1.5, f_st_timed.x + f_st_timed.y));
	} else if (state == 7) {
		staticColor = 1. - step(1.5, f_st.x + f_st.y);
		dynamicColor = 1. - step(1.5, f_st_timed.x + f_st_timed.y);
	} else if (state == 8) {
		staticColor = step(1.5, f_st.x + f_st.y);
		dynamicColor = step(1.5, f_st_timed.x + f_st_timed.y);
	} else if (state == 9) {
		staticColor = step(-0.5, f_st.y - f_st.x) * (1. - step(0.5, f_st.y - f_st.x));
		dynamicColor = step(-0.5, f_st_timed.y - f_st_timed.x) * (1. - step(0.5, f_st_timed.y - f_st_timed.x));
	} else if (state == 10) {
		staticColor = step(0.5, f_st.x);
		dynamicColor = step(0.5, f_st_timed.x);
	} else if (state == 11) {
		staticColor = step(-0.5, f_st.x - f_st.y);
		dynamicColor = step(-0.5, f_st_timed.x - f_st_timed.y);
	} else if (state == 12) {
		staticColor = step(0.5, f_st.y);
		dynamicColor = step(0.5, f_st_timed.y);
	} else if (state == 13) {
		staticColor = step(-0.5, f_st.y - f_st.x);
		dynamicColor = step(-0.5, f_st_timed.y - f_st_timed.x);
	} else if (state == 14) {
		staticColor = step(0.5, f_st.x + f_st.y);
		dynamicColor = step(0.5, f_st_timed.x + f_st_timed.y);
	} else if (state == 15) {
		staticColor = 1.;
		dynamicColor = 1.;
	}

	color.rb += 1. - staticColor; 
	color.gb += 1. - dynamicColor;

  gl_FragColor = vec4(color, 1.);
}