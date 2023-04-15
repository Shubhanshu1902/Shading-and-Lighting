export const gouroudF = `
    precision mediump float;
    varying vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
`

export const phongF = `
    precision mediump float;

    varying vec3 vPos;
    varying vec3 vNormal;

    struct LightSource{
        vec3 lightPos;
        float ka;
        vec3 ambientColor;
        float kd;
        vec3 diffuseColor;
        float ks;
        vec3 specularColor;
        float shininess;
    };

    uniform LightSource light;

    void main(){
        vec3 N = normalize(vNormal);
        vec3 L = normalize(light.lightPos - vPos);
        float lambertian = max(dot(N,L),0.0);
        
        // Ambient Intensity
        vec3 Ia = light.ka * light.ambientColor;
        
        //Diffuse Intensity
        vec3 Id = light.kd * lambertian * light.diffuseColor;
        
        // Specular intensity
        float specular = 0.0;
        if (lambertian > 0.0){
            //reflected light L
            vec3 R = reflect(-L,N);
            // vector to viewer
            vec3 V = normalize(-vPos);
            float A_spec = max(dot(R,V),0.0);
            specular = pow(A_spec,light.shininess);
        }
        vec3 Is = light.ks * specular * light.specularColor;
        
        gl_FragColor = vec4(Ia + Id + Is, 1.0);     
    }
`

export const phongBlingF = `
precision mediump float;

varying vec3 vPos;
varying vec3 vNormal;
varying vec3 sPos;

struct LightSource{
    vec3 lightPos;
    float ka;
    vec3 ambientColor;
    float kd;
    vec3 diffuseColor;
    float ks;
    vec3 specularColor;
    float shininess;
};

uniform LightSource light;

void main(){
    vec3 N = normalize(vNormal);
    vec3 L = normalize(light.lightPos - vPos);
    float lambertian = max(dot(N,L),0.0);
    
    // Ambient Intensity
    vec3 Ia = light.ka * light.ambientColor;
    
    //Diffuse Intensity
    vec3 Id = light.kd * lambertian * light.diffuseColor;
    
    // Specular intensity
    float specular = 0.0;
    if (lambertian > 0.0){
        //reflected light L
        vec3 H = normalize(vPos + L);
        float A_spec = max(dot(H,normalize(-vNormal)),0.0);
        specular = pow(A_spec,light.shininess);
    }
    vec3 Is = light.ks * specular * light.specularColor;
    
    gl_FragColor = vec4(Ia + Id + Is, 1.0);     
}
`

export const phong3V = `
    precision mediump float;

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 sPos;

    struct LightSource{
        vec3 lightPos;
        float ka;
        vec3 ambientColor;
        float kd;
        vec3 diffuseColor;
        float ks;
        vec3 specularColor;
        float shininess;
    };

    const int n = 3;
    uniform LightSource light[n];

    vec4 intensity(LightSource light){
        vec3 N = normalize(vNormal);
        vec3 L = normalize(light.lightPos - vPos);
        float lambertian = max(dot(N,L),0.0);
        
        // Ambient Intensity
        vec3 Ia = light.ka * light.ambientColor;
        
        //Diffuse Intensity
        vec3 Id = light.kd * lambertian * light.diffuseColor;
        
        // Specular intensity
        float specular = 0.0;
        if (lambertian > 0.0){
            //reflected light L
            vec3 H = normalize(vPos + L);
            float A_spec = max(dot(H,normalize(-vNormal)),0.0);
            specular = pow(A_spec,light.shininess);
        }
        vec3 Is = light.ks * specular * light.specularColor;
        return vec4(Ia + Id + Is, 1.0);
    }

    void main(){
        for(int i = 0; i < n; i++){
            gl_FragColor += intensity(light[i]);
        }     
        gl_FragColor.a = 1.0;
    }
`