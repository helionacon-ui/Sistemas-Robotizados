/* Sistemas Robotizados: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
var L1=1,L2=0.7,DEG=180/Math.PI;function fk(a,b){return [[0,0],[L1*Math.cos(a),L1*Math.sin(a)],[L1*Math.cos(a)+L2*Math.cos(a+b),L1*Math.sin(a)+L2*Math.sin(a+b)]];}
function arm(D,A,P,c){D.line(A.X(P[0][0]),A.Y(P[0][1]),A.X(P[1][0]),A.Y(P[1][1]),c||C.m,7);D.line(A.X(P[1][0]),A.Y(P[1][1]),A.X(P[2][0]),A.Y(P[2][1]),c||C.m,5);D.dot(A.X(P[0][0]),A.Y(P[0][1]),8,C.ax);D.dot(A.X(P[1][0]),A.Y(P[1][1]),6,C.hl);D.dot(A.X(P[2][0]),A.Y(P[2][1]),5,C.bad);}
function plane(D,y){return U.axes(D,{xr:[-1.9,1.9],yr:[-1.3,1.9],xt:[-1,1],yt:[-1,1],xd:0,yd:0,xl:'x',yl:'y'},{x:110,y:y||80,w:420,h:350,grid:true});}

/* T1 espacio de trabajo */
M.reg('sr-t1',M.base({title:'El robot industrial: su espacio de trabajo',H:580,dur:18,caps:[[6,'Un brazo de dos articulaciones de rotación (L₁ = 1 m, L₂ = 0,7 m) barre sus ángulos dentro de sus límites.'],[12,'Las posiciones que alcanza el extremo forman el espacio de trabajo: aquí, una corona entre los radios L₁ − L₂ y L₁ + L₂.'],[99,'Los límites articulares recortan la corona. El fabricante lo da en la hoja del robot: hay que comprobar que la pieza cae dentro.']]},
 function(D,t){var A=plane(D),u=seg(t,0.5,16),n=Math.floor(u*400),pts=[];for(var i=0;i<n;i++){var a=-0.4+(i%20)/19*3.9,b=-2.4+Math.floor(i/20)/19*4.8,P=fk(a,b);pts.push(P[2]);}
  pts.forEach(function(p){D.dot(A.X(p[0]),A.Y(p[1]),2.4,C.f,0.6);});var i2=Math.max(0,n-1),a2=-0.4+(i2%20)/19*3.9,b2=-2.4+Math.floor(i2/20)/19*4.8;arm(D,A,fk(a2,b2));
  D.ring(A.X(0),A.Y(0),(A.X(1.7)-A.X(0)),C.mut,1);D.ring(A.X(0),A.Y(0),(A.X(0.3)-A.X(0)),C.mut,1);
  U.readout(D,['θ₁ = '+nf(a2*DEG,0)+'°    θ₂ = '+nf(b2*DEG,0)+'°','radios: '+nf(L1-L2,1)+' m … '+nf(L1+L2,1)+' m'],500);}));

