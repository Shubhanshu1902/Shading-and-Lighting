    precision mediump float;
    #define MAX_LIGHT 128 

    //Output
    varying vec4 vColor;
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
        // Ambient Intensity
        vec3 Ia = objProperties.ka * light.ambientColor;

        vec3 N = normalize(vNormal);
        vec3 L = normalize(light.lightPos - vPos);
        float lambertian = max(dot(N,L),0.0);

        //Diffuse Intensity
        vec3 Id = objProperties.kd * lambertian * light.diffuseColor;

        // Specular intensity
        float specular = 0.0;
        if (lambertian > 0.0){
            vec3 H = normalize(L + vPos);
            float A_spec = max(dot(H,normalize(-vNormal)),0.0);
            specular = pow(A_spec,objProperties.shininess);
        }
        vec3 Is = objProperties.ks * specular * light.specularColor;
        return vec4(Ia + Id + Is, 1.0);
    }

    void main(){
        vec4 vertPos4 = modelViewMatrix * vec4(position,1.0);
        vPos = vec3(vertPos4)/vertPos4.w;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * vertPos4; 

        for(int i = 0; i < n; i++){
            if(lights[i].on)
                vColor += intensity(lights[i]);
        }
    }