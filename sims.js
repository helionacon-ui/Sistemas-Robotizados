/* Figuras interactivas de Sistemas Robotizados. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- helpers Sistemas Robotizados ---- */
const NR=(x,d)=>{if(!isFinite(x))return '—';const s=x.toFixed(d===undefined?2:d);return (Math.abs(parseFloat(s))<1e-9?(0).toFixed(d===undefined?2:d):s).replace('.',',');};
const N0=x=>NR(x,0),N1=x=>NR(x,1),N2=x=>NR(x,2),N3=x=>NR(x,3),N4=x=>NR(x,4);
const DEG=x=>x*180/Math.PI, RAD=x=>x*Math.PI/180;
const sup=s=>String(s).replace(/-/g,'−');
/* matrices 4x4 como arrays de 16 (fila mayor) */
function M4(){return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];}
function mul4(A,B){const R=new Array(16).fill(0);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=A[i*4+k]*B[k*4+j];R[i*4+j]=s;}return R;}
function rotZ(t){const c=Math.cos(t),s=Math.sin(t);return [c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1];}
function rotY(t){const c=Math.cos(t),s=Math.sin(t);return [c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1];}
function rotX(t){const c=Math.cos(t),s=Math.sin(t);return [1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1];}
function tras(x,y,z){return [1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1];}
function dhA(th,d,a,al){const ct=Math.cos(th),st=Math.sin(th),ca=Math.cos(al),sa=Math.sin(al);
  return [ct,-st*ca,st*sa,a*ct, st,ct*ca,-ct*sa,a*st, 0,sa,ca,d, 0,0,0,1];}
/* cuaternios [w,x,y,z] */
function qmul(p,q){return [p[0]*q[0]-p[1]*q[1]-p[2]*q[2]-p[3]*q[3],
  p[0]*q[1]+p[1]*q[0]+p[2]*q[3]-p[3]*q[2],
  p[0]*q[2]-p[1]*q[3]+p[2]*q[0]+p[3]*q[1],
  p[0]*q[3]+p[1]*q[2]-p[2]*q[1]+p[3]*q[0]];}
function qconj(q){return [q[0],-q[1],-q[2],-q[3]];}
function qrot(q,v){const r=qmul(qmul(q,[0,v[0],v[1],v[2]]),qconj(q));return [r[1],r[2],r[3]];}
function qeje(k,th){const n=Math.hypot(k[0],k[1],k[2])||1,s=Math.sin(th/2);return [Math.cos(th/2),k[0]/n*s,k[1]/n*s,k[2]/n*s];}
function qmat(q){const [w,x,y,z]=q;return [w*w+x*x-y*y-z*z, 2*(x*y-w*z), 2*(x*z+w*y),
  2*(x*y+w*z), w*w-x*x+y*y-z*z, 2*(y*z-w*x),
  2*(x*z-w*y), 2*(y*z+w*x), w*w-x*x-y*y+z*z];}
/* proyección isométrica 3D -> 2D */
function iso(p,cx,cy,u){return [cx+(p[0]-p[1])*0.866*u, cy-(p[2]+(p[0]+p[1])*0.5)*u];}
/* tabla HTML pequeña */
function Mhtml(M,n,d){let h='<table class="mini"><tbody>';for(let i=0;i<n;i++){h+='<tr>';for(let j=0;j<n;j++)h+='<td>'+NR(M[i*n+j],d===undefined?3:d)+'</td>';h+='</tr>';}return h+'</tbody></table>';}
function M4html(M,d){let h='<table class="mini"><tbody>';for(let i=0;i<4;i++){h+='<tr>';for(let j=0;j<4;j++)h+='<td>'+NR(M[i*4+j],d===undefined?3:d)+'</td>';h+='</tr>';}return h+'</tbody></table>';}

/* 1 · Morfología y volumen de trabajo */
SIMS.morfologia=el=>build(el,{w:680,h:262,
 selects:[{k:'tipo',l:'Configuración',v:'angular',opts:[['cartesiana','Cartesiana (PPP)'],['cilindrica','Cilíndrica (RPP)'],['esferica','Esférica (RRP)'],['scara','SCARA (RRP vertical)'],['angular','Angular / antropomórfica (RRR)']]}],
 sliders:[{k:'q1',l:'Articulación 1',v:30,min:-90,max:90,step:1,u:'º'},{k:'q2',l:'Articulación 2',v:45,min:-60,max:120,step:1,u:'º'}],
 draw(a){a.clear();const s=a.st,cx=250,cy=200,u=58;
  const info={cartesiana:['PPP','Prisma rectangular','Pórticos, corte y paletizado de cargas grandes'],
   cilindrica:['RPP','Cilindro hueco','Carga y descarga de máquinas'],
   esferica:['RRP','Corona esférica','Manipulación general (robots clásicos)'],
   scara:['RRP','Cilindro achatado','Montaje e inserción vertical de piezas'],
   angular:['RRR','Esfera hueca','Soldadura, pintura, manipulación: el más versátil']}[s.tipo];
  /* volumen de trabajo */
  a.g.save();a.g.globalAlpha=0.16;a.g.fillStyle=C.a;
  if(s.tipo==='cartesiana'){a.g.fillRect(cx-0.2*u,cy-2.0*u,2.2*u,1.6*u);}
  else if(s.tipo==='cilindrica'){a.g.fillRect(cx-2.1*u,cy-1.9*u,4.2*u,1.3*u);}
  else if(s.tipo==='scara'){a.g.fillRect(cx-2.0*u,cy-1.5*u,4.0*u,0.5*u);a.g.beginPath();a.g.arc(cx,cy-1.25*u,2.0*u,0,Math.PI*2);a.g.fill();}
  else{a.g.beginPath();a.g.arc(cx,cy-0.9*u,2.1*u,Math.PI,2*Math.PI);a.g.arc(cx,cy-0.9*u,0.7*u,2*Math.PI,Math.PI,true);a.g.closePath();a.g.fill();}
  a.g.restore();
  /* suelo y base */
  a.line(cx-2.6*u,cy,cx+2.6*u,cy,C.grid,2);
  a.g.fillStyle=C.muted;a.g.fillRect(cx-0.35*u,cy-0.35*u,0.7*u,0.35*u);
  const q1=RAD(s.q1),q2=RAD(s.q2);
  let P=[],lab=[];
  if(s.tipo==='cartesiana'){const dx=(s.q1+90)/180*2.0,dy=(s.q2+60)/180*1.4;
    P=[[0,-0.35],[0,-1.9],[dx,-1.9],[dx,-1.9+ (1.2-dy)]];lab=['d₁','d₂','d₃'];}
  else if(s.tipo==='cilindrica'){const r=0.6+(s.q2+60)/180*1.4;
    P=[[0,-0.35],[0,-1.8],[r*Math.cos(q1*0.6),-1.8+0.35*r*Math.sin(q1*0.6)]];lab=['q₁','d₂','d₃'];}
  else if(s.tipo==='scara'){P=[[0,-0.35],[0,-1.3],[1.1*Math.cos(q1),-1.3+0.3*Math.sin(q1)]];
    const e=P[2];P.push([e[0]+0.9*Math.cos(q1+q2),e[1]+0.3*Math.sin(q1+q2)]);P.push([P[3][0],P[3][1]+0.55]);lab=['q₁','q₂','d₃'];}
  else if(s.tipo==='esferica'){const r=1.0+(s.q2+60)/180*1.0;
    P=[[0,-0.35],[0,-1.5]];P.push([r*Math.cos(q1-0.4),-1.5-r*Math.sin(q1-0.4)*0.9]);lab=['q₁','q₂','d₃'];}
  else{const l1=1.0,l2=0.85;P=[[0,-0.35],[0,-1.2]];
    const e1=[l1*Math.cos(q1),-1.2-l1*Math.sin(q1)];P.push(e1);
    P.push([e1[0]+l2*Math.cos(q1+q2-Math.PI/3),e1[1]-l2*Math.sin(q1+q2-Math.PI/3)]);lab=['q₁','q₂','q₃'];}
  for(let i=0;i<P.length-1;i++){const A=P[i],B=P[i+1];
    a.line(cx+A[0]*u,cy+A[1]*u,cx+B[0]*u,cy+B[1]*u,i%2?C.c:C.a,7);
    a.circ(cx+A[0]*u,cy+A[1]*u,5,C.text,true);}
  const E=P[P.length-1];a.circ(cx+E[0]*u,cy+E[1]*u,7,C.b,true);
  a.txt('extremo',cx+E[0]*u+12,cy+E[1]*u+4,C.b,11.5);
  /* panel */
  const bx=440,by=44;
  a.txt('Configuración '+info[0],bx,by-16,C.a,14);
  const filas=[['Cadena',info[0]],['Volumen de trabajo',info[1]],['Grados de libertad','3 (+3 de muñeca)']];
  filas.forEach((f,i)=>{a.txt(f[0],bx,by+6+i*22,C.muted,12);a.txt(f[1],bx+130,by+6+i*22,C.text,12);});
  a.txt('Uso típico',bx,by+74,C.muted,12);
  const pal=info[2].split(' ');let ln='',y=by+92;
  pal.forEach(w=>{if((ln+' '+w).length>30){a.txt(ln,bx,y,C.text,12);y+=17;ln=w;}else ln=ln?ln+' '+w:w;});
  a.txt(ln,bx,y,C.text,12);
  a.txt('zona sombreada = volumen de trabajo',bx,by+158,C.muted,11);
  a.html('<b>'+info[0]+'</b> · volumen de trabajo: <b>'+info[1].toLowerCase()+'</b>.<br>Las <b>tres primeras</b> articulaciones son las que dan el nombre a la configuración y las que <b>posicionan</b> el extremo; las tres de la muñeca sólo lo <b>orientan</b>. Fíjate en que todos los volúmenes salvo el cartesiano tienen un <b>hueco central</b>: la zona pegada a la base es inalcanzable.');
 }});

