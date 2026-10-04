// Minified Game logic

(()=>{
const $=id=>document.getElementById(id);
if(!window.THREE){document.querySelector('#menu p').textContent='Не удалось загрузить three.js. Проверьте подключение к интернету.';return;}
const N=15,CELL=80,HALF=30,LIM=602,PI=Math.PI;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=a=>{while(a>PI)a-=2*PI;while(a<-PI)a+=2*PI;return a;};
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(e){document.querySelector('#menu p').textContent='WebGL недоступен в этом браузере.';return;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xa8826a,.0021);
const camera=new THREE.PerspectiveCamera(60,1,.3,4000);
const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;};
const tex=(c)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;};
/* небо и окружение */
const skyC=cv(512,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);[[0,'#16295a'],[.3,'#4a68a8'],[.46,'#e99a68'],[.5,'#f7b87e'],[.52,'#7a6068'],[1,'#2a2528']].forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,w,h);});
const skyT=new THREE.CanvasTexture(skyC);skyT.encoding=THREE.sRGBEncoding;
const sky=new THREE.Mesh(new THREE.SphereGeometry(2500,32,16),new THREE.MeshBasicMaterial({map:skyT,side:THREE.BackSide,fog:false,depthWrite:false}));scene.add(sky);
const radial=c=>new THREE.CanvasTexture(cv(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,`rgba(${c},1)`);r.addColorStop(.25,`rgba(${c},.35)`);r.addColorStop(1,`rgba(${c},0)`);g.fillStyle=r;g.fillRect(0,0,64,64);}));
const glowT=radial('255,255,255');
const glowMat=(c,o=1)=>new THREE.SpriteMaterial({map:glowT,color:c,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:o});
try{const envT=new THREE.CanvasTexture(skyC);envT.encoding=THREE.sRGBEncoding;envT.mapping=THREE.EquirectangularReflectionMapping;const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromEquirectangular(envT).texture;}catch(e){}
scene.add(new THREE.HemisphereLight(0x9bb2e6,0x40362f,.7));
const sun=new THREE.DirectionalLight(0xffb27a,2.4);const sunDir=new THREE.Vector3(-.6,.45,.5).normalize().multiplyScalar(220);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=sc.bottom=-100;sc.right=sc.top=100;sc.near=10;sc.far=520;sun.shadow.bias=-.0004;sun.shadow.normalBias=.4;
scene.add(sun,sun.target);
{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,color:0xffa860,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));sp.position.copy(sunDir).normalize().multiplyScalar(2300);sp.scale.set(900,900,1);sky.add(sp);
const p=new Float32Array(1200);for(let i=0;i<400;i++){const a=Math.random()*2*PI,e=.5+Math.random()*1,r=2400;p[i*3]=Math.cos(a)*Math.cos(e)*r;p[i*3+1]=Math.sin(e)*r;p[i*3+2]=Math.sin(a)*Math.cos(e)*r;}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));sky.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,fog:false,transparent:true,opacity:.6,depthWrite:false})));}
/* дороги */
const asph=cv(256,256,(g,w,h)=>{g.fillStyle='#2b2c2f';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const v=28+Math.random()*34|0;g.fillStyle=`rgb(${v},${v},${v+3})`;g.fillRect(Math.random()*w,Math.random()*h,1.6,1.6);}});
const at=tex(asph);at.repeat.set(150,150);
const road=new THREE.Mesh(new THREE.PlaneGeometry(1240,1240),new THREE.MeshStandardMaterial({map:at,bumpMap:at,bumpScale:1.5,roughness:.6,metalness:0}));road.rotation.x=-PI/2;road.receiveShadow=true;scene.add(road);
const gnd=new THREE.Mesh(new THREE.PlaneGeometry(8000,8000),new THREE.MeshStandardMaterial({color:0x1c2018,roughness:1}));gnd.rotation.x=-PI/2;gnd.position.y=-.05;scene.add(gnd);
const dg=new THREE.PlaneGeometry(.35,3.5);dg.rotateX(-PI/2);
const dashes=new THREE.InstancedMesh(dg,new THREE.MeshStandardMaterial({color:0xe8e2c0,roughness:.7}),7000);
const D=new THREE.Object3D();let dn=0;
for(let i=-1;i<=14;i++){const r=(i-7)*CELL+40;for(let s=-590;s<=590;s+=8){const d=(((s-40)%80)+80)%80;if(d<14||d>66)continue;
 D.position.set(r,.02,s);D.rotation.y=0;D.updateMatrix();dashes.setMatrixAt(dn++,D.matrix);
 D.position.set(s,.02,r);D.rotation.y=PI/2;D.updateMatrix();dashes.setMatrixAt(dn++,D.matrix);}}
