varying vec3 vNormal;
varying vec3 vPos;
varying vec3 sPos;

void main() {
    vec4 temp = modelViewMatrix * vec4(position,1.0);
    vPos = vec3(temp)/temp.w;
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * temp; 
}