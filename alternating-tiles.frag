// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float calcAlternatingDisplacement(float _coord, float _time) {
    return step(1., mod(_coord,2.0)) * 2. * _time - _time;
}

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;
    
    float offset = .5;
    float timeUnits = u_time;

    // Here is where the offset is happening
    if (bool(step(1., mod(timeUnits,2.0)))) {
        _st.x += calcAlternatingDisplacement(_st.y, timeUnits);
    } else {
		_st.y += calcAlternatingDisplacement(_st.x, timeUnits);
    }

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x -=  fract(2. / 5. * u_time);
    vec3 color = vec3(0.0);

    // Modern metric brick of 215mm x 102.5mm x 65mm
    // http://www.jaharrison.me.uk/Brickwork/Sizes.html
    // st /= vec2(0.830,0.840)/.5;

    // Apply the brick tiling
    st = brickTile(st,5.0);

    color = vec3(box(st,vec2(0.9)));

    // Uncomment to see the space coordinates
    // color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}
