precision mediump float;
#define MAX_LIGHT 128

varying vec3 vPos;
varying vec3 vNormal;

struct objectProp{
    float ka;
    float kd;
    float ks;
    float shininess;
};

struct LightSource{
    vec3 lightPos;
    vec3 ambientColor;
    vec3 diffuseColor;
    vec3 specularColor;
    bool on;
};

uniform int n;
uniform objectProp objProperties;
uniform LightSource lights[MAX_LIGHT]; 

vec4 intensity(LightSource light){
    vec3 N = normalize(vNormal);
    vec3 L = normalize(light.lightPos - vPos);
    float lambertian = max(dot(N,L),0.0);

    // Ambient Intensity
    vec3 Ia = objProperties.ka * light.ambientColor;

    //Diffuse Intensity
    vec3 Id = objProperties.kd * lambertian * light.diffuseColor;

    // Specular intensity
    float specular = 0.0;
    if (lambertian > 0.0){
        //reflected light L
        vec3 R = reflect(-L,N);
        // vector to viewer
        vec3 V = normalize(-vPos);
        float A_spec = max(dot(R,V),0.0);
        specular = pow(A_spec,objProperties.shininess);
    }
    vec3 Is = objProperties.ks * specular * light.specularColor;
    return vec4(Ia + Id + Is, 1.0);  
}

void main(){
    for(int i = 0; i < n; i++){
        if(lights[i].on)
            gl_FragColor += intensity(lights[i]);
    }
    gl_FragColor.a = 1.0; 
}