/* T2 matriz de rotación */
M.reg('sr-t2',M.base({title:'Matrices de rotación: girar un sistema de referencia',H:560,dur:16,caps:[[5,'El sistema B se obtiene girando A un ángulo θ alrededor de z. Sus ejes, expresados en A, son las columnas de la matriz de rotación.'],[10,'<i>R<sub>z</sub>(θ) = [cos θ  −sen θ; sen θ  cos θ]</i> (en el plano). Es ortonormal: su inversa es su traspuesta.'],[99,'Un vector con coordenadas p<sup>B</sup> en B tiene en A las coordenadas <i>p<sup>A</sup> = R·p<sup>B</sup></i>.']]},
 function(D,t){var th=lerp(0,Math.PI/2,U.pp(t,16)),cx=200,cy=280,S=140,c=Math.cos(th),s=Math.sin(th);
  D.arrow(cx,cy,cx+S,cy,C.mut,1.6);D.arrow(cx,cy,cx,cy-S,C.mut,1.6);D.text('x_{A}',cx+S+6,cy+5,{s:16,c:C.mut});D.text('y_{A}',cx+4,cy-S-8,{s:16,c:C.mut});
  D.arrow(cx,cy,cx+S*c,cy-S*s,C.f,3);D.arrow(cx,cy,cx-S*s,cy-S*c,C.hl,3);D.text('x_{B}',cx+S*c+6,cy-S*s,{s:16,c:C.f});D.text('y_{B}',cx-S*s-24,cy-S*c-6,{s:16,c:C.hl});
  D.ctx.save();D.ctx.strokeStyle=C.m;D.ctx.lineWidth=2;D.ctx.beginPath();D.ctx.arc(cx,cy,50,-th,0);D.ctx.stroke();D.ctx.restore();D.text('θ',cx+58,cy-14,{s:17,c:C.m});
  var x0=400,y0=210;D.text('R_{z}(θ) =',x0-10,y0+28,{s:18,c:C.w,a:'right'});D.line(x0,y0-10,x0,y0+66,C.w,2);D.line(x0+200,y0-10,x0+200,y0+66,C.w,2);
  [[c,-s],[s,c]].forEach(function(r,i){r.forEach(function(v,j){D.text(nf(v,2),x0+55+j*95,y0+14+i*40,{s:19,a:'center',c:j?C.hl:C.f,mono:true});});});
  U.readout(D,['θ = '+nf(th*DEG,0)+'°    columnas = ejes de B vistos desde A'],440);}));

/* T3 transformación homogénea */
M.reg('sr-t3',M.base({title:'Transformación homogénea: girar y trasladar',H:580,dur:18,caps:[[6,'Una matriz 4×4 <i>T = [R p; 0 1]</i> junta la rotación R y la traslación p del sistema B respecto de A.'],[12,'Un punto fijo en B (rojo) tiene siempre las mismas coordenadas en B, pero sus coordenadas en A cambian al mover B.'],[99,'<i>p<sup>A</sup> = T·p<sup>B</sup></i>. Encadenando matrices (T₀₁·T₁₂·…) se pasa de la base al extremo del robot.']]},
 function(D,t){var u=U.pp(t,18),th=lerp(0,1.1,u),px=lerp(0.3,1.6,u),py=lerp(0.2,1,u),A=U.axes(D,{xr:[-0.3,3],yr:[-0.3,2.2],xt:[1,2,3],yt:[1,2],xd:0,yd:0,xl:'x_{A}',yl:'y_{A}'},{x:90,y:80,w:460,h:330,grid:true}),c=Math.cos(th),s=Math.sin(th),pB=[0.8,0.4],pA=[px+c*pB[0]-s*pB[1],py+s*pB[0]+c*pB[1]];
  D.arrow(A.X(px),A.Y(py),A.X(px+0.8*c),A.Y(py+0.8*s),C.f,2.6);D.arrow(A.X(px),A.Y(py),A.X(px-0.8*s),A.Y(py+0.8*c),C.hl,2.6);D.text('B',A.X(px)-16,A.Y(py)+16,{s:16,c:C.m,bold:true});
  D.arrow(A.X(0),A.Y(0),A.X(px),A.Y(py),C.m,1.6);D.dot(A.X(pA[0]),A.Y(pA[1]),7,C.bad);
  U.readout(D,['p^{B} = (0,8 ; 0,4) siempre','p^{A} = ('+nf(pA[0],2)+' ; '+nf(pA[1],2)+')    θ = '+nf(th*DEG,0)+'°'],480);}));

