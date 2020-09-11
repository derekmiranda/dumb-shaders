#ifdef GL_ES
precision mediump float;
#endif

#define linewt .01
#define samples 3.0

uniform vec2 u_resolution;

float function(float x) {
	return pow(x, .5);
}

float plot(in vec2 st) {
	// return smoothstep(-linewt, 0., abs(target - st.y))
	// 	* (1. - smoothstep(0., linewt, abs(target - st.y)));

	// check nearby pixels
	vec2 pixel = 1. / u_resolution.xy;
		
	int count = 0;

	for (float i = 0.0; i < samples; i++) {
		for (float  j = 0.0;j < samples; j++) {
			float f = function(st.x+ i*pixel.x)-(st.y+ j*pixel.y);
			count += (f>0.) ? 1 : -1;
		}
	}

	// base color on abs(count)/(samples*samples)
	return abs(float(count)) / (samples * samples);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
	st.x *= u_resolution.x / u_resolution.y;

	float val = plot(st);

	gl_FragColor = vec4(vec3(val), 1.);
}