dashes.count=Math.min(dn,7000);dashes.receiveShadow=true;scene.add(dashes);
/* здания */
const winMap=(lit,em)=>tex(cv(256,256,(g,w,h)=>{g.fillStyle=em?'#000':'#4b4f58';g.fillRect(0,0,w,h);for(let r=0;r<4;r++)for(let c=0;c<4;c++){const l=lit[r*4+c];g.fillStyle=em?(l?'#ffcf80':'#000'):(l?'#ffd9a0':'#1b2230');g.fillRect(c*64+14,r*64+12,36,40);}}));
const bmats=[0xffffff,0xd9c9b6,0xb7c3d2].map(c=>{const lit=Array.from({length:16},()=>Math.random()<.42);return new THREE.MeshStandardMaterial({color:c,map:winMap(lit,false),emissive:0xffffff,emissiveMap:winMap(lit,true),emissiveIntensity:.9,roughness:.6,metalness:.25});});
const roofs=[];const conT=tex(cv(128,128,(g,w,h)=>{g.fillStyle='#8c8c88';g.fillRect(0,0,w,h);for(let i=0;i<2500;i++){const v=110+Math.random()*50|0;g.fillStyle=`rgb(${v},${v},${v-3})`;g.fillRect(Math.random()*w,Math.random()*h,2,2);}g.strokeStyle='#5d5d5a';g.lineWidth=3;g.strokeRect(0,0,w,h);}));conT.repeat.set(15,15);
const sw=new THREE.InstancedMesh(new THREE.BoxGeometry(60,.4,60),new THREE.MeshStandardMaterial({map:conT,roughness:.95}),N*N);sw.receiveShadow=true;
{let k=0;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const cx=(i-7)*CELL,cz=(j-7)*CELL;D.rotation.y=0;D.position.set(cx,.2,cz);D.updateMatrix();sw.setMatrixAt(k++,D.matrix);
 const w=38+Math.random()*16,dp=38+Math.random()*16,h=14+Math.pow(Math.random(),2.2)*110;
 const g=new THREE.BoxGeometry(w,h,dp),uv=g.attributes.uv;
 for(let v=0;v<24;v++){let u=uv.getX(v),t=uv.getY(v);if(v<8){u*=dp/16;t*=h/16;}else if(v<16){u=t=.01;}else{u*=w/16;t*=h/16;}uv.setXY(v,u,t);}
 g.translate(cx,.4+h/2,cz);roofs.push([cx,cz,h,w,dp]);const m=new THREE.Mesh(g,bmats[(i*3+j)%3]);m.castShadow=m.receiveShadow=true;scene.add(m);}}