/* T4 cuaternio de una rotación */
M.reg('sr-t4',M.base({title:'Cuaternios: eje y ángulo de una rotación',H:580,dur:18,caps:[[6,'Toda orientación se puede alcanzar con un único giro θ alrededor de un eje unitario u.'],[12,'El cuaternio unitario lo codifica así: <i>q = (cos θ/2, u·sen θ/2)</i>. Cuatro números, sin el bloqueo de cardán de los ángulos de Euler.'],[99,'Componer giros es multiplicar cuaternios, e interpolar entre dos orientaciones (SLERP) da un movimiento suave y uniforme.']]},
 function(D,t){var th=seg(t,1,16)*2*Math.PI,u=[0.3,0.9,0.3],nu=Math.hypot(u[0],u[1],u[2]);u=u.map(function(v){return v/nu;});var cx=230,cy=280,S=120;
  function P(v){return [cx+S*(v[0]-0.55*v[2]),cy-S*(v[1]-0.35*v[2])];}function rot(v){var c=Math.cos(th),s=Math.sin(th),d=u[0]*v[0]+u[1]*v[1]+u[2]*v[2],cr=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];return [0,1,2].map(function(i){return v[i]*c+cr[i]*s+u[i]*d*(1-c);});}
  [[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'z']].forEach(function(a){var p=P(a);D.line(cx,cy,p[0],p[1],C.grid,1.4);D.text(a[3],p[0]+4,p[1]-4,{s:14,c:C.mut});});
  var pu=P(u.map(function(v){return v*1.3;})),pd=P(u.map(function(v){return -v*0.6;}));D.line(pd[0],pd[1],pu[0],pu[1],C.hl,2,[6,4]);D.text('u',pu[0]+6,pu[1],{s:17,c:C.hl,bold:true});
  var v0=[1,0,0],tr=[];for(var k=0;k<=40;k++){var th2=th*k/40,c2=Math.cos(th2),s2=Math.sin(th2),d=u[0],cr=[0,u[2],-u[1]];tr.push(P([0,1,2].map(function(i){return v0[i]*c2+cr[i]*s2+u[i]*d*(1-c2);})));}D.path(tr,C.m,1.6,null,0.7);
  var v=rot(v0),pv=P(v);D.arrow(cx,cy,pv[0],pv[1],C.m,3);var x0=430;
  U.readout(D,['θ = '+nf(th*DEG,0)+'°','q = ('+nf(Math.cos(th/2),2)+';  '+nf(u[0]*Math.sin(th/2),2)+',  '+nf(u[1]*Math.sin(th/2),2)+',  '+nf(u[2]*Math.sin(th/2),2)+')'],480);}));

/* T5 cinemática directa con DH */
M.reg('sr-t5',M.base({title:'Cinemática directa: parámetros de Denavit-Hartenberg',H:600,dur:18,caps:[[6,'Cada eslabón se describe con cuatro parámetros DH (θ, d, a, α). En un brazo plano RR solo cambian los ángulos θ₁ y θ₂.'],[12,'Multiplicando las matrices de cada articulación, <i>⁰T₂ = A₁(θ₁)·A₂(θ₂)</i>, se obtiene la posición del extremo.'],[99,'<i>x = L₁cos θ₁ + L₂cos(θ₁ + θ₂)</i>,  <i>y = L₁sen θ₁ + L₂sen(θ₁ + θ₂)</i>.']]},
 function(D,t){var a=lerp(0.2,1.6,U.pp(t,18)),b=lerp(1.2,-0.9,U.pp(t*1.3,18)),A=U.axes(D,{xr:[-1,1.9],yr:[-0.4,1.9],xt:[1],yt:[1],xd:0,yd:0,xl:'x',yl:'y'},{x:60,y:80,w:330,h:320,grid:true}),P=fk(a,b);arm(D,A,P);
  var x0=405,y0=130,cols=[0,40,105,150,200],H=['i','θ_{i}','d','a','α'],R=[['1',nf(a*DEG,0)+'°','0','1,0','0'],['2',nf(b*DEG,0)+'°','0','0,7','0']];
  H.forEach(function(h,j){D.text(h,x0+cols[j],y0,{s:15,c:C.mut,a:'center'});});R.forEach(function(r,i){r.forEach(function(v,j){D.text(v,x0+cols[j],y0+34+i*30,{s:15,c:i?C.hl:C.f,a:'center',mono:true});});});D.line(x0-14,y0+10,x0+215,y0+10,C.grid,1);
  U.readout(D,['extremo:  x = '+nf(P[2][0],3)+' m    y = '+nf(P[2][1],3)+' m'],470);}));

