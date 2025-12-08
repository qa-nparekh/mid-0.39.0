"use strict";(self.webpackChunkplayground=self.webpackChunkplayground||[]).push([["702"],{43200:function(e,r,t){t.d(r,{o:()=>U,d:()=>M});var o=t(95098),n=t(45025),i=t(92245);function a(e,r,t){if(e)for(let o in e){let n=r[o.toLocaleLowerCase()];if(n){let r=e[o];"header"===o&&(r=r.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),t&&n.push(`//----${t}----//`),n.push(r)}else(0,i.Z)(`${o} placement hook does not exist in shader`)}}let u=/\{\{(.*?)\}\}/g;function l(e){let r={};return(e.match(u)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{r[e]=[]}),r}function s(e,r){let t,o=/@in\s+([^;]+);/g;for(;null!==(t=o.exec(e));)r.push(t[1])}function f(e,r,t=!1){let o=[];s(r,o),e.forEach(e=>{e.header&&s(e.header,o)}),t&&o.sort();let n=o.map((e,r)=>`       @location(${r}) ${e},`).join("\n"),i=r.replace(/@in\s+[^;]+;\s*/g,"");return i.replace("{{in}}",`
${n}
`)}function c(e,r){let t,o=/@out\s+([^;]+);/g;for(;null!==(t=o.exec(e));)r.push(t[1])}function v(e,r){let t=e;for(let e in r){let o=r[e];t=o.join("\n").length?t.replace(`{{${e}}}`,`//-----${e} START-----//
${o.join("\n")}
//----${e} FINISH----//`):t.replace(`{{${e}}}`,"")}return t}let d=Object.create(null),m=new Map,x=0;function p(e,r){return r.map(e=>(m.has(e)||m.set(e,x++),m.get(e))).sort((e,r)=>e-r).join("-")+e.vertex+e.fragment}function h(e,r,t){let o=l(e),n=l(r);return t.forEach(e=>{a(e.vertex,o,e.name),a(e.fragment,n,e.name)}),{vertex:v(e,o),fragment:v(r,n)}}let g=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,b=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,C=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,P=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,T={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},$={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function M({bits:e,name:r}){let t=function({template:e,bits:r}){let t=p(e,r);if(d[t])return d[t];let{vertex:o,fragment:n}=function(e,r){let t=r.map(e=>e.vertex).filter(e=>!!e),o=r.map(e=>e.fragment).filter(e=>!!e),n=f(t,e.vertex,!0);return{vertex:n=function(e,r){let t=[];c(r,t),e.forEach(e=>{e.header&&c(e.header,t)});let o=0,n=t.sort().map(e=>e.indexOf("builtin")>-1?e:`@location(${o++}) ${e}`).join(",\n"),i=t.sort().map(e=>`       var ${e.replace(/@.*?\s+/g,"")};`).join("\n"),a=`return VSOutput(
                ${t.sort().map(e=>` ${function(e){let r=/\b(\w+)\s*:/g.exec(e);return r?r[1]:""}(e)}`).join(",\n")});`,u=r.replace(/@out\s+[^;]+;\s*/g,"");return(u=(u=u.replace("{{struct}}",`
${n}
`)).replace("{{start}}",`
${i}
`)).replace("{{return}}",`
${a}
`)}(t,n),fragment:f(o,e.fragment,!0)}}(e,r);return d[t]=h(o,n,r),d[t]}({template:{fragment:b,vertex:g},bits:[T,...e]});return n.O.from({name:r,vertex:{source:t.vertex,entryPoint:"main"},fragment:{source:t.fragment,entryPoint:"main"}})}function U({bits:e,name:r}){return new o.J({name:r,...function({template:e,bits:r}){let t=p(e,r);return d[t]||(d[t]=h(e.vertex,e.fragment,r)),d[t]}({template:{vertex:C,fragment:P},bits:[$,...e]})})}},23149:function(e,r,t){t.d(r,{M:()=>o,T:()=>n});let o={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},n={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}},39193:function(e,r,t){t.d(r,{h:()=>a,m:()=>n});let o={};function n(e){return o[e]||(o[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;
    
                ${function(e){let r=[];{let e=0;for(let t=0;t<16;t++)r.push(`@group(1) @binding(${e++}) var textureSource${t+1}: texture_2d<f32>;`),r.push(`@group(1) @binding(${e++}) var textureSampler${t+1}: sampler;`)}return r.join("\n")}(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${function(e){let r=[];r.push("switch vTextureId {");for(let t=0;t<16;t++)t===e-1?r.push("  default:{"):r.push(`  case ${t}:{`),r.push(`      outColor = textureSampleGrad(textureSource${t+1}, textureSampler${t+1}, vUV, uvDx, uvDy);`),r.push("      break;}");return r.push("}"),r.join("\n")}(16)}
            `}}),o[e]}let i={};function a(e){return i[e]||(i[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;
              
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;
    
                uniform sampler2D uTextures[${e}];
              
            `,main:`
    
                ${function(e){let r=[];for(let e=0;e<16;e++)e>0&&r.push("else"),e<15&&r.push(`if(vTextureId < ${e}.5)`),r.push("{"),r.push(`	outColor = texture(uTextures[${e}], vUV);`),r.push("}");return r.join("\n")}(16)}
            `}}),i[e]}},78300:function(e,r,t){t.d(r,{$g:()=>i,Kt:()=>n,XH:()=>o});let o={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},n={...o,vertex:{...o.vertex,header:o.vertex.header.replace("group(1)","group(2)")}},i={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}}},71067:function(e,r,t){t.d(r,{X:()=>n,j:()=>o});let o={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},n={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}}},23947:function(e,r,t){t.d(r,{V:()=>o});function o(e,r,t){let o=(e>>24&255)/255;r[t++]=(255&e)/255*o,r[t++]=(e>>8&255)/255*o,r[t++]=(e>>16&255)/255*o,r[t++]=o}},88556:function(e,r,t){t.d(r,{c:()=>o});class o{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(e,r,t,o){let n=this.renderable,i=this.texture,a=n.groupTransform,u=a.a,l=a.b,s=a.c,f=a.d,c=a.tx,v=a.ty,d=this.bounds,m=d.maxX,x=d.minX,p=d.maxY,h=d.minY,g=i.uvs,b=n.groupColorAlpha,C=o<<16|65535&this.roundPixels;e[t+0]=u*x+s*h+c,e[t+1]=f*h+l*x+v,e[t+2]=g.x0,e[t+3]=g.y0,r[t+4]=b,r[t+5]=C,e[t+6]=u*m+s*h+c,e[t+7]=f*h+l*m+v,e[t+8]=g.x1,e[t+9]=g.y1,r[t+10]=b,r[t+11]=C,e[t+12]=u*m+s*p+c,e[t+13]=f*p+l*m+v,e[t+14]=g.x2,e[t+15]=g.y2,r[t+16]=b,r[t+17]=C,e[t+18]=u*x+s*p+c,e[t+19]=f*p+l*x+v,e[t+20]=g.x3,e[t+21]=g.y3,r[t+22]=b,r[t+23]=C}packIndex(e,r,t){e[r]=t+0,e[r+1]=t+1,e[r+2]=t+2,e[r+3]=t+0,e[r+4]=t+2,e[r+5]=t+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}}}]);
//# sourceMappingURL=702.60261735.js.map