scene.add(sw);
{/* зебры */
 const zg=new THREE.PlaneGeometry(.9,3.2);zg.rotateX(-PI/2);
 const zb=new THREE.InstancedMesh(zg,new THREE.MeshStandardMaterial({color:0xdcdcd0,roughness:.8}),7500);let zn=0;
 for(let a=-1;a<=14;a++)for(let b=-1;b<=14;b++){const X=(a-7)*CELL+40,Z=(b-7)*CELL+40;
  for(let s=-1;s<=1;s+=2)for(let o=-7.5;o<=7.6;o+=2.5){
   D.rotation.y=0;D.position.set(X+o,.025,Z+s*13);D.updateMatrix();zb.setMatrixAt(zn++,D.matrix);
   D.rotation.y=PI/2;D.position.set(X+s*13,.025,Z+o);D.updateMatrix();zb.setMatrixAt(zn++,D.matrix);}}
 zb.count=zn;zb.receiveShadow=true;scene.add(zb);D.rotation.y=0;
 /* фонари */
 const LN=N*N*2;
 const poles=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.18,9,6),new THREE.MeshStandardMaterial({color:0x2a2c30,metalness:.6,roughness:.5}),LN);
 const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.45,8,6),new THREE.MeshStandardMaterial({color:0x111111,emissive:0xffd9a0,emissiveIntensity:4}),LN);
 const lp=new Float32Array(LN*3);let ln=0;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let q=0;q<2;q++){const sx=q?1:-1,cx=(i-7)*CELL+sx*29,cz=(j-7)*CELL+sx*29,hx=cx+sx*1.6,hz=cz+sx*1.6;
  D.position.set(cx,4.9,cz);D.updateMatrix();poles.setMatrixAt(ln,D.matrix);
  D.position.set(hx,9.3,hz);D.updateMatrix();heads.setMatrixAt(ln,D.matrix);
  lp[ln*3]=hx;lp[ln*3+1]=9.2;lp[ln*3+2]=hz;ln++;}
 poles.castShadow=true;scene.add(poles,heads);
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(lp,3));
 scene.add(new THREE.Points(lg,new THREE.PointsMaterial({map:glowT,color:0xffc890,size:16,sizeAttenuation:true,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false})));
 /* деревья */
 const TN=N*N*4;
 const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.25,.35,3,6),new THREE.MeshStandardMaterial({color:0x4a3624,roughness:1}),TN);
 const crown=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(2.6,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,flatShading:true}),TN);
 const col=new THREE.Color();let t=0;const AX=[[1,0],[-1,0],[0,1],[0,-1]];
 for(let i=0;i<N;i++)for(let j=0;j<N;j++)for(let q=0;q<4;q++){const o=(Math.random()-.5)*18,x=(i-7)*CELL+(AX[q][0]?AX[q][0]*28.8:o),z=(j-7)*CELL+(AX[q][1]?AX[q][1]*28.8:o),sc=.8+Math.random()*.5;
  D.position.set(x,1.7,z);D.updateMatrix();trunk.setMatrixAt(t,D.matrix);
  D.position.set(x,4.6,z);D.scale.set(sc,sc*.9,sc);D.updateMatrix();crown.setMatrixAt(t,D.matrix);D.scale.set(1,1,1);
  col.setHSL(.24+Math.random()*.07,.45,.17+Math.random()*.08);crown.setColorAt(t,col);t++;}
 trunk.castShadow=crown.castShadow=true;scene.add(trunk,crown);
 /* крыши */
 const rb=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x55585e,roughness:.8,metalness:.3}),roofs.length*2);let rn=0;
 roofs.forEach(r=>{for(let q=0;q<2;q++){const w=2+Math.random()*4,hh=1.2+Math.random()*2.5;
  D.position.set(r[0]+(Math.random()-.5)*(r[3]-10),.4+r[2]+hh/2,r[1]+(Math.random()-.5)*(r[4]-10));D.scale.set(w,hh,2+Math.random()*3);D.updateMatrix();rb.setMatrixAt(rn++,D.matrix);D.scale.set(1,1,1);}});
 rb.castShadow=true;scene.add(rb);
}
/* столкновения */
const blocked=(x,z,m)=>{if(Math.abs(x)>LIM-3||Math.abs(z)>LIM-3)return true;const bi=Math.round(x/CELL)+7,bj=Math.round(z/CELL)+7;if(bi<0||bi>=N||bj<0||bj>=N)return false;return Math.abs(x-(bi-7)*CELL)<HALF+m&&Math.abs(z-(bj-7)*CELL)<HALF+m;};
function hitBlock(o,r){const bi=Math.round(o.x/CELL)+7,bj=Math.round(o.z/CELL)+7;
 if(bi>=0&&bi<N&&bj>=0&&bj<N){const cx=(bi-7)*CELL,cz=(bj-7)*CELL;const px=clamp(o.x,cx-HALF,cx+HALF),pz=clamp(o.z,cz-HALF,cz+HALF);let dx=o.x-px,dz=o.z-pz;const dd=Math.hypot(dx,dz);
  if(dd<r){if(dd<1e-4){const ox=HALF-Math.abs(o.x-cx),oz=HALF-Math.abs(o.z-cz);if(ox<oz){dx=Math.sign(o.x-cx)||1;dz=0;o.x+=dx*(ox+r);}else{dz=Math.sign(o.z-cz)||1;dx=0;o.z+=dz*(oz+r);}}
   else{dx/=dd;dz/=dd;o.x+=dx*(r-dd);o.z+=dz*(r-dd);}return{nx:dx,nz:dz};}}
 if(Math.abs(o.x)>LIM){const s=Math.sign(o.x);o.x=s*LIM;return{nx:-s,nz:0};}
 if(Math.abs(o.z)>LIM){const s=Math.sign(o.z);o.z=s*LIM;return{nx:0,nz:-s};}
 return null;}