/* 2 · Matrices de rotación */
SIMS.rotacion=el=>build(el,{w:680,h:286,
 selects:[{k:'modo',l:'Segundo giro respecto a',v:'movil',opts:[['movil','ejes móviles (postmultiplica)'],['fijo','ejes fijos (premultiplica)']]}],
 sliders:[{k:'a',l:'Giro 1 sobre z',v:90,min:-180,max:180,step:5,u:'º'},{k:'b',l:'Giro 2 sobre x',v:90,min:-180,max:180,step:5,u:'º'}],
 draw(a){a.clear();const s=a.st,cx=196,cy=168,u=58;
  const R1=rotZ(RAD(s.a)),R2=rotX(RAD(s.b));
  const R=s.modo==='movil'?mul4(R1,R2):mul4(R2,R1);
  /* ejes de referencia */
  const E=[[1,0,0],[0,1,0],[0,0,1]],nm=['x','y','z'],cols=[C.muted,C.muted,C.muted];
  E.forEach((v,i)=>{const p=iso(v,cx,cy,u),q=iso([v[0]*1.34,v[1]*1.34,v[2]*1.34],cx,cy,u);
    a.line(cx,cy,p[0],p[1],C.grid,2.5);
    a.txt(nm[i]+'₀',q[0],q[1]+4,C.muted,11.5,'center');});
  /* ejes girados */
  const cl=[C.a,C.c,C.f];
  for(let i=0;i<3;i++){const v=[R[0*4+i],R[1*4+i],R[2*4+i]];const p=iso(v,cx,cy,u);
    a.arrow(cx,cy,p[0],p[1],cl[i],3);
    a.txt(nm[i]+'₁',p[0]+(v[0]-v[1]>0?10:-16),p[1]+(v[2]>0?-8:18),cl[i],13);}
  a.circ(cx,cy,4,C.text,true);
  /* matriz */
  const bx=420,by=46;
  a.txt(s.modo==='movil'?'R = R(z,α)·R(x,β)':'R = R(x,β)·R(z,α)',bx,by-26,C.a,13.5);
  a.g.strokeStyle=C.grid;a.g.lineWidth=1.5;a.g.strokeRect(bx-8,by-14,214,90);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)
    a.txt(sup(NR(R[i*4+j],3)),bx+30+j*68,by+8+i*28,j===0?C.a:j===1?C.c:C.f,12.5,'right');
  a.txt('columna 1 = x₁   ·   2 = y₁   ·   3 = z₁',bx-8,by+96,C.muted,11);
  /* eje y ángulo equivalentes */
  const tr=R[0]+R[5]+R[10],ct=Math.max(-1,Math.min(1,(tr-1)/2)),th=Math.acos(ct),st2=Math.sin(th);
  let k=[0,0,0];if(Math.abs(st2)>1e-6)k=[(R[9]-R[6])/(2*st2),(R[2]-R[8])/(2*st2),(R[4]-R[1])/(2*st2)];
  a.txt('Eje y ángulo equivalentes',bx-8,by+128,C.muted,12);
  a.txt('θ = '+N1(DEG(th))+'º',bx-8,by+150,C.text,13);
  a.txt('k = ('+N3(k[0])+', '+N3(k[1])+', '+N3(k[2])+')',bx-8,by+172,C.text,12.5);
  a.txt('det R = '+N2(R[0]*(R[5]*R[10]-R[6]*R[9])-R[1]*(R[4]*R[10]-R[6]*R[8])+R[2]*(R[4]*R[9]-R[5]*R[8])),bx-8,by+196,C.muted,12);
  a.html('Mueve los dos giros y cambia de <b>ejes móviles</b> a <b>ejes fijos</b>: con los mismos ángulos, la matriz resultante es <b>distinta</b>. Eso es que las rotaciones <b>no conmutan</b>.<br>Con α = β = 90º sobre ejes móviles sale una permutación cíclica de los ejes, equivalente a un giro de <b>120º alrededor de la diagonal (1,1,1)</b>. El determinante vale siempre 1: es la comprobación de que la matriz sigue siendo una rotación.');
 }});

/* 3 · Matrices de transformación homogénea */
SIMS.mth=el=>build(el,{w:680,h:292,
 selects:[{k:'op',l:'Orden de la cadena',v:'post',opts:[['post','Tras(x,a) · Rot(z,θ) · Tras(x,b)'],['pre','Rot(z,θ) · Tras(x,a) · Tras(x,b)']]}],
 sliders:[{k:'th',l:'θ',v:60,min:-180,max:180,step:5,u:'º'},{k:'a',l:'a',v:2,min:0,max:3,step:0.1,u:'m'},{k:'b',l:'b',v:1.5,min:0,max:3,step:0.1,u:'m'}],
 draw(a){a.clear();const s=a.st,cx=150,cy=206,u=46;
  a.axes(cx,cy,u,-1,5.4,-1,3.6);
  const th=RAD(s.th);
  const T1=tras(s.a,0,0),T2=rotZ(th),T3=tras(s.b,0,0);
  let Ts;
  if(s.op==='post'){Ts=[M4(),mul4(M4(),T1),mul4(mul4(M4(),T1),T2),mul4(mul4(mul4(M4(),T1),T2),T3)];}
  else {Ts=[M4(),mul4(T2,M4()),mul4(T1,mul4(T2,M4())),mul4(T3,mul4(T1,mul4(T2,M4())))];
        Ts=[M4(),T2,mul4(T2,T1),mul4(mul4(T2,T1),T3)];}
  const P=Ts.map(T=>[cx+T[3]*u,cy-T[7]*u]);
  const cl=[C.muted,C.a,C.c,C.b];
  for(let i=0;i<3;i++)a.line(P[i][0],P[i][1],P[i+1][0],P[i+1][1],cl[i+1],5);
  Ts.forEach((T,i)=>{
    const ex=[T[0],T[4]],ey=[T[1],T[5]],L=0.52*u;
    a.arrow(P[i][0],P[i][1],P[i][0]+ex[0]*L,P[i][1]-ex[1]*L,cl[i],2);
    a.arrow(P[i][0],P[i][1],P[i][0]+ey[0]*L,P[i][1]-ey[1]*L,cl[i],2);
    a.circ(P[i][0],P[i][1],4.5,cl[i],true);
    a.txt('S'+i,P[i][0]+(i===1?-6:(i===2?16:9)),P[i][1]+(i===1?26:(i===2?-12:-10)),cl[i],12.5,i===1?'right':'left');});
  const T=Ts[3];
  a.txt('x',cx+5.3*u,cy-8,C.muted,11);a.txt('y',cx-14,cy-3.5*u,C.muted,11);
  const bx=430,by=44;
  a.txt('Matriz resultante ⁰T₃',bx,by-24,C.a,13.5);
  a.g.strokeStyle=C.grid;a.g.lineWidth=1.5;a.g.strokeRect(bx-8,by-12,232,104);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)
    a.txt(sup(NR(T[i*4+j],3)),bx+36+j*56,by+10+i*24,j===3?C.b:C.text,11.5,'right');
  a.txt('posición del extremo',bx,by+116,C.muted,12);
  a.txt('('+N3(T[3])+', '+N3(T[7])+')  m',bx,by+136,C.b,13.5);
  a.txt('orientación',bx,by+162,C.muted,12);
  a.txt('θ total = '+N1(DEG(Math.atan2(T[4],T[0])))+'º',bx,by+182,C.text,13);
  a.html(s.op==='post'
   ? 'Cadena <b>postmultiplicada</b>: cada transformación se aplica respecto al sistema <b>que acabamos de colocar</b>. Primero avanzamos <b>a</b> por el eje x de S₀, después giramos θ sobre el z de ese nuevo sistema, y por último avanzamos <b>b</b> por el x <b>ya girado</b>. Es la forma natural de recorrer un robot de la base al extremo.'
   : 'Cadena <b>premultiplicada</b>: el giro se aplica respecto a los <b>ejes fijos</b> de S₀, así que gira toda la construcción posterior en bloque. Compara la posición final con la del otro orden: con los mismos números, el extremo acaba en otro sitio.');
 }});

