// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846
#define grey vec3(0.451, 0.3922, 0.7922)
#define red vec3(0.9333, 0.1961, 0.5412)

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    _st -= (_zoom - 1.) / 2.;
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = red;

    // Divide the space in 4
    st = tile(st,4.192);

    // Draw a square
    color = mix(color, grey, box(st,vec2(0.8),0.01));
    
    // diagonal lines
    color = mix(color, grey, mod(5. + 5. * sin(u_time) * (st.x + st.y), 2.456));

    gl_FragColor = vec4(color,1.0);
}