/* машины */
const mat=(c,m,r)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
const glow=(c,i)=>new THREE.MeshStandardMaterial({color:0x111111,emissive:c,emissiveIntensity:i});
const tireG=new THREE.CylinderGeometry(.42,.42,.3,18);tireG.rotateZ(PI/2);const hubG=new THREE.CylinderGeometry(.22,.22,.32,10);hubG.rotateZ(PI/2);
const tireM=mat(0x0c0c0d,0,.9),hubM=mat(0xb5b8bd,.9,.25),glassM=mat(0x0a0d12,.9,.08),darkM=mat(0x16171a,.3,.6);
function makeCar(police){
 const g=new THREE.Group();g.rotation.order='YXZ';
 const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
 const pm=c=>new THREE.MeshPhysicalMaterial({color:c,metalness:.65,roughness:.28,clearcoat:1,clearcoatRoughness:.04});
 const bodyM=police?pm(0x101114):pm(0xf2b705);
 const ext=(pts,dep)=>{const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));const gg=new THREE.ExtrudeGeometry(sh,{depth:dep,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:2});gg.translate(0,0,-dep/2);gg.rotateY(-PI/2);return gg;};
 add(ext([[-2.25,.3],[-2.25,.85],[-1.8,.97],[1.2,.97],[2,.82],[2.25,.62],[2.25,.3]],1.9),bodyM,0,0,0);
 add(ext([[-1.45,.97],[-.85,1.55],[.3,1.55],[1,.97]],1.62),glassM,0,0,0);
 add(new THREE.BoxGeometry(1.5,.07,1.1),bodyM,0,1.58,-.28);
 [-1,1].forEach(q=>add(new THREE.BoxGeometry(.12,.1,.2),bodyM,q*1.0,1.05,.95));
 if(!police){add(new THREE.BoxGeometry(1.7,.06,.5),bodyM,0,1.1,-2.1);[-.6,.6].forEach(q=>add(new THREE.BoxGeometry(.08,.15,.2),darkM,q,1,-2.1));}
 add(new THREE.BoxGeometry(2.06,.24,.2),darkM,0,.42,2.25);add(new THREE.BoxGeometry(2.06,.24,.2),darkM,0,.42,-2.25);
 if(police)add(new THREE.BoxGeometry(2.03,.34,2.4),mat(0xf2f2f2,.3,.4),0,.72,-.1);
 const spr=(c,x,y,z,sz)=>{const sp=new THREE.Sprite(glowMat(c));sp.position.set(x,y,z);sp.scale.set(sz,sz,1);g.add(sp);return sp;};
 const tails=[-.7,.7].map(x=>{const t=add(new THREE.BoxGeometry(.5,.16,.08),glow(0xff1010,.8),x,.74,-2.27);t.userData.sp=spr(0xff2010,x,.74,-2.45,1.8);return t;});
 [-.65,.65].forEach(x=>{add(new THREE.BoxGeometry(.5,.18,.08),glow(0xfff3c0,3),x,.72,2.27);spr(0xfff0c0,x,.72,2.45,3);});
 const wheels=[],pivots=[];
 [[-1,1.45],[1,1.45],[-1,-1.45],[1,-1.45]].forEach((p,i)=>{const pv=new THREE.Group();pv.position.set(p[0]*1.02,.42,p[1]);const w=new THREE.Group();const t=new THREE.Mesh(tireG,tireM),h=new THREE.Mesh(hubG,hubM);t.castShadow=true;w.add(t,h);pv.add(w);g.add(pv);wheels.push(w);if(i<2)pivots.push(pv);});
 let red=null,blue=null,rs=null,bs=null;
 if(police){add(new THREE.BoxGeometry(1.2,.12,.35),darkM,0,1.62,-.3);red=glow(0xff0000,3);blue=glow(0x0030ff,.1);add(new THREE.BoxGeometry(.55,.14,.3),red,-.3,1.7,-.3);add(new THREE.BoxGeometry(.55,.14,.3),blue,.3,1.7,-.3);rs=spr(0xff1010,-.3,1.9,-.3,5);bs=spr(0x2050ff,.3,1.9,-.3,5);}
 scene.add(g);return{g,wheels,pivots,tails,red,blue,rs,bs,spin:0};}
