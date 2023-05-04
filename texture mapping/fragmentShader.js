export const v1f = `
    precision mediump float;
    #define M_PI 3.1415926535897932384626433832795
    uniform vec3 c1;
    uniform vec3 c2;
    uniform vec3 c3;
    uniform vec3 c4;
    uniform sampler2D t1;

    varying vec3 vPos;
    void main(){
        vec3 pos = normalize(vPos.xyz);
        vec2 uv = vec2(atan(pos.z,pos.x)/(2.0*M_PI) + 0.5,asin(pos.y)/M_PI + 0.5);
        gl_FragColor = texture2D(t1,uv);
    }
`

export const v2f = `
    precision mediump float;
    #define M_PI 3.1415926535897932384626433832795
    uniform vec3 c1;
    uniform vec3 c2;
    uniform vec3 c3;
    uniform vec3 c4;
    uniform sampler2D t1;

    varying vec3 vPos;
    void main(){
        vec3 pos = normalize(vPos.xyz);
        vec2 uv = vec2(atan(pos.z,pos.x)/(2.0 * M_PI) + 0.5,mod(pos.y,1.0));
        gl_FragColor = texture2D(t1,uv);
    }
`