/* 4 · Cuaternios */
SIMS.cuaternio=el=>build(el,{w:680,h:300,
 sliders:[{k:'th',l:'Ángulo de giro θ',v:120,min:0,max:360,step:5,u:'º'},
  {k:'kx',l:'Eje kx',v:1,min:-1,max:1,step:0.05},{k:'ky',l:'Eje ky',v:1,min:-1,max:1,step:0.05},{k:'kz',l:'Eje kz',v:1,min:-1,max:1,step:0.05}],
 draw(a){a.clear();const s=a.st,cx=196,cy=182,u=58;
  let k=[s.kx,s.ky,s.kz];const nk=Math.hypot(k[0],k[1],k[2]);
  if(nk<1e-6)k=[0,0,1];else k=[k[0]/nk,k[1]/nk,k[2]/nk];
  const th=RAD(s.th),q=qeje(k,th);
  const R=qmat(q);
  /* ejes base */
  [[1,0,0],[0,1,0],[0,0,1]].forEach((v,i)=>{const p=iso(v,cx,cy,u),q=iso([v[0]*1.36,v[1]*1.36,v[2]*1.36],cx,cy,u);
    a.line(cx,cy,p[0],p[1],C.grid,2);
    a.txt(['x','y','z'][i]+'₀',q[0],q[1]+4,C.muted,11,'center');});
  /* eje de giro */
  const pk=iso([k[0]*1.45,k[1]*1.45,k[2]*1.45],cx,cy,u);
  a.line(cx-(pk[0]-cx)*0.7,cy-(pk[1]-cy)*0.7,pk[0],pk[1],C.b,2,[5,4]);
  a.arrow(cx,cy,pk[0],pk[1],C.b,2.5);
  a.txt('k',pk[0]+8,pk[1]-4,C.b,13);
  /* vector v y su rotado */
  const v=[1,0,0],vr=qrot(q,v);
  const pv=iso(v,cx,cy,u),pr=iso(vr,cx,cy,u);
  a.arrow(cx,cy,pv[0],pv[1],C.muted,2.5);a.txt('v',pv[0]+4,pv[1]+22,C.muted,12,'center');
  a.arrow(cx,cy,pr[0],pr[1],C.a,3.5);a.txt("v'",pr[0]+(vr[0]-vr[1]>0?12:-14),pr[1]+(vr[2]>0?-10:22),C.a,13,'center');
  /* arco */
  a.g.save();a.g.globalAlpha=0.5;a.g.strokeStyle=C.a;a.g.lineWidth=1.5;a.g.setLineDash([3,3]);
  a.g.beginPath();for(let t=0;t<=1.001;t+=0.02){const w=qeje(k,th*t),p=iso(qrot(w,v),cx,cy,u);
    if(t===0)a.g.moveTo(p[0],p[1]);else a.g.lineTo(p[0],p[1]);}
  a.g.stroke();a.g.setLineDash([]);a.g.restore();
  a.circ(cx,cy,4,C.text,true);
  /* panel */
  const bx=404,by=40;
  a.txt('Q = (cos θ/2 ,  k·sen θ/2)',bx,by-22,C.a,13.5);
  const nms=['q₀','q₁','q₂','q₃'];
  q.forEach((c,i)=>{a.txt(nms[i],bx+i*62,by+2,C.muted,12,'center');
    a.txt(sup(N4(c)),bx+i*62,by+24,i===0?C.b:C.a,13,'center');});
  a.txt('|Q| = '+N3(Math.hypot(q[0],q[1],q[2],q[3])),bx,by+50,C.muted,12);
  a.txt('Matriz de rotación equivalente',bx-10,by+82,C.muted,12);
  a.g.strokeStyle=C.grid;a.g.lineWidth=1.3;a.g.strokeRect(bx-14,by+92,210,84);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)
    a.txt(sup(N3(R[i*3+j])),bx+28+j*66,by+114+i*26,C.text,12,'right');
  a.txt("v = (1, 0, 0)   →   v' = ("+N3(vr[0])+', '+N3(vr[1])+', '+N3(vr[2])+')',bx-14,by+198,C.a,12);
  a.txt('|v′| = '+N3(Math.hypot(vr[0],vr[1],vr[2]))+'  (se conserva)',bx-14,by+218,C.muted,11.5);
  a.html('El cuaternio guarda el <b>medio ángulo</b>: con θ = 120º la parte escalar vale cos 60º = 0,5. Con el eje (1,1,1) normalizado y θ = 120º sale Q = (0,5 · 0,5 · 0,5 · 0,5) y la matriz permuta cíclicamente los ejes.<br>Prueba θ = 360º: el cuaternio sale <b>(−1, 0, 0, 0)</b>, que es −Q de la identidad. Representa la <b>misma</b> rotación que (1,0,0,0): esa es la ambigüedad de signo.');
 }});

