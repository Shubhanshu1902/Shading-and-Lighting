export const v1 = `
    varying vec3 vPos;
    varying vec3 vNormal;
    
    void main(){
        vPos = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`
