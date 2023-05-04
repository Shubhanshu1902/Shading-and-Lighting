export const gouroudF = `
    precision mediump float;
    varying vec4 vColor;
    uniform vec3 aColor;

    void main(){
        gl_FragColor = vec4(0,0,0,1);
        gl_FragColor = vec4(aColor,1.0) * vColor;
    }
`

export const phongBlingF = `
    precision mediump float;
    #define MAX_LIGHT 10

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 sPos;
    uniform vec3 aColor;

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
            vec3 H = normalize(vPos + L);
            float A_spec = max(dot(H,normalize(-vNormal)),0.0);
            specular = pow(A_spec,objProperties.shininess);
        }
        vec3 Is = objProperties.ks * specular * light.specularColor;
        return vec4(Ia + Id + Is, 1.0);
    }

    void main(){
        gl_FragColor = vec4(0,0,0,1);
        for(int i = 0; i < n; i++){
            gl_FragColor +=  intensity(lights[i]);
        }
        gl_FragColor.a = 1.0;
        gl_FragColor = gl_FragColor * vec4(aColor,1.0);
    }
`

export const phongF = `
    precision mediump float;
    #define MAX_LIGHT 10

    uniform vec3 aColor;

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
        gl_FragColor = vec4(0,0,0,1);
        for(int i = 0; i < n; i++){
            if(lights[i].on)
                gl_FragColor += intensity(lights[i]);
        }
        gl_FragColor.a = 1.0; 
        gl_FragColor = gl_FragColor * vec4(aColor,1.0);
    }
`