/* 5 · Denavit-Hartenberg */
SIMS.dh=el=>build(el,{w:680,h:300,
 sliders:[{k:'q1',l:'q₁',v:30,min:-180,max:180,step:5,u:'º'},{k:'q2',l:'q₂',v:45,min:-90,max:150,step:5,u:'º'},{k:'q3',l:'q₃',v:-30,min:-150,max:150,step:5,u:'º'},
  {k:'l2',l:'l₂',v:0.6,min:0.3,max:1,step:0.05,u:'m'},{k:'l3',l:'l₃',v:0.4,min:0.2,max:0.8,step:0.05,u:'m'}],
 draw(a){a.clear();const s=a.st,l1=0.5,l2=s.l2,l3=s.l3;
  const q=[RAD(s.q1),RAD(s.q2),RAD(s.q3)];
  const A1=dhA(q[0],l1,0,Math.PI/2),A2=dhA(q[1],0,l2,0),A3=dhA(q[2],0,l3,0);
  const T1=A1,T2=mul4(T1,A2),T3=mul4(T2,A3);
  const r=l2*Math.cos(q[1])+l3*Math.cos(q[1]+q[2]), z=l1+l2*Math.sin(q[1])+l3*Math.sin(q[1]+q[2]);
  /* vista del plano del brazo (r,z) */
  const cx=112,cy=236,u=92;
  a.txt('plano del brazo (r , z)',cx,34,C.muted,11.5);
  a.line(cx,cy,cx+2.0*u,cy,C.grid,1.5);a.line(cx,cy,cx,cy-2.0*u,C.grid,1.5);
  a.txt('r',cx+2.0*u-6,cy+16,C.muted,11);a.txt('z',cx-13,cy-2.0*u+8,C.muted,11);
  /* corona alcanzable */
  a.g.save();a.g.beginPath();a.g.rect(cx,cy-2.0*u,2.05*u,2.1*u);a.g.clip();
  a.g.globalAlpha=0.12;a.g.fillStyle=C.a;a.g.beginPath();
  a.g.arc(cx,cy-l1*u,(l2+l3)*u,0,Math.PI*2);a.g.arc(cx,cy-l1*u,Math.abs(l2-l3)*u,0,Math.PI*2,true);a.g.fill();a.g.restore();
  const O=[cx,cy],H=[cx,cy-l1*u],Co=[cx+l2*Math.cos(q[1])*u,cy-(l1+l2*Math.sin(q[1]))*u],E=[cx+r*u,cy-z*u];
  a.line(O[0],O[1],H[0],H[1],C.muted,7);
  a.line(H[0],H[1],Co[0],Co[1],C.a,6);
  a.line(Co[0],Co[1],E[0],E[1],C.c,6);
  [O,H,Co].forEach(p=>a.circ(p[0],p[1],5,C.text,true));
  a.circ(E[0],E[1],7,C.b,true);
  a.txt('hombro',H[0]-9,H[1]+4,C.muted,11,'right');
  a.txt('codo',Co[0]-2,Co[1]-12,C.a,11,'center');
  a.txt('extremo',E[0]+2,E[1]+22,C.b,11.5,'center');
  /* planta */
  const px=382,py=118,pu=52;
  a.txt('planta (x , y)',px-44,34,C.muted,11.5);
  a.circ(px,py,(l2+l3)*pu,C.grid,false);
  a.line(px-1.3*pu,py,px+1.3*pu,py,C.grid,1.2);a.line(px,py-1.3*pu,px,py+1.3*pu,C.grid,1.2);
  const x=r*Math.cos(q[0]),y=r*Math.sin(q[0]);
  a.line(px,py,px+x*pu,py-y*pu,C.a,4);
  a.circ(px+x*pu,py-y*pu,6,C.b,true);
  a.txt('q₁',px+16,py+18,C.a,11.5);
  /* tabla DH */
  const bx=476,by=44;
  a.txt('Tabla de Denavit-Hartenberg',bx,by-18,C.a,13);
  const col=[0,54,104,146];
  ['i','θᵢ','dᵢ','aᵢ','αᵢ'].forEach((h,j)=>a.txt(h,bx+[0,30,78,122,166][j],by+2,C.muted,11.5));
  const filas=[['1','q₁',N2(l1),'0','90º'],['2','q₂','0',N2(l2),'0'],['3','q₃','0',N2(l3),'0']];
  filas.forEach((f,i)=>f.forEach((c,j)=>a.txt(c,bx+[0,30,78,122,166][j],by+24+i*22,j===0?C.muted:C.text,12)));
  a.txt('Posición del extremo',bx,by+106,C.muted,12);
  a.txt('r = '+N4(r)+' m',bx,by+126,C.text,12.5);
  a.txt('x = '+N4(x)+' m',bx,by+146,C.a,12.5);
  a.txt('y = '+N4(y)+' m',bx,by+166,C.a,12.5);
  a.txt('z = '+N4(z)+' m',bx,by+186,C.a,12.5);
  a.txt('alcance: '+N2(Math.abs(l2-l3))+' – '+N2(l2+l3)+' m',bx,by+212,C.muted,11.5);
  a.html('La cinemática directa de un brazo antropomórfico se reduce a un <b>2R en el plano (r, z)</b> que gira con q₁. Por eso <b>r = l₂cos q₂ + l₃cos(q₂+q₃)</b> y <b>z = l₁ + l₂sen q₂ + l₃sen(q₂+q₃)</b>, y después x = r·cos q₁, y = r·sen q₁.<br>La zona sombreada es la <b>corona</b> alcanzable: su radio exterior es l₂+l₃ y el interior |l₂−l₃|. Iguala los dos eslabones y el agujero central desaparece.');
 }});

/* 6 · Cinemática inversa 2R */
SIMS.cinversa=el=>build(el,{w:680,h:296,
 selects:[{k:'sol',l:'Solución mostrada',v:'ambas',opts:[['ambas','Las dos'],['abajo','Codo abajo'],['arriba','Codo arriba']]}],
 sliders:[{k:'x',l:'x objetivo',v:1.2,min:-2,max:2,step:0.05,u:'m'},{k:'y',l:'y objetivo',v:0.9,min:-1,max:2,step:0.05,u:'m'},
  {k:'l1',l:'l₁',v:1,min:0.4,max:1.4,step:0.05,u:'m'},{k:'l2',l:'l₂',v:1,min:0.4,max:1.4,step:0.05,u:'m'}],
 draw(a){a.clear();const s=a.st,l1=s.l1,l2=s.l2,cx=236,cy=196,u=55;
  a.axes(cx,cy,u,-2.9,2.9,-1.3,2.4);
  /* zona alcanzable */
  a.g.save();a.g.globalAlpha=0.1;a.g.fillStyle=C.c;a.g.beginPath();
  a.g.arc(cx,cy,(l1+l2)*u,0,Math.PI*2);a.g.arc(cx,cy,Math.abs(l1-l2)*u,0,Math.PI*2,true);a.g.fill();a.g.restore();
  a.circ(cx,cy,(l1+l2)*u,C.grid,false);
  const r=Math.hypot(s.x,s.y),c2=(r*r-l1*l1-l2*l2)/(2*l1*l2),ok=Math.abs(c2)<=1;
  const sols=[];
  if(ok){[1,-1].forEach(sg=>{const s2=sg*Math.sqrt(1-c2*c2),q2=Math.atan2(s2,c2);
    const q1=Math.atan2(s.y,s.x)-Math.atan2(l2*s2,l1+l2*c2);sols.push([q1,q2,sg]);});}
  const ver=[];if(s.sol==='ambas'){ver.push(0,1);}else if(s.sol==='abajo')ver.push(0);else ver.push(1);
  ver.forEach(i=>{if(!sols[i])return;const [q1,q2]=sols[i];
    const co=[cx+l1*Math.cos(q1)*u,cy-l1*Math.sin(q1)*u],ex=[cx+(l1*Math.cos(q1)+l2*Math.cos(q1+q2))*u,cy-(l1*Math.sin(q1)+l2*Math.sin(q1+q2))*u];
    const cl=i===0?C.a:C.f;
    a.line(cx,cy,co[0],co[1],cl,6);a.line(co[0],co[1],ex[0],ex[1],cl,6);
    a.circ(co[0],co[1],5.5,C.text,true);
    a.txt(i===0?'codo abajo':'codo arriba',co[0]-10,co[1]+(i===0?22:-12),cl,11.5,'right');});
  a.circ(cx,cy,7,C.text,true);
  const px=cx+s.x*u,py=cy-s.y*u;
  a.circ(px,py,9,ok?C.b:C.d,false);a.circ(px,py,4,ok?C.b:C.d,true);
  a.txt('objetivo',px+14,py+16,ok?C.b:C.d,11.5);
  /* panel */
  const bx=466,by=46;
  a.txt('r = √(x²+y²) = '+N4(r)+' m',bx,by-20,C.text,12.5);
  a.txt('cos q₂ = '+sup(N4(c2)),bx,by+2,ok?C.c:C.d,12.5);
  if(!ok){a.txt('|cos q₂| > 1',bx,by+28,C.d,13.5);a.txt('PUNTO FUERA DE ALCANCE',bx,by+50,C.d,12.5);
    a.txt('alcance: '+N2(Math.abs(l1-l2))+' – '+N2(l1+l2)+' m',bx,by+72,C.muted,11.5);}
  else{
    a.txt('q₁',bx+74,by+30,C.muted,12,'center');a.txt('q₂',bx+146,by+30,C.muted,12,'center');
    sols.forEach((so,i)=>{const cl=i===0?C.a:C.f;
      a.txt(i===0?'abajo':'arriba',bx-10,by+54+i*24,cl,12);
      a.txt(sup(N3(DEG(so[0])))+'º',bx+100,by+54+i*24,C.text,12.5,'right');
      a.txt(sup(N3(DEG(so[1])))+'º',bx+172,by+54+i*24,C.text,12.5,'right');});
    const sg=Math.abs(Math.abs(c2)-1);
    a.txt(sg<0.002?'¡singularidad de contorno!':'det J = '+sup(N4(l1*l2*Math.sin(sols[0][1]))),bx-10,by+112,sg<0.002?C.d:C.muted,12);
    a.txt('las dos llegan al mismo punto con',bx-10,by+140,C.muted,11);
    a.txt('posturas distintas del codo',bx-10,by+158,C.muted,11);}
  a.html(ok
   ? 'Un mismo punto, <b>dos</b> configuraciones. El controlador elige la más cercana a la postura actual. Lleva el objetivo hasta el borde del círculo: las dos soluciones se <b>funden en una</b> y el determinante de la jacobiana se anula: es la <b>singularidad de contorno</b>.'
   : 'Ahora cos q₂ = '+sup(N3(c2))+', fuera del intervalo [−1, 1]: <b>no hay solución</b>. Esa es exactamente la forma matemática en que el robot dice «no llego». El punto está fuera de la corona alcanzable, que va de '+N2(Math.abs(l1-l2))+' a '+N2(l1+l2)+' m.');
 }});