/* T6 cinemática inversa: codo arriba y codo abajo */
function ik(x,y,up){var c2=(x*x+y*y-L1*L1-L2*L2)/(2*L1*L2);c2=clamp(c2,-1,1);var b=(up?-1:1)*Math.acos(c2),a=Math.atan2(y,x)-Math.atan2(L2*Math.sin(b),L1+L2*Math.cos(b));return [a,b];}
M.reg('sr-t6',M.base({title:'Cinemática inversa: dos soluciones',H:600,dur:18,caps:[[6,'Ahora se conoce el punto al que debe ir el extremo y se buscan los ángulos. Por la ley del coseno: <i>cos θ₂ = (x² + y² − L₁² − L₂²)/(2L₁L₂)</i>.'],[12,'Hay dos soluciones, θ₂ positivo o negativo: codo abajo y codo arriba. Las dos llegan al mismo punto.'],[99,'Si el punto está fuera de la corona de trabajo no hay solución; en el borde exterior las dos coinciden (brazo estirado).']]},
 function(D,t){var s=t/18*2*Math.PI,x=0.9+0.45*Math.cos(s),y=0.6+0.35*Math.sin(s),A=plane(D),s1=ik(x,y,true),s2=ik(x,y,false);
  arm(D,A,fk(s2[0],s2[1]),RG(C.f,.6));arm(D,A,fk(s1[0],s1[1]),C.m);D.ring(A.X(x),A.Y(y),10,C.bad,2.4);
  var p=[];for(var k=0;k<=60;k++){var ss=k/60*2*Math.PI;p.push([A.X(0.9+0.45*Math.cos(ss)),A.Y(0.6+0.35*Math.sin(ss))]);}D.path(p,C.bad,1,null,0.5);
  U.readout(D,['objetivo ('+nf(x,2)+' ; '+nf(y,2)+')','codo arriba: θ₁ = '+nf(s1[0]*DEG,0)+'°, θ₂ = '+nf(s1[1]*DEG,0)+'°     codo abajo: θ₁ = '+nf(s2[0]*DEG,0)+'°, θ₂ = '+nf(s2[1]*DEG,0)+'°'],500);}));

/* T7 elipse de manipulabilidad */
M.reg('sr-t7',M.base({title:'Jacobiano y singularidades: la elipse de manipulabilidad',H:600,dur:18,caps:[[6,'El jacobiano relaciona velocidades articulares y velocidad del extremo: <i>ẋ = J(θ)·θ̇</i>. Depende de la postura.'],[12,'La elipse muestra las velocidades que se consiguen con θ̇ de módulo 1: su forma indica en qué direcciones el robot se mueve con facilidad.'],[99,'Al estirar el brazo (θ₂ → 0) la elipse se aplasta: det J = L₁L₂ sen θ₂ = 0. Es una singularidad: se pierde un grado de libertad.']]},
 function(D,t){var b=lerp(2.2,0.02,U.pp(t,18)),a=0.5,A=plane(D),P=fk(a,b);arm(D,A,P);
  var J=[[-L1*Math.sin(a)-L2*Math.sin(a+b),-L2*Math.sin(a+b)],[L1*Math.cos(a)+L2*Math.cos(a+b),L2*Math.cos(a+b)]],k=0.35,el=[];for(var i=0;i<=80;i++){var s=i/80*2*Math.PI,q=[Math.cos(s),Math.sin(s)];el.push([A.X(P[2][0]+k*(J[0][0]*q[0]+J[0][1]*q[1])),A.Y(P[2][1]+k*(J[1][0]*q[0]+J[1][1]*q[1]))]);}
  D.path(el,C.hl,2.4,RG(C.hl,.15));var det=L1*L2*Math.sin(b);U.readout(D,['θ₂ = '+nf(b*DEG,0)+'°    det J = '+nf(det,3),Math.abs(det)<0.05?'¡casi singular!':''],500);}));

