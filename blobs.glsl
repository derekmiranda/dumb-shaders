#define blue1 vec3(0.027,0.357,0.525)
#define blue2 vec3(0.74,0.95,1.00)

#define PI 3.14159265359
#define RADIUS 150. 
#define LINE_WIDTH 1.
#define ASPECT 640. / 360.

float plotLine(in vec2 uv, in vec2 center, float radius, float angle) {
    vec2 vecFromCenter = uv - center;
    float d = sqrt(dot(vecFromCenter, vecFromCenter));
    
    if (d < radius) {
        vec2 lineDir = vec2(cos(angle), sin(angle));
        float dotProd = dot(vecFromCenter, lineDir) / (radius);
        float cosSqrd = pow(dotProd, 2.);
        float distFromLine = d * sqrt(1. - cosSqrd);
        return 1. - step(75. + sin(iTime) * 75., distFromLine);
    } else return 0.;
}

float circle(float radius, in vec2 uv, in vec2 center) {
    float d = distance(uv, center);
    return smoothstep(radius - LINE_WIDTH, radius, d)
		   * (1. - smoothstep(radius, radius + LINE_WIDTH, d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // pixel coordinates
    vec2 uv = fragCoord.xy;
    vec2 st = uv / iResolution.xy;
    vec2 center = iResolution.xy / 2.;
    
    
    // background
    vec3 color = mix(vec3(0.0), blue1, st.x);
    
    // plotting
    vec2 origin = vec2(0.5);
    // float plotVal = plot(uv, origin, RADIUS, iTime, aspectRatio);
    
    // plot line from center to right
    // color = color + plotVal;
    
    float plotVal = circle(50., uv, center);
    plotVal += circle(100., uv, center);
    plotVal += circle(150., uv, center);
    plotVal += plotLine(uv, center, RADIUS, iTime);
    
    color = (1. - plotVal)*color + plotVal;

    // Output to screen
    fragColor = vec4(color, 1.0);
}