/* 7 · Jacobiana y manipulabilidad */
SIMS.jacobiana=el=>build(el,{w:680,h:290,
 sliders:[{k:'q1',l:'q₁',v:30,min:-90,max:180,step:2,u:'º'},{k:'q2',l:'q₂',v:60,min:-170,max:170,step:2,u:'º'},
  {k:'l1',l:'l₁',v:1,min:0.5,max:1.4,step:0.05,u:'m'},{k:'l2',l:'l₂',v:1,min:0.5,max:1.4,step:0.05,u:'m'}],
 draw(a){a.clear();const s=a.st,l1=s.l1,l2=s.l2,cx=222,cy=214,u=64;
  const q1=RAD(s.q1),q2=RAD(s.q2);
  const c1=Math.cos(q1),s1=Math.sin(q1),c12=Math.cos(q1+q2),s12=Math.sin(q1+q2);
  const J=[-l1*s1-l2*s12,-l2*s12, l1*c1+l2*c12, l2*c12];
  const det=l1*l2*Math.sin(q2);
  a.axes(cx,cy,u,-2.9,2.9,-1.1,2.0);
  const co=[cx+l1*c1*u,cy-l1*s1*u],ex=[cx+(l1*c1+l2*c12)*u,cy-(l1*s1+l2*s12)*u];
  a.line(cx,cy,co[0],co[1],C.a,6);a.line(co[0],co[1],ex[0],ex[1],C.c,6);
  a.circ(cx,cy,6,C.text,true);a.circ(co[0],co[1],5,C.text,true);a.circ(ex[0],ex[1],6,C.b,true);
  /* elipse de manipulabilidad: J * circulo unidad */
  const esc=0.5;
  a.g.save();a.g.strokeStyle=C.f;a.g.lineWidth=2.2;a.g.beginPath();
  for(let t=0;t<=6.2832;t+=0.05){const u1=Math.cos(t),u2=Math.sin(t);
    const vx=J[0]*u1+J[1]*u2, vy=J[2]*u1+J[3]*u2;
    const X=ex[0]+vx*esc*u, Y=ex[1]-vy*esc*u;
    if(t===0)a.g.moveTo(X,Y);else a.g.lineTo(X,Y);}
  a.g.closePath();a.g.stroke();a.g.globalAlpha=0.12;a.g.fillStyle=C.f;a.g.fill();a.g.restore();
  a.txt('elipse de manipulabilidad',cx-2.85*u,cy+1.0*u,C.f,11.5);
  const sing=Math.abs(det)<0.02;
  if(sing){a.txt('SINGULARIDAD',ex[0]+14,ex[1]-14,C.d,13);
    const dir=Math.atan2(l1*s1+l2*s12,l1*c1+l2*c12);
    a.line(ex[0]-Math.cos(dir)*0.9*u,ex[1]+Math.sin(dir)*0.9*u,ex[0]+Math.cos(dir)*0.9*u,ex[1]-Math.sin(dir)*0.9*u,C.d,2.5,[6,4]);}
  /* panel */
  const bx=452,by=44;
  a.txt('Jacobiana J(q)',bx,by-22,C.a,13.5);
  a.g.strokeStyle=C.grid;a.g.lineWidth=1.4;a.g.strokeRect(bx-10,by-10,206,58);
  a.txt(sup(N3(J[0])),bx+78,by+12,C.text,12.5,'right');a.txt(sup(N3(J[1])),bx+180,by+12,C.text,12.5,'right');
  a.txt(sup(N3(J[2])),bx+78,by+38,C.text,12.5,'right');a.txt(sup(N3(J[3])),bx+180,by+38,C.text,12.5,'right');
  a.txt('det J = l₁·l₂·sen q₂',bx-10,by+76,C.muted,12);
  a.txt(sup(N4(det)),bx-10,by+98,sing?C.d:C.c,15);
  a.txt('manipulabilidad w = |det J|',bx-10,by+126,C.muted,11.5);
  a.txt(N4(Math.abs(det)),bx-10,by+146,C.text,13);
  const vals=[Math.hypot(J[0],J[2]),Math.hypot(J[1],J[3])];
  a.txt(sing?'el extremo no puede moverse':'el extremo se mueve en todas',bx-10,by+176,sing?C.d:C.muted,11.5);
  a.txt(sing?'en la dirección radial':'las direcciones del plano',bx-10,by+194,sing?C.d:C.muted,11.5);
  a.html(sing
   ? 'Con q₂ = '+N0(s.q2)+'º el brazo está '+(Math.abs(s.q2)<5?'<b>totalmente estirado</b>':'<b>totalmente plegado</b>')+' y det J = 0. La elipse se ha aplastado hasta convertirse en un <b>segmento</b>: por mucho que giren las articulaciones, el extremo <b>no puede moverse</b> en la dirección perpendicular a ese segmento. La jacobiana inversa pediría velocidades infinitas y el robot daría error de singularidad.'
   : 'La <b>elipse de manipulabilidad</b> dibuja qué velocidades del extremo son posibles con velocidades articulares unitarias. Cuanto más redonda, mejor se mueve el robot en todas las direcciones; cuanto más aplastada, peor. Su «área» es la manipulabilidad |det J| = l₁·l₂·|sen q₂|, <b>máxima con q₂ = ±90º</b> y nula con el brazo estirado o plegado.');
 }});