/* T8 par estático en un brazo */
M.reg('sr-t8',M.base({title:'Estática: el par que soporta la articulación',H:600,dur:18,caps:[[6,'Un brazo de masa m con una carga en el extremo: la gravedad crea un par en la articulación que el motor debe compensar.'],[12,'El par depende del brazo de palanca horizontal: <i>τ = (m·L/2 + m<sub>c</sub>·L)·g·cos θ</i>. Máximo con el brazo horizontal.'],[99,'Con el brazo vertical el par gravitatorio es nulo. En movimiento hay que sumar los términos de inercia, Coriolis y centrífugos.']]},
 function(D,t){var th=lerp(-0.2,Math.PI/2+0.2,U.pp(t,18)),cx=150,cy=330,L=170,ex=cx+L*Math.cos(th),ey=cy-L*Math.sin(th);
  D.rect(cx-30,cy,60,20,C.ax,RG(C.ax,.3),1.4);D.line(cx,cy,ex,ey,C.m,9);D.dot(cx,cy,9,C.ax);D.rect(ex-14,ey-14,28,28,C.hl,RG(C.hl,.3),2);D.arrow(ex,ey+14,ex,ey+60,C.bad,2.4);D.text('m_{c}g',ex+8,ey+50,{s:14,c:C.bad});
  D.line(cx,cy+40,ex,cy+40,C.f,1.6);D.text('L cos θ',(cx+ex)/2,cy+60,{s:14,a:'center',c:C.f});
  var A=U.axes(D,{xr:[-0.3,1.8],yr:[-5,40],xt:[0,0.785,1.571],yt:[10,20,30],xf:function(v){return v<0.1?'0°':(v<1?'45°':'90°');},yd:0,xl:'θ',yl:'τ (N·m)'},{x:350,y:110,w:250,h:250,grid:true}),tau=function(x){return (2*0.5+3)*9.81*Math.cos(x);};
  U.plotf(D,A,tau,C.m,2.6);D.dot(A.X(th),A.Y(tau(th)),6,C.hl);U.readout(D,['m = 2 kg, L = 1 m, m_{c} = 3 kg    θ = '+nf(th*DEG,0)+'°','τ = (m/2 + m_{c})·g·L·cos θ = '+nf(tau(th),1)+' N·m'],470);}));

/* T9 perfil trapezoidal de velocidad */
function trap(t){var T=4,ta=1,vm=1/(T-ta);if(t<0)return [0,0];if(t<ta)return [0.5*vm/ta*t*t,vm*t/ta];if(t<T-ta)return [0.5*vm*ta+vm*(t-ta),vm];if(t<T){var r=T-t;return [1-0.5*vm/ta*r*r,vm*r/ta];}return [1,0];}
M.reg('sr-t9',M.base({title:'Generación de trayectorias: perfil trapezoidal',H:600,dur:18,caps:[[6,'Para mover una articulación de q₀ a q<sub>f</sub> sin golpes se acelera, se va a velocidad constante y se frena: perfil trapezoidal de velocidad.'],[12,'La posición resulta parabólica en los tramos de aceleración y lineal en el tramo de crucero.'],[99,'Para coordinar varias articulaciones se ajustan todas a la duración de la más lenta, de modo que empiezan y acaban a la vez.']]},
 function(D,t){var x=seg(t,1,15)*4,A=U.axes(D,{xr:[0,4.2],yr:[0,1.15],xt:[1,2,3,4],yt:[0.5,1],xd:0,yd:1,xl:'t (s)',yl:'q'},{x:80,y:80,w:480,h:170,grid:true}),B=U.axes(D,{xr:[0,4.2],yr:[0,0.45],xt:[1,2,3,4],yt:[0.33],xd:0,yd:2,xl:'t (s)',yl:'dq/dt'},{x:80,y:300,w:480,h:150,grid:true});
  U.plotf(D,A,function(s){return s>x?NaN:trap(s)[0];},C.m,3);U.plotf(D,B,function(s){return s>x?NaN:trap(s)[1];},C.hl,3);var q=trap(x);D.dot(A.X(x),A.Y(q[0]),6,C.m);D.dot(B.X(x),B.Y(q[1]),6,C.hl);
  U.readout(D,['t = '+nf(x,2)+' s    q = '+nf(q[0],3)+'    q̇ = '+nf(q[1],3)+'    (t_{a} = 1 s)'],530);}));