const P={x:40,z:-200,h:0,speed:0,st:0};
const plR=new THREE.PointLight(0xff1010,0,38,2),plB=new THREE.PointLight(0x2040ff,0,38,2);scene.add(plR,plB);
const smoke=[];let smokeT2=0,si=0;
for(let i=0;i<30;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,color:0xbbbbbb,transparent:true,opacity:0,depthWrite:false}));s.visible=false;s.userData={l:0};scene.add(s);smoke.push(s);}
function emitSmoke(x,z){const s=smoke[si++%30];s.position.set(x,.3,z);s.userData.l=1;s.visible=true;}
const pcar=makeCar(false);
{const sl=new THREE.SpotLight(0xfff0cc,3,90,.55,.7,1.2);sl.position.set(0,.9,2);sl.target.position.set(0,0,30);pcar.g.add(sl,sl.target);}
function place(c,o,dt){c.g.position.set(o.x,0,o.z);c.g.rotation.y=o.h;c.g.rotation.z=-(o.st||0)*o.speed*.0022;c.spin+=o.speed*dt/.42;c.wheels.forEach(w=>w.rotation.x=c.spin);c.pivots.forEach(p=>p.rotation.y=(o.st||0)*.45);}
/* полиция */
let police=[];
function spawnPos(dmin){let x=P.x,z=P.z;for(let t=0;t<8;t++){const a=P.h+PI+(Math.random()-.5)*2.4,d=dmin+Math.random()*40;x=P.x+Math.sin(a)*d;z=P.z+Math.cos(a)*d;
 if(Math.random()<.5)x=Math.round((x-40)/80)*80+40;else z=Math.round((z-40)/80)*80+40;x=clamp(x,-598,598);z=clamp(z,-598,598);if(Math.hypot(x-P.x,z-P.z)>=dmin*.6)break;}return{x,z};}