/* 8 · Estática */
SIMS.estatica=el=>build(el,{w:680,h:282,
 sliders:[{k:'q1',l:'q₁',v:30,min:-30,max:120,step:2,u:'º'},{k:'q2',l:'q₂',v:30,min:-150,max:150,step:2,u:'º'},
  {k:'P',l:'Peso de cada eslabón',v:1,min:0,max:5,step:0.1,u:'N'},{k:'F',l:'Carga en el extremo',v:2,min:0,max:10,step:0.1,u:'N'}],
 draw(a){a.clear();const s=a.st,l1=1,l2=1,cx=166,cy=196,u=80;
  const q1=RAD(s.q1),q2=RAD(s.q2);
  const c1=Math.cos(q1),s1=Math.sin(q1),c12=Math.cos(q1+q2),s12=Math.sin(q1+q2);
  const x1=l1*c1,y1=l1*s1,x2=x1+l2*c12,y2=y1+l2*s12;
  const g1=[0.5*c1,0.5*s1],g2=[x1+0.5*c12,y1+0.5*s12];
  a.line(cx-0.6*u,cy,cx+2.4*u,cy,C.grid,1.2);
  a.line(cx,cy-1.4*u,cx,cy+0.6*u,C.grid,1.2);
  a.txt('x',cx+2.4*u-4,cy+16,C.muted,11);a.txt('y',cx-14,cy-1.38*u,C.muted,11);
  a.line(cx,cy,cx+x1*u,cy-y1*u,C.a,7);
  a.line(cx+x1*u,cy-y1*u,cx+x2*u,cy-y2*u,C.c,7);
  a.circ(cx,cy,7,C.text,true);a.circ(cx+x1*u,cy-y1*u,6,C.text,true);
  /* pesos */
  [[g1,C.a],[g2,C.c]].forEach(([gg,cl])=>{const X=cx+gg[0]*u,Y=cy-gg[1]*u;
    a.circ(X,Y,4.5,cl,true);a.arrow(X,Y,X,Y+30,C.muted,2);
    a.txt('P',X+6,Y+26,C.muted,11);
    a.line(X,Y,X,cy,C.grid,1,[3,3]);});
  const EX=cx+x2*u,EY=cy-y2*u;
  a.circ(EX,EY,6,C.b,true);
  if(s.F>0.05){a.arrow(EX,EY,EX,EY+40,C.b,3);a.txt('F = '+N1(s.F)+' N',EX+8,EY+36,C.b,12);}
  a.line(EX,EY,EX,cy,C.grid,1,[3,3]);
  /* brazos horizontales */
  a.line(cx,cy+16,EX,cy+16,C.b,1.5,[4,3]);
  a.txt('brazo horizontal = '+N3(x2)+' m',cx+4,cy+32,C.b,11.5);
  /* pares */
  const t1=s.P*g1[0]+s.P*g2[0]+s.F*x2, t2=s.P*(g2[0]-x1)+s.F*(x2-x1);
  const bx=430,by=46;
  a.txt('Pares estáticos',bx,by-24,C.a,13.5);
  a.txt('τ₁ = P·x_g1 + P·x_g2 + F·x_e',bx,by,C.muted,11.5);
  a.txt('τ₁ = '+N1(s.P)+'·'+N3(g1[0])+' + '+N1(s.P)+'·'+N3(g2[0])+' + '+N1(s.F)+'·'+N3(x2),bx,by+20,C.text,11.5);
  a.txt(sup(N4(t1))+' N·m',bx,by+46,C.a,16);
  a.txt('τ₂ = P·(x_g2−x₁) + F·(x_e−x₁)',bx,by+76,C.muted,11.5);
  a.txt(sup(N4(t2))+' N·m',bx,by+102,C.c,16);
  const tmax=s.P*0.5+s.P*1.5+s.F*2;
  a.txt('Máximo posible (brazo horizontal',bx,by+132,C.muted,11);
  a.txt('y estirado): '+N2(tmax)+' N·m',bx,by+150,C.muted,11);
  a.g.fillStyle=C.grid;a.g.fillRect(bx,by+162,190,10);
  a.g.fillStyle=C.a;a.g.fillRect(bx,by+162,Math.max(0,Math.min(1,t1/Math.max(tmax,1e-6)))*190,10);
  a.txt(N0(100*t1/Math.max(tmax,1e-6))+' % del par máximo',bx,by+190,C.muted,11);
  a.html('Sólo cuenta el <b>brazo horizontal</b>: el par del eje 1 es la suma de cada peso por su distancia <b>horizontal</b> al eje. Pon q₁ = 90º con q₂ = 0 (brazo vertical) y verás que τ₁ se anula, porque todos los pesos pasan por el eje.<br>El par máximo se da con el brazo <b>horizontal y estirado</b>, y es el que dimensiona el motor. Comprueba también τ = J<sup>T</sup>F: la parte de la carga coincide con lo que da la jacobiana del tema 7.');
 }});

/* 9 · Interpoladores */
SIMS.trayectoria=el=>build(el,{w:680,h:330,
 selects:[{k:'tipo',l:'Interpolador',v:'trapez',opts:[['lineal','Lineal'],['trapez','Trapezoidal'],['cubico','Cúbico'],['quintico','Quíntico'],['todos','Comparar los cuatro']]}],
 sliders:[{k:'T',l:'Tiempo total',v:1,min:0.4,max:3,step:0.1,u:'s'},{k:'tb',l:'Rampa tb (trapezoidal)',v:0.25,min:0.05,max:1.5,step:0.05,u:'s'},{k:'dq',l:'Recorrido Δq',v:1,min:0.2,max:3,step:0.1,u:'rad'}],
 draw(a){a.clear();const s=a.st,T=s.T,dq=s.dq;let tb=Math.min(s.tb,T/2);
  function perfil(tipo,t){const x=t/T;
   if(tipo==='lineal')return [dq*x, dq/T];
   if(tipo==='trapez'){const vm=dq/(T-tb),ac=vm/tb;
     if(t<tb)return [0.5*ac*t*t, ac*t];
     if(t<T-tb)return [0.5*ac*tb*tb+vm*(t-tb), vm];
     const td=T-t;return [dq-0.5*ac*td*td, ac*td];}
   if(tipo==='cubico')return [dq*(3*x*x-2*x*x*x), dq*(6*x-6*x*x)/T];
   return [dq*(10*x*x*x-15*x*x*x*x+6*x*x*x*x*x), dq*(30*x*x-60*x*x*x+30*x*x*x*x)/T];}
  const tipos=s.tipo==='todos'?['lineal','trapez','cubico','quintico']:[s.tipo];
  const cls={lineal:C.muted,trapez:C.a,cubico:C.c,quintico:C.f};
  const nms={lineal:'lineal',trapez:'trapezoidal',cubico:'cúbico',quintico:'quíntico'};
  let vmax=0;tipos.forEach(tp=>{for(let i=0;i<=200;i++)vmax=Math.max(vmax,perfil(tp,i*T/200)[1]);});
  vmax=Math.max(vmax,1e-6);
  const gw=250,gh=104;
  function graf(ox,oy,idx,tit){
    a.line(ox,oy,ox+gw,oy,C.grid,1.4);a.line(ox,oy,ox,oy-gh,C.grid,1.4);
    a.txt(tit,ox,oy-gh-10,C.muted,11.5);
    tipos.forEach(tp=>{a.g.strokeStyle=cls[tp];a.g.lineWidth=2.4;a.g.beginPath();
      for(let i=0;i<=240;i++){const t=i*T/240,v=perfil(tp,t)[idx];
        const X=ox+t/T*gw, Y=oy-(idx===0?v/dq:v/vmax)*gh;
        if(i===0)a.g.moveTo(X,Y);else a.g.lineTo(X,Y);}
      a.g.stroke();});
    a.txt('0',ox-10,oy+5,C.muted,10);a.txt(idx===0?N1(dq):N2(vmax),ox-8,oy-gh+4,C.muted,10,'right');
    a.txt('t',ox+gw+6,oy+5,C.muted,10);a.txt(N1(T)+' s',ox+gw-4,oy+18,C.muted,10,'center');}
  graf(62,150,0,'posición q(t)   [rad]');
  graf(62,300,1,'velocidad q̇(t)   [rad/s]');
  /* leyenda */
  const bx=400,by=46;
  tipos.forEach((tp,i)=>{a.line(bx,by+i*22-4,bx+22,by+i*22-4,cls[tp],3);
    a.txt(nms[tp],bx+30,by+i*22,cls[tp],12);
    const vm=Math.max(...Array.from({length:201},(_,k)=>perfil(tp,k*T/200)[1]));
    a.txt(N3(vm)+' rad/s',bx+230,by+i*22,C.text,12,'right');});
  const y0=by+tipos.length*22+18;
  a.txt('velocidad punta de cada perfil',bx,y0,C.muted,11);
  if(s.tipo==='trapez'||s.tipo==='todos'){
    const vm=dq/(T-tb);
    a.txt('Trapezoidal',bx,y0+30,C.a,12.5);
    a.txt('v_max = Δq/(T−tb) = '+N3(vm)+' rad/s',bx,y0+52,C.text,12);
    a.txt('a = v_max/tb = '+N3(vm/tb)+' rad/s²',bx,y0+72,C.text,12);
    if(s.tb>T/2)a.txt('tb limitado a T/2 = '+N2(T/2)+' s',bx,y0+94,C.d,11.5);}
  else {a.txt('v_max cúbico = 3Δq/2T = '+N3(1.5*dq/T),bx,y0+30,C.muted,12);
    a.txt('v_max quíntico = 15Δq/8T = '+N3(1.875*dq/T),bx,y0+50,C.muted,12);}
  a.html('Los cuatro recorren <b>lo mismo en el mismo tiempo</b>; lo que cambia es cómo reparten la velocidad. El <b>lineal</b> tiene velocidad constante pero saltos al arrancar y parar (aceleración infinita). El <b>trapezoidal</b> es el de menor velocidad punta y el que usan los robots reales. El <b>cúbico</b> suaviza la velocidad y el <b>quíntico</b> suaviza además la aceleración, a costa de una punta mayor.');
 }});

