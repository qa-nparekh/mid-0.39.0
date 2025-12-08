"use strict";(self.webpackChunkandroid_playground=self.webpackChunkandroid_playground||[]).push([["702"],{43200:function(e,r,o){o.d(r,{d:()=>M,o:()=>U});var t=o(95098),n=o(45025),i=o(92245);function a(e,r,o){if(e)for(let t in e){let n=r[t.toLocaleLowerCase()];if(n){let r=e[t];"header"===t&&(r=r.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),o&&n.push(`//----${o}----//`),n.push(r)}else(0,i.Z)(`${t} placement hook does not exist in shader`)}}let u=/\{\{(.*?)\}\}/g;function l(e){let r={};return(e.match(u)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{r[e]=[]}),r}function s(e,r){let o,t=/@in\s+([^;]+);/g;for(;null!==(o=t.exec(e));)r.push(o[1])}function f(e,r,o=!1){let t=[];s(r,t),e.forEach(e=>{e.header&&s(e.header,t)}),o&&t.sort();let n=t.map((e,r)=>`       @location(${r}) ${e},`).join("\n"),i=r.replace(/@in\s+[^;]+;\s*/g,"");return i.replace("{{in}}",`
${n}
`)}function c(e,r){let o,t=/@out\s+([^;]+);/g;for(;null!==(o=t.exec(e));)r.push(o[1])}function v(e,r){let o=e;for(let e in r){let t=r[e];o=t.join("\n").length?o.replace(`{{${e}}}`,`//-----${e} START-----//
${t.join("\n")}
//----${e} FINISH----//`):o.replace(`{{${e}}}`,"")}return o}let d=Object.create(null),m=new Map,x=0;function p(e,r){return r.map(e=>(m.has(e)||m.set(e,x++),m.get(e))).sort((e,r)=>e-r).join("-")+e.vertex+e.fragment}function h(e,r,o){let t=l(e),n=l(r);return o.forEach(e=>{a(e.vertex,t,e.name),a(e.fragment,n,e.name)}),{vertex:v(e,t),fragment:v(r,n)}}let g=`
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
        `}};function M({bits:e,name:r}){let o=function({template:e,bits:r}){let o=p(e,r);if(d[o])return d[o];let{vertex:t,fragment:n}=function(e,r){let o=r.map(e=>e.vertex).filter(e=>!!e),t=r.map(e=>e.fragment).filter(e=>!!e),n=f(o,e.vertex,!0);return{vertex:n=function(e,r){let o=[];c(r,o),e.forEach(e=>{e.header&&c(e.header,o)});let t=0,n=o.sort().map(e=>e.indexOf("builtin")>-1?e:`@location(${t++}) ${e}`).join(",\n"),i=o.sort().map(e=>`       var ${e.replace(/@.*?\s+/g,"")};`).join("\n"),a=`return VSOutput(
                ${o.sort().map(e=>` ${function(e){let r=/\b(\w+)\s*:/g.exec(e);return r?r[1]:""}(e)}`).join(",\n")});`,u=r.replace(/@out\s+[^;]+;\s*/g,"");return(u=(u=u.replace("{{struct}}",`
${n}
`)).replace("{{start}}",`
${i}
`)).replace("{{return}}",`
${a}
`)}(o,n),fragment:f(t,e.fragment,!0)}}(e,r);return d[o]=h(t,n,r),d[o]}({template:{fragment:b,vertex:g},bits:[T,...e]});return n.O.from({name:r,vertex:{source:o.vertex,entryPoint:"main"},fragment:{source:o.fragment,entryPoint:"main"}})}function U({bits:e,name:r}){return new t.J({name:r,...function({template:e,bits:r}){let o=p(e,r);return d[o]||(d[o]=h(e.vertex,e.fragment,r)),d[o]}({template:{vertex:C,fragment:P},bits:[$,...e]})})}},23149:function(e,r,o){o.d(r,{M:()=>t,T:()=>n});let t={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},n={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}},39193:function(e,r,o){o.d(r,{h:()=>a,m:()=>n});let t={};function n(e){return t[e]||(t[e]={name:"texture-batch-bit",vertex:{header:`
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
    
                ${function(e){let r=[];{let e=0;for(let o=0;o<16;o++)r.push(`@group(1) @binding(${e++}) var textureSource${o+1}: texture_2d<f32>;`),r.push(`@group(1) @binding(${e++}) var textureSampler${o+1}: sampler;`)}return r.join("\n")}(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${function(e){let r=[];r.push("switch vTextureId {");for(let o=0;o<16;o++)o===e-1?r.push("  default:{"):r.push(`  case ${o}:{`),r.push(`      outColor = textureSampleGrad(textureSource${o+1}, textureSampler${o+1}, vUV, uvDx, uvDy);`),r.push("      break;}");return r.push("}"),r.join("\n")}(16)}
            `}}),t[e]}let i={};function a(e){return i[e]||(i[e]={name:"texture-batch-bit",vertex:{header:`
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
            `}}),i[e]}},78300:function(e,r,o){o.d(r,{$g:()=>i,Kt:()=>n,XH:()=>t});let t={name:"local-uniform-bit",vertex:{header:`

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
        `}},n={...t,vertex:{...t.vertex,header:t.vertex.header.replace("group(1)","group(2)")}},i={name:"local-uniform-bit",vertex:{header:`

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
        `}}},71067:function(e,r,o){o.d(r,{X:()=>n,j:()=>t});let t={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},n={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}}},23947:function(e,r,o){o.d(r,{V:()=>t});function t(e,r,o){let t=(e>>24&255)/255;r[o++]=(255&e)/255*t,r[o++]=(e>>8&255)/255*t,r[o++]=(e>>16&255)/255*t,r[o++]=t}},88556:function(e,r,o){o.d(r,{c:()=>t});class t{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(e,r,o,t){let n=this.renderable,i=this.texture,a=n.groupTransform,u=a.a,l=a.b,s=a.c,f=a.d,c=a.tx,v=a.ty,d=this.bounds,m=d.maxX,x=d.minX,p=d.maxY,h=d.minY,g=i.uvs,b=n.groupColorAlpha,C=t<<16|65535&this.roundPixels;e[o+0]=u*x+s*h+c,e[o+1]=f*h+l*x+v,e[o+2]=g.x0,e[o+3]=g.y0,r[o+4]=b,r[o+5]=C,e[o+6]=u*m+s*h+c,e[o+7]=f*h+l*m+v,e[o+8]=g.x1,e[o+9]=g.y1,r[o+10]=b,r[o+11]=C,e[o+12]=u*m+s*p+c,e[o+13]=f*p+l*m+v,e[o+14]=g.x2,e[o+15]=g.y2,r[o+16]=b,r[o+17]=C,e[o+18]=u*x+s*p+c,e[o+19]=f*p+l*x+v,e[o+20]=g.x3,e[o+21]=g.y3,r[o+22]=b,r[o+23]=C}packIndex(e,r,o){e[r]=o+0,e[r+1]=o+1,e[r+2]=o+2,e[r+3]=o+0,e[r+4]=o+2,e[r+5]=o+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}}}]);
//# sourceMappingURL=702.1f38a17e.js.map