function relocate(p){const s=spawnPos(150);p.x=s.x;p.z=s.z;p.h=Math.atan2(P.x-p.x,P.z-p.z);p.speed=25;}
function addPolice(d){const p={car:makeCar(true),x:0,z:0,h:0,speed:0,st:0,k:.92+Math.random()*.08};relocate(p);const s=spawnPos(d);p.x=s.x;p.z=s.z;p.h=Math.atan2(P.x-p.x,P.z-p.z);police.push(p);}
function stepPolice(p,dt,T){
 let dx=P.x-p.x,dz=P.z-p.z;const dd=Math.hypot(dx,dz);if(dd>380){relocate(p);return;}
 const lead=dd>40?.5:0;dx=P.x+Math.sin(P.h)*P.speed*lead-p.x;dz=P.z+Math.cos(P.h)*P.speed*lead-p.z;
 const des=Math.atan2(dx,dz),la=9+p.speed*.45;let best=des;
 for(const o of[0,.5,-.5,1,-1,1.6,-1.6]){const a=des+o;if(!blocked(p.x+Math.sin(a)*la,p.z+Math.cos(a)*la,5)){best=a;break;}}
 const diff=wrap(best-p.h),mt=2.3*Math.min(1,p.speed/10)/(1+p.speed/60);
 p.h+=clamp(diff,-mt*dt,mt*dt);p.st=clamp(diff,-1,1);
 const cap=(34+Math.min(11,T*.12))*p.k,ad=Math.abs(diff),tg=cap*(ad>1.2?.45:ad>.5?.8:1);
 p.speed+=clamp(tg-p.speed,-30*dt,18*dt);
 p.x+=Math.sin(p.h)*p.speed*dt;p.z+=Math.cos(p.h)*p.speed*dt;
 const h=hitBlock(p,2.2);if(h){const vn=Math.sin(p.h)*h.nx+Math.cos(p.h)*h.nz;if(vn<0)p.speed*=1+.7*vn;}
}
/* состояние */
const keys={};let looking=false,yawOff=0,pitch=.22,ch=0,state='menu',T=0,shake=0,clock=0,hudT=0,A=null;
function reset(){police.forEach(p=>scene.remove(p.car.g));police=[];Object.assign(P,{x:40,z:-200,h:0,speed:0,st:0});ch=0;yawOff=0;pitch=.22;T=0;shake=0;addPolice(110);addPolice(120);}
function start(){initAudio();reset();state='play';$('menu').classList.add('hide');$('lose').classList.add('hide');$('hud').classList.remove('hide');}
function initAudio(){try{if(A){A.ctx.resume();return;}const C=window.AudioContext||window.webkitAudioContext;const ctx=new C();const mk=(type,f,lf)=>{const o=ctx.createOscillator();o.type=type;o.frequency.value=f;const g=ctx.createGain();g.gain.value=0;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=lf;o.connect(lp);lp.connect(g);g.connect(ctx.destination);o.start();return{o,g};};A={ctx,eng:mk('sawtooth',50,500),sir:mk('square',800,1800)};}catch(e){A=null;}}
function drive(dt){
 const up=keys.KeyW||keys.ArrowUp,dn=keys.KeyS||keys.ArrowDown,lf=keys.KeyA||keys.ArrowLeft,rt=keys.KeyD||keys.ArrowRight;let s=P.speed;
 if(up)s+=(s<0?60:24*(1-Math.max(0,s)/56))*dt;else if(dn)s-=(s>.5?48:14)*dt;else s-=Math.sign(s)*Math.min(Math.abs(s),(2.5+s*s*.0009)*dt);
 if(keys.Space)s-=Math.sign(s)*Math.min(Math.abs(s),30*dt);
 s=clamp(s,-14,52);P.speed=s;
 P.st+=(((lf?1:0)-(rt?1:0))-P.st)*Math.min(1,dt*7);
 P.h+=P.st*1.9*clamp(s/9,-1,1)/(1+Math.abs(s)/45)*(keys.Space?1.5:1)*dt;
 P.x+=Math.sin(P.h)*s*dt;P.z+=Math.cos(P.h)*s*dt;
 const h=hitBlock(P,2.1);if(h){const vn=(Math.sin(P.h)*h.nx+Math.cos(P.h)*h.nz)*P.speed;if(vn<0){if(-vn>9)shake=.6;P.speed*=1-.7*Math.min(1,-vn/Math.max(1,Math.abs(P.speed)));}}
 {const b=dn||keys.Space;pcar.tails.forEach(t=>{t.material.emissiveIntensity=b?4:.8;t.userData.sp.material.opacity=b?1:.45;});}
}
function fmt(t){t|=0;return String(t/60|0).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
function update(dt){
 clock+=dt;
 if(state==='play'){
  T+=dt;drive(dt);
  smokeT2+=dt;if(smokeT2>.05&&P.speed>6&&(keys.Space||Math.abs(P.st)*P.speed>30)){smokeT2=0;[-1,1].forEach(q=>emitSmoke(P.x-Math.sin(P.h)*1.45+Math.cos(P.h)*q*1.02,P.z-Math.cos(P.h)*1.45-Math.sin(P.h)*q*1.02));}
  const want=Math.min(8,2+Math.floor(T/18));while(police.length<want)addPolice(130);
  police.forEach(p=>stepPolice(p,dt,T));
  for(let i=0;i<police.length;i++)for(let j=i+1;j<police.length;j++){const a=police[i],b=police[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<4.4&&d>1e-3){const f=(4.4-d)/2/d;a.x-=dx*f;a.z-=dz*f;b.x+=dx*f;b.z+=dz*f;}}
  if(T>2.5&&police.some(p=>Math.hypot(p.x-P.x,p.z-P.z)<3.9)){state='caught';$('res').textContent='Вы продержались: '+fmt(T)+' · Розыск: '+'★'.repeat(Math.min(5,1+Math.floor(T/25)));$('lose').classList.remove('hide');$('hud').classList.add('hide');}
 }else if(state==='caught'){P.speed*=Math.pow(.15,dt);P.x+=Math.sin(P.h)*P.speed*dt;P.z+=Math.cos(P.h)*P.speed*dt;hitBlock(P,2.1);police.forEach(p=>{p.speed*=Math.pow(.2,dt);p.x+=Math.sin(p.h)*p.speed*dt;p.z+=Math.cos(p.h)*p.speed*dt;});}
 place(pcar,P,dt);
 smoke.forEach(s=>{const u=s.userData;if(u.l>0){u.l-=dt*1.1;s.material.opacity=Math.max(0,u.l)*.4;s.scale.setScalar(1.5+(1-u.l)*5);s.position.y+=dt*.8;if(u.l<=0)s.visible=false;}});
 let nearest=999;
 police.forEach(p=>{place(p.car,p,dt);const f=Math.floor(clock*8)%2;p.car.red.emissiveIntensity=f?3:.1;p.car.blue.emissiveIntensity=f?.1:3;p.car.rs.material.opacity=f?1:.05;p.car.bs.material.opacity=f?.05:1;nearest=Math.min(nearest,Math.hypot(p.x-P.x,p.z-P.z));});
 const np=police.reduce((a,p)=>!a||Math.hypot(p.x-P.x,p.z-P.z)<Math.hypot(a.x-P.x,a.z-P.z)?p:a,null);
 if(np){const f=Math.floor(clock*8)%2;plR.position.set(np.x,3,np.z);plB.position.set(np.x,3,np.z);plR.intensity=f?3:0;plB.intensity=f?0:3;}
 if(A){A.eng.o.frequency.value=45+Math.abs(P.speed)*2.6;A.eng.g.gain.value=state==='play'?.07:0;A.sir.o.frequency.value=800+250*Math.sin(clock*5);A.sir.g.gain.value=state==='play'?Math.max(0,1-nearest/220)*.035:0;}
 /* камера */
 if(state==='menu'){ch+=dt*.25;}else{ch+=wrap(P.h-ch)*Math.min(1,dt*4.5);}
 if(!looking){yawOff=wrap(yawOff);yawOff-=yawOff*Math.min(1,dt*3);pitch+=(.22-pitch)*Math.min(1,dt*3);}
 const a=ch+yawOff;let dist=9+Math.abs(P.speed)*.05,cx,cz,cp=Math.cos(pitch);
 for(let i=0;i<10;i++){cx=P.x-Math.sin(a)*dist*cp;cz=P.z-Math.cos(a)*dist*cp;if(!blocked(cx,cz,.4)||dist<3)break;dist*=.85;}
 shake*=Math.pow(.02,dt);const sh=shake*.35;
 camera.position.set(cx+(Math.random()-.5)*sh,Math.max(.9,1.5+dist*Math.sin(pitch))+(Math.random()-.5)*sh,cz+(Math.random()-.5)*sh);
 camera.lookAt(P.x+Math.sin(a)*4,1.3,P.z+Math.cos(a)*4);
 camera.fov=58+Math.min(22,Math.abs(P.speed)*.4);camera.updateProjectionMatrix();
 sky.position.copy(camera.position);
 sun.position.set(P.x+sunDir.x,sunDir.y,P.z+sunDir.z);sun.target.position.set(P.x,0,P.z);
 hudT+=dt;if(hudT>.1&&state==='play'){hudT=0;$('time').textContent=fmt(T);$('kmh').textContent=Math.round(Math.abs(P.speed)*3.6);const n=Math.min(5,1+Math.floor(T/25));$('stars').textContent='★'.repeat(n)+'☆'.repeat(5-n);}
}
/* ввод */
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyR'&&state==='caught')start();if(e.code==='Enter'&&state==='menu')start();});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('mousedown',e=>{if(e.button===2){looking=true;document.body.style.cursor='grabbing';e.preventDefault();}});
addEventListener('mouseup',e=>{if(e.button===2){looking=false;document.body.style.cursor='';}});
addEventListener('mousemove',e=>{if(looking){yawOff-=e.movementX*.006;pitch=clamp(pitch+e.movementY*.005,-.15,1.3);}});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;looking=false;document.body.style.cursor='';});
$('go').onclick=e=>{e.target.blur();start();};$('again').onclick=e=>{e.target.blur();start();};
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000||.016);last=now;update(dt);renderer.render(scene,camera);}
requestAnimationFrame(loop);
})();