/* 10 · Spline con velocidad de paso */
SIMS.spline=el=>build(el,{w:680,h:302,
 sliders:[{k:'qB',l:'q en el punto de paso B',v:0.6,min:0.1,max:1.4,step:0.05,u:'rad'},
  {k:'vB',l:'velocidad de paso en B',v:1,min:-1,max:3,step:0.1,u:'rad/s'},
  {k:'tB',l:'instante de paso',v:0.5,min:0.2,max:0.8,step:0.05,u:'s'},
  {k:'qC',l:'q final',v:1,min:0.3,max:2,step:0.05,u:'rad'}],
 draw(a){a.clear();const s=a.st,T1=s.tB,T2=1-s.tB;
  function coef(q0,v0,qf,vf,T){const a0=q0,a1=v0;
    const d=qf-q0-v0*T, e=vf-v0;
    const a2=(3*d-e*T)/(T*T), a3=(-2*d+e*T)/(T*T*T);return [a0,a1,a2,a3];}
  const A=coef(0,0,s.qB,s.vB,T1), B=coef(s.qB,s.vB,s.qC,0,T2);
  const ev=(c,t)=>c[0]+c[1]*t+c[2]*t*t+c[3]*t*t*t;
  const dv=(c,t)=>c[1]+2*c[2]*t+3*c[3]*t*t;
  const ox=64,oy=176,gw=268,gh=120;
  const qmax=Math.max(s.qB,s.qC,ev(A,T1/2),0.1)*1.12;
  a.line(ox,oy,ox+gw,oy,C.grid,1.4);a.line(ox,oy,ox,oy-gh,C.grid,1.4);
  a.txt('posición q(t)   [rad]',ox,oy-gh-12,C.muted,11.5);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
  for(let i=0;i<=160;i++){const t=i*T1/160,X=ox+t*gw,Y=oy-ev(A,t)/qmax*gh;if(i===0)a.g.moveTo(X,Y);else a.g.lineTo(X,Y);}
  a.g.stroke();
  a.g.strokeStyle=C.c;a.g.lineWidth=2.6;a.g.beginPath();
  for(let i=0;i<=160;i++){const t=i*T2/160,X=ox+(T1+t)*gw,Y=oy-ev(B,t)/qmax*gh;if(i===0)a.g.moveTo(X,Y);else a.g.lineTo(X,Y);}
  a.g.stroke();
  a.line(ox+T1*gw,oy,ox+T1*gw,oy-gh,C.muted,1,[4,3]);
  a.circ(ox+T1*gw,oy-s.qB/qmax*gh,5,C.b,true);
  a.txt('B',ox+T1*gw+8,oy-s.qB/qmax*gh-6,C.b,12);
  a.circ(ox+gw,oy-s.qC/qmax*gh,5,C.f,true);
  a.txt('C',ox+gw-12,oy-s.qC/qmax*gh-8,C.f,12);
  a.txt('0',ox-10,oy+5,C.muted,10);a.txt('1 s',ox+gw-2,oy+18,C.muted,10,'center');
  /* velocidad */
  const oy2=300,gh2=86;
  let vmx=0.3;for(let i=0;i<=120;i++){vmx=Math.max(vmx,Math.abs(dv(A,i*T1/120)),Math.abs(dv(B,i*T2/120)));}
  a.line(ox,oy2-gh2/2,ox+gw,oy2-gh2/2,C.grid,1.2);
  a.line(ox,oy2,ox,oy2-gh2,C.grid,1.4);
  a.txt('velocidad q̇(t)   [rad/s]',ox,oy2-gh2-10,C.muted,11.5);
  [[A,T1,0,C.a],[B,T2,T1,C.c]].forEach(([cc,TT,t0,cl])=>{a.g.strokeStyle=cl;a.g.lineWidth=2.4;a.g.beginPath();
    for(let i=0;i<=160;i++){const t=i*TT/160,X=ox+(t0+t)*gw,Y=oy2-gh2/2-dv(cc,t)/vmx*gh2/2;
      if(i===0)a.g.moveTo(X,Y);else a.g.lineTo(X,Y);}a.g.stroke();});
  a.txt('0',ox-10,oy2-gh2/2+4,C.muted,10);
  a.txt(N2(vmx),ox-6,oy2-gh2+4,C.muted,10,'right');
  /* panel */
  const bx=388,by=44;
  a.txt('Tramo 1  (0 → '+N2(T1)+' s)',bx,by-22,C.a,13);
  a.txt('q(t) = '+sup(N3(A[0]))+' + '+sup(N3(A[1]))+'t + '+sup(N3(A[2]))+'t² + '+sup(N3(A[3]))+'t³',bx,by,C.text,11.5);
  a.txt('Tramo 2  (τ = t − '+N2(T1)+')',bx,by+36,C.c,13);
  a.txt('q(τ) = '+sup(N3(B[0]))+' + '+sup(N3(B[1]))+'τ + '+sup(N3(B[2]))+'τ² + '+sup(N3(B[3]))+'τ³',bx,by+58,C.text,11.5);
  let vpk=0,tpk=0;for(let i=0;i<=400;i++){const t=i*T1/400,v=Math.abs(dv(A,t));if(v>vpk){vpk=v;tpk=t;}}
  a.txt('Velocidad punta del tramo 1',bx,by+100,C.muted,12);
  a.txt(N3(vpk)+' rad/s  en t = '+N3(tpk)+' s',bx,by+122,C.a,13);
  a.txt('Un solo cúbico de 0 a '+N2(s.qC)+' rad en 1 s',bx,by+152,C.muted,11.5);
  a.txt('daría v_max = '+N3(1.5*s.qC)+' rad/s',bx,by+172,C.muted,12);
  a.txt('Continuidad en B: q y q̇ coinciden',bx,by+202,C.c,11.5);
  a.html('Dos cúbicos encadenados: cada uno cumple <b>cuatro condiciones</b> (posición y velocidad al principio y al final del tramo). En B coinciden la posición y la velocidad, así que la curva es suave, pero la <b>aceleración salta</b>: por eso un spline así es C¹ y no C².<br>Baja la velocidad de paso a 0: el robot <b>se para</b> en B y la trayectoria son dos movimientos separados. Súbela mucho y verás cómo la velocidad punta se dispara.');
 }});