/* T10 cámara estenopeica */
M.reg('sr-t10',M.base({title:'Visión artificial: el modelo de cámara estenopeica',H:580,dur:18,caps:[[6,'Un punto P a distancia Z de la cámara se proyecta en el plano imagen, a distancia focal f, en <i>u = f·X/Z</i>.'],[12,'Si el objeto se aleja, su imagen se acerca al centro y se hace más pequeña: la profundidad se pierde en una sola imagen.'],[99,'Por eso hace falta calibrar la cámara (f, centro óptico, distorsión) y usar dos cámaras o un tamaño conocido para medir distancias.']]},
 function(D,t){var Z=lerp(1.5,5,U.pp(t,18)),X=0.6,f=0.5,ox=110,oy=260,S=90,u=f*X/Z;D.line(40,oy,600,oy,C.ax,1.2,[5,5]);D.rect(ox-6,oy-120,6,240,C.f,RG(C.f,.3),1.4);D.text('plano imagen',ox-6,oy+140,{s:14,c:C.f,a:'center'});
  var cx=ox+f*S;D.dot(cx,oy,5,C.ax);D.text('centro óptico',cx,oy+24,{s:13,c:C.mut,a:'center'});var px=cx+Z*S,py=oy-X*S;D.line(px,py,ox,oy+u*S,C.hl,1.6);D.dot(px,py,7,C.bad);D.text('P',px+8,py-6,{s:17,c:C.bad,bold:true});D.line(px,oy,px,py,C.bad,1.2,[3,3]);
  D.dot(ox-3,oy+u*S,6,C.m);D.text('u',ox-14,oy+u*S+6,{s:16,c:C.m,a:'right',bold:true});D.text('f',ox+f*S/2,oy-8,{s:15,c:C.ax,a:'center'});
  U.readout(D,['X = 0,6 m    Z = '+nf(Z,2)+' m    f = 50 mm','u = f·X/Z = '+nf(50*0.6/Z,1)+' mm en el sensor (dibujo no a escala)'],470);}));
M.reg('sr-t9b',M.base({title:'Trayectoria cúbica: posición, velocidad y aceleración',H:600,dur:18,caps:[[6,'Un polinomio de tercer grado q(t) = a₀ + a₁t + a₂t² + a₃t³ permite fijar posición y velocidad al principio y al final: cuatro condiciones, cuatro coeficientes.'],[12,'Con velocidades inicial y final nulas: <i>a₂ = 3Δq/T²</i>, <i>a₃ = −2Δq/T³</i>. La velocidad es una parábola.'],[99,'La aceleración es lineal y salta al arrancar y al parar (tirón infinito). Si eso importa se usa un polinomio de quinto grado.']]},
 function(D,t){var x=seg(t,1,15)*2,T=2,q=function(s){var u=s/T;return 3*u*u-2*u*u*u;},v=function(s){var u=s/T;return (6*u-6*u*u)/T;},a=function(s){var u=s/T;return (6-12*u)/(T*T);};
  var rows=[[q,'q',[0,1.1],C.m,0.5],[v,'dq/dt',[0,0.85],C.hl,0.25],[a,'d²q/dt²',[-1.7,1.7],C.g,1]];rows.forEach(function(r,i){var A=U.axes(D,{xr:[0,2.1],yr:r[2],xt:i===2?[0.5,1,1.5,2]:[],yt:[r[4]],xd:1,yd:2,xl:i===2?'t (s)':'',yl:''},{x:110,y:80+i*130,w:450,h:100,grid:true});D.text(r[1],95,80+i*130+50,{s:18,c:r[3],a:'right',it:true});U.plotf(D,A,function(s){return s>x?NaN:r[0](s);},r[3],2.6);D.dot(A.X(x),A.Y(r[0](x)),5,r[3]);});
  U.readout(D,['de q = 0 a q = 1 rad en T = 2 s    velocidad máxima 1,5·Δq/T = 0,75 rad/s'],500);}));
})();