/* 11 · Precisión y repetibilidad (extra) */
SIMS.precision=el=>build(el,{w:680,h:272,
 sliders:[{k:'sesgo',l:'Error sistemático (precisión)',v:1.2,min:0,max:3,step:0.1,u:'mm'},
  {k:'disp',l:'Dispersión (repetibilidad)',v:0.3,min:0.02,max:2,step:0.02,u:'mm'},
  {k:'n',l:'Número de repeticiones',v:30,min:5,max:120,step:1}],
 draw(a){a.clear();const s=a.st,cx=196,cy=140,u=42;
  /* diana */
  [3,2,1].forEach(r=>{a.g.globalAlpha=r===3?0.07:r===2?0.1:0.14;a.circ(cx,cy,r*u,C.a,true);a.g.globalAlpha=1;});
  [1,2,3].forEach(r=>a.circ(cx,cy,r*u,C.grid,false));
  a.line(cx-3.2*u,cy,cx+3.2*u,cy,C.grid,1);a.line(cx,cy-3.2*u,cx,cy+3.2*u,C.grid,1);
  a.circ(cx,cy,4,C.text,true);
  a.txt('objetivo',cx-8,cy+16,C.text,11,'right');
  a.txt('1 mm',cx+1*u+3,cy+14,C.muted,10);a.txt('3 mm',cx+3*u-20,cy+14,C.muted,10);
  /* nube determinista */
  let rnd=12345;const rand=()=>{rnd=(rnd*1103515245+12345)&0x7fffffff;return rnd/0x7fffffff;};
  const ang=0.9, pts=[];
  for(let i=0;i<s.n;i++){
    const u1=Math.max(1e-9,rand()),u2=rand();
    const g1=Math.sqrt(-2*Math.log(u1))*Math.cos(6.2832*u2), g2=Math.sqrt(-2*Math.log(u1))*Math.sin(6.2832*u2);
    pts.push([s.sesgo*Math.cos(ang)+g1*s.disp, s.sesgo*Math.sin(ang)+g2*s.disp]);}
  pts.forEach(p=>{a.circ(cx+p[0]*u,cy-p[1]*u,2.8,C.f,true);});
  const mx=pts.reduce((t,p)=>t+p[0],0)/s.n, my=pts.reduce((t,p)=>t+p[1],0)/s.n;
  a.circ(cx+mx*u,cy-my*u,6,C.b,false);a.circ(cx+mx*u,cy-my*u,2.5,C.b,true);
  a.arrow(cx,cy,cx+mx*u,cy-my*u,C.b,2);
  const dm=pts.reduce((t,p)=>t+Math.hypot(p[0]-mx,p[1]-my),0)/s.n;
  const sd=Math.sqrt(pts.reduce((t,p)=>t+Math.pow(Math.hypot(p[0]-mx,p[1]-my)-dm,2),0)/s.n);
  const bx=424,by=42;
  a.txt('Precisión (exactitud)',bx,by-20,C.b,13);
  a.txt('distancia del baricentro al objetivo',bx,by+2,C.muted,11);
  a.txt(N3(Math.hypot(mx,my))+' mm',bx,by+26,C.b,16);
  a.txt('Repetibilidad  R = d̄ + 3σ',bx,by+62,C.f,13);
  a.txt('dispersión de los puntos alcanzados',bx,by+84,C.muted,11);
  a.txt(N3(dm+3*sd)+' mm',bx,by+108,C.f,16);
  const buena=Math.hypot(mx,my)<0.5, rep=dm+3*sd<1.0;
  a.txt(rep?(buena?'preciso y repetible':'repetible pero poco preciso'):(buena?'preciso pero poco repetible':'ni preciso ni repetible'),bx,by+146,C.a,12.5);
  a.txt('Un robot industrial típico:',bx,by+176,C.muted,11);
  a.txt('repetibilidad ±0,05 mm',bx,by+194,C.text,11.5);
  a.txt('precisión ±0,5 a ±2 mm',bx,by+212,C.text,11.5);
  a.html('Sube el <b>error sistemático</b> dejando la dispersión pequeña: los puntos siguen muy juntos (buena repetibilidad) pero lejos del objetivo (mala precisión). Es la situación <b>normal</b> en un robot industrial sin calibrar.<br>La repetibilidad depende de la <b>mecánica</b> (holguras, elasticidad, resolución); la precisión depende del <b>modelo geométrico</b>, y por eso se corrige calibrando, no cambiando el robot.');
 }});

/* 12 · Cámara y escala (extra) */
SIMS.camara=el=>build(el,{w:680,h:268,
 sliders:[{k:'Z',l:'Distancia de trabajo Z',v:1500,min:400,max:3000,step:50,u:'mm'},
  {k:'f',l:'Distancia focal f',v:8,min:4,max:35,step:1,u:'mm'},
  {k:'px',l:'Tamaño de píxel',v:5,min:2,max:10,step:0.5,u:'µm'},
  {k:'np',l:'Objeto medido',v:240,min:20,max:900,step:10,u:'px'}],
 draw(a){a.clear();const s=a.st;
  const esc=s.Z*(s.px/1000)/s.f;      /* mm por píxel */
  const L=s.np*esc;                    /* mm */
  const fov=1280*esc;                  /* campo con sensor de 1280 px */
  /* dibujo óptico */
  const cx=74,cy=140,u=0.066;
  const Zp=Math.min(s.Z*u,250);
  a.g.fillStyle=C.muted;a.g.fillRect(cx-16,cy-22,16,44);
  a.txt('sensor',cx-30,cy-32,C.muted,11);
  a.circ(cx+16,cy,5,C.a,false);a.txt('lente',cx+6,cy+30,C.a,11);
  a.line(cx+16,cy,cx+16+Zp,cy,C.grid,1.2,[5,4]);
  const hp=Math.min(fov*u/2,86);
  a.line(cx+16,cy,cx+16+Zp,cy-hp,C.a,1.8);
  a.line(cx+16,cy,cx+16+Zp,cy+hp,C.a,1.8);
  a.line(cx+16,cy,cx-0,cy+hp*0.22,C.a,1.4);
  a.line(cx+16,cy,cx-0,cy-hp*0.22,C.a,1.4);
  a.line(cx+16+Zp,cy-hp,cx+16+Zp,cy+hp,C.muted,2);
  a.txt('plano de trabajo',cx+16+Zp-6,cy+hp+20,C.muted,11,'center');
  /* objeto */
  const ho=Math.min(L*u/2,hp*0.92);
  a.g.fillStyle=C.b;a.g.fillRect(cx+16+Zp-9,cy-ho,18,2*ho);
  a.txt('objeto',cx+16+Zp+16,cy,C.b,11.5);
  a.line(cx+16,cy-6,cx+16+Zp,cy-6,C.c,1.2,[3,3]);
  a.txt('Z = '+N0(s.Z)+' mm',cx+16+Zp/2,cy-20,C.c,11.5,'center');
  /* panel */
  const bx=396,by=44;
  a.txt('Escala  s = Z·p / f',bx,by-24,C.a,13.5);
  a.txt(N0(s.Z)+' · '+N3(s.px/1000)+' / '+N0(s.f),bx,by,C.muted,12);
  a.txt(N4(esc)+' mm/px',bx,by+26,C.a,16);
  a.txt('Objeto de '+N0(s.np)+' px',bx,by+62,C.muted,12);
  a.txt(N1(L)+' mm',bx,by+88,C.b,18);
  a.txt('Campo de visión (sensor 1280 px)',bx,by+122,C.muted,11.5);
  a.txt(N0(fov)+' mm de ancho',bx,by+142,C.text,13);
  a.txt('Si el objeto fuese 100 mm más alto:',bx,by+174,C.muted,11);
  const esc2=(s.Z-100)*(s.px/1000)/s.f;
  a.txt('mediría '+N1(s.np*esc2)+' mm  (error '+N1(Math.abs(L-s.np*esc2))+' mm)',bx,by+194,C.d,12);
  a.html('La cámara no mide milímetros, mide <b>píxeles</b>. El puente es la escala <b>s = Z·p/f</b>, y depende de la distancia Z. Sube Z y el mismo objeto ocupa menos píxeles; baja f y el campo de visión se ensancha.<br>Fíjate en la última línea: si la pieza es más alta de lo previsto, el sistema la mide mal. Por eso en una célula real se trabaja a <b>altura conocida</b>, con cámara 3D o con una referencia de tamaño conocido en la escena.');
 }});

document.querySelectorAll("[data-sim]").forEach(function(el){var k=el.getAttribute("data-sim");if(SIMS[k]){try{SIMS[k](el);}catch(e){console.error("sim "+k,e);}}else console.warn("sim no encontrada: "+k);});
})();
