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

/* Sistemas Robotizados · «Del encargo a los grados»
   Animación original: un brazo de tres eslabones recoge una pieza de la mesa.
   Recorre las cuatro ideas del tema en una sola secuencia: cinemática directa,
   cinemática inversa con sus dos soluciones, corrección con el jacobiano y
   singularidad. Todos los números están comprobados con código. */
(function () {
  var M = window.MANIM; if (!M) return;
  var U = M.util, C = M.C, nf = U.nf, lerp = U.lerp, ease = U.ease, seg = U.seg, clamp = U.clamp, RG = U.RG;
  var W = 640, DEG = 180 / Math.PI, RAD = Math.PI / 180;

  /* ---- el robot y la mesa ---- */
  var L1 = 1.0, L2 = 0.70, L3 = 0.25;
  var PIEZA = [1.15, 0.35], PHI = 0;
  var MESA = { x0: 0.72, x1: 1.78, y: 0.30 };
  /* soluciones comprobadas en Python: error 1e-16 m */
  var ARRIBA = [62.93, -113.47, 50.54].map(function (v) { return v * RAD; });   // codo alto
  var ABAJO = [-20.43, 113.47, -93.04].map(function (v) { return v * RAD; });   // codo bajo: atraviesa la mesa
  var REPOSO = [52, -78, -4].map(function (v) { return v * RAD; });

  function fk(q) {
    var p = [[0, 0]], a = 0;
    [L1, L2, L3].forEach(function (L, i) {
      a += q[i];
      p.push([p[i][0] + L * Math.cos(a), p[i][1] + L * Math.sin(a)]);
    });
    return p;
  }
  function jac(q) {
    var a1 = q[0], a2 = a1 + q[1], a3 = a2 + q[2];
    return [[-L1 * Math.sin(a1) - L2 * Math.sin(a2) - L3 * Math.sin(a3), -L2 * Math.sin(a2) - L3 * Math.sin(a3), -L3 * Math.sin(a3)],
            [L1 * Math.cos(a1) + L2 * Math.cos(a2) + L3 * Math.cos(a3), L2 * Math.cos(a2) + L3 * Math.cos(a3), L3 * Math.cos(a3)],
            [1, 1, 1]];
  }
  function sol3(A, b) {                       // sistema 3×3 por eliminación
    var m = [[A[0][0], A[0][1], A[0][2], b[0]], [A[1][0], A[1][1], A[1][2], b[1]], [A[2][0], A[2][1], A[2][2], b[2]]];
    for (var i = 0; i < 3; i++) {
      var p = i; for (var r = i + 1; r < 3; r++) if (Math.abs(m[r][i]) > Math.abs(m[p][i])) p = r;
      var tmp = m[i]; m[i] = m[p]; m[p] = tmp;
      if (Math.abs(m[i][i]) < 1e-12) return [0, 0, 0];
      for (var r2 = 0; r2 < 3; r2++) if (r2 !== i) {
        var f = m[r2][i] / m[i][i];
        for (var c2 = i; c2 < 4; c2++) m[r2][c2] -= f * m[i][c2];
      }
    }
    return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
  }
  function interp(qa, qb, u) { return [0, 1, 2].map(function (i) { return lerp(qa[i], qb[i], u); }); }

  /* ---- dibujo de la escena ---- */
  function plano(D) {
    return U.axes(D, { xr: [-0.55, 2.0], yr: [-0.62, 1.38] },
      { x: 56, y: 96, w: 528, h: 326, grid: false, noY: false, xt: [0, 1, 2], yt: [0, 1], xd: 0, yd: 0, xl: 'x', yl: 'y' });
  }
  /* todo lo que pueda salirse (círculos, elipses) se recorta al rectángulo del plano */
  function dentro(D, A, f) { U.clipA(D, A, f); }
  function mesa(D, A) {
    var y = A.Y(MESA.y), x0 = A.X(MESA.x0), x1 = A.X(MESA.x1);
    D.rect(x0, y, x1 - x0, 7, null, RG(C.mut, .55));
    for (var x = x0 + 14; x < x1 - 8; x += 26) D.line(x, y + 7, x - 5, y + 30, C.mut, 1.4, null, .4);
    D.line(A.X(-0.12), A.Y(0), A.X(0.12), A.Y(0), C.mut, 5);
    for (var k = 0; k < 4; k++) D.line(A.X(-0.11 + k * .07), A.Y(0), A.X(-0.15 + k * .07), A.Y(-0.12), C.mut, 1.3, null, .45);
  }
  function pieza(D, A, cogida, al) {
    var p = PIEZA, r = 15, pts = [];
    for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 + 0.5; pts.push([A.X(p[0]) + r * Math.cos(a), A.Y(p[1]) - r * Math.sin(a)]); }
    D.path(pts, cogida ? C.ok : C.hl, 2.4, RG(cogida ? C.ok : C.hl, .22), al === undefined ? 1 : al);
  }
  function brazo(D, A, q, col, al, fino) {
    var P = fk(q), w = fino ? 3 : 7;
    D.line(A.X(P[0][0]), A.Y(P[0][1]), A.X(P[1][0]), A.Y(P[1][1]), col || C.m, w, null, al);
    D.line(A.X(P[1][0]), A.Y(P[1][1]), A.X(P[2][0]), A.Y(P[2][1]), col || C.m, w - 1.5, null, al);
    D.line(A.X(P[2][0]), A.Y(P[2][1]), A.X(P[3][0]), A.Y(P[3][1]), col || C.f, w - 3, null, al);
    if (!fino) {
      D.dot(A.X(P[0][0]), A.Y(P[0][1]), 7.5, C.ax, al);
      D.dot(A.X(P[1][0]), A.Y(P[1][1]), 6, C.hl, al);
      D.dot(A.X(P[2][0]), A.Y(P[2][1]), 5, C.hl, al);
      /* pinza */
      var d = P[3][0] - P[2][0], e = P[3][1] - P[2][1], n = Math.hypot(d, e) || 1, nx = -e / n, ny = d / n;
      D.line(A.X(P[3][0] + nx * .07), A.Y(P[3][1] + ny * .07), A.X(P[3][0] - nx * .07), A.Y(P[3][1] - ny * .07), C.f, 3, null, al);
    }
    return P;
  }
  function marco(D, A, p, ang, idx, al, col, dy) {
    var S = 30, c = col || C.ok;
    D.arrow(A.X(p[0]), A.Y(p[1]), A.X(p[0]) + S * Math.cos(ang), A.Y(p[1]) - S * Math.sin(ang), c, 1.9);
    D.arrow(A.X(p[0]), A.Y(p[1]), A.X(p[0]) - S * Math.sin(ang), A.Y(p[1]) - S * Math.cos(ang), c, 1.9);
    D.text('{' + idx + '}', A.X(p[0]) + 9, A.Y(p[1]) + (dy === 1 ? -6 : 21), { s: 15, c: c, al: al, bold: true });
  }
  function caja(D, x, y, w, h, col) {
    D.rect(x, y, w, h, RG(col || C.y, .55), RG(C.bg, .88), 1.4);
  }

  /* ---- la animación ---- */
  M.reg('sr-cadena', M.base({
    title: 'Del encargo a los grados',
    H: 648, dur: 34, poster: 17,
    alt: 'Un brazo de tres eslabones recoge una pieza de una mesa: cadena de transformadas, las dos soluciones de la cinemática inversa y la corrección con el jacobiano.',
    caps: [
      [6, 'El encargo es siempre el mismo: la mano tiene que acabar <b>ahí</b>, sobre la pieza. El robot, en cambio, solo sabe girar sus tres articulaciones. Todo el tema consiste en pasar de una cosa a la otra.'],
      [14, '<b>Cinemática directa.</b> A cada eslabón se le pega un sistema de referencia y una matriz <i>A<sub>i</sub></i> que lo lleva del anterior al suyo. Multiplicándolas, <i>⁰T₃ = A₁·A₂·A₃</i>, los grados se convierten en una posición.'],
      [22, '<b>Cinemática inversa.</b> Ahora al revés: se conoce el punto y se buscan los grados. La ley del coseno da <i>cos θ₂ = (d² − L₁² − L₂²)/(2L₁L₂)</i>, y como el coseno no distingue el signo salen <b>dos</b> posturas que llegan al mismo sitio.'],
      [30, '<b>El último milímetro.</b> Si los ángulos se redondean a grados enteros, la mano se queda a 9,94 mm. El jacobiano dice cuánto se mueve la punta por cada grado, y resolviendo <i>Δθ = J⁻¹·Δx</i> el error cae a 0,06 mm y luego a cero.'],
      [99, '<b>Ojo con el brazo estirado.</b> <i>det J = L₁·L₂·sen θ₂</i> se anula cuando θ₂ → 0: en esa postura el robot pierde un grado de libertad y la corrección deja de funcionar. Es una singularidad.']
    ]
  }, function (D, t) {
    var A = plano(D), P;
    mesa(D, A);

    /* ---------- 1. el encargo (0–6 s) ---------- */
    if (t < 6) {
      var u = ease(seg(t, 0.3, 2.2));
      P = brazo(D, A, REPOSO, C.m, 1);
      pieza(D, A, false);
      if (u > 0) {
        D.line(A.X(P[3][0]), A.Y(P[3][1]), A.X(lerp(P[3][0], PIEZA[0], u)), A.Y(lerp(P[3][1], PIEZA[1], u)), C.y, 2, [7, 5], .9);
        D.ring(A.X(PIEZA[0]), A.Y(PIEZA[1]), 15 + 9 * (1 - u), C.y, 2);
      }
      var v = ease(seg(t, 2.6, 4.2));
      if (v > 0) {
        D.text('¿qué θ₁, θ₂, θ₃?', A.X(0.12), A.Y(0.78), { s: 21, it: true, c: C.y, al: v, bold: true });
        [[0, '₁'], [1, '₂'], [2, '₃']].forEach(function (z, i) {
          D.ring(A.X(P[z[0]][0]), A.Y(P[z[0]][1]), 13, C.y, 1.6);
        });
      }
      U.readout(D, ['L₁ = 1,00 m   L₂ = 0,70 m   L₃ = 0,25 m',
        'pieza en (1,15 ; 0,35) m, con la mano horizontal'], 566);
    }

    /* ---------- 2. cinemática directa (6–14 s) ---------- */
    else if (t < 14) {
      var s = t - 6, u2 = ease(seg(s, 0.4, 4.6));
      var q = interp(REPOSO, ARRIBA, u2);
      P = brazo(D, A, q, C.m, 1);
      pieza(D, A, false);
      var ang = [q[0], q[0] + q[1], q[0] + q[1] + q[2]];
      for (var i = 0; i < 4; i++) {
        var al = ease(seg(s, 0.6 + i * 0.75, 1.5 + i * 0.75));
        if (al > 0) marco(D, A, P[i], i ? ang[i - 1] : 0, i, al, i === 3 ? C.f : C.ok, i);
      }
      /* la cadena de matrices, apareciendo término a término */
      var bx = 352, by = 96;
      caja(D, bx, by, 252, 104, C.ok);
      D.text('⁰T₃  =  A₁ · A₂ · A₃', bx + 126, by + 32, { s: 21, a: 'center', c: C.ok, it: true, bold: true });
      ['A₁ = Rot(z,θ₁)·Tras(x,L₁)', 'A₂ = Rot(z,θ₂)·Tras(x,L₂)', 'A₃ = Rot(z,θ₃)·Tras(x,L₃)'].forEach(function (ln, k) {
        var al2 = ease(seg(s, 1.4 + k * 0.75, 2.2 + k * 0.75));
        if (al2 > 0) D.text(ln, bx + 126, by + 56 + k * 19, { s: 14, a: 'center', c: C.w, al: al2, it: true });
      });
      U.readout(D, ['θ = (' + nf(q[0] * DEG, 1) + '°, ' + nf(q[1] * DEG, 1) + '°, ' + nf(q[2] * DEG, 1) + '°)',
        'la mano cae en (' + nf(P[3][0], 3) + ' ; ' + nf(P[3][1], 3) + ') m'], 566);
    }

    /* ---------- 3. cinemática inversa (14–22 s) ---------- */
    else if (t < 22) {
      var s3 = t - 14;
      var mu = [PIEZA[0] - L3 * Math.cos(PHI), PIEZA[1] - L3 * Math.sin(PHI)];
      var d = Math.hypot(mu[0], mu[1]);
      pieza(D, A, false);
      /* los dos círculos que se cortan */
      var uc = ease(seg(s3, 0.3, 2.0));
      if (uc > 0) {
        dentro(D, A, function () {
          D.ctx.save(); D.ctx.globalAlpha = uc * .8;
          D.ring(A.X(0), A.Y(0), A.X(L1) - A.X(0), C.f, 1.6);
          D.ring(A.X(mu[0]), A.Y(mu[1]), A.X(L2) - A.X(0), C.g, 1.6);
          D.ctx.restore();
        });
        D.line(A.X(0), A.Y(0), A.X(mu[0]), A.Y(mu[1]), C.mut, 1.4, [5, 4], uc);
        D.text('d = ' + nf(d, 3) + ' m', A.X(mu[0] / 2), A.Y(mu[1] / 2) - 12, { s: 15, c: C.mut, it: true, al: uc, a: 'center' });
        D.dot(A.X(mu[0]), A.Y(mu[1]), 5, C.g, uc);
        D.text('muñeca', A.X(mu[0]) - 10, A.Y(mu[1]) - 12, { s: 14, c: C.g, al: uc, a: 'right' });
      }
      /* las dos posturas */
      var ua = ease(seg(s3, 2.2, 3.6)), ub = ease(seg(s3, 4.0, 5.4));
      if (ua > 0) { brazo(D, A, ARRIBA, C.f, ua, true); var Pa = fk(ARRIBA); D.dot(A.X(Pa[1][0]), A.Y(Pa[1][1]), 6, C.f, ua); D.text('codo arriba', A.X(Pa[1][0]) + 12, A.Y(Pa[1][1]) - 10, { s: 15, c: C.f, al: ua, bold: true }); }
      if (ub > 0) {
        brazo(D, A, ABAJO, C.g, ub, true); var Pb = fk(ABAJO);
        D.dot(A.X(Pb[1][0]), A.Y(Pb[1][1]), 6, C.g, ub);
        D.text('codo abajo', A.X(Pb[1][0]) + 12, A.Y(Pb[1][1]) + 6, { s: 15, c: C.g, al: ub, bold: true });
        D.text('atraviesa la mesa', A.X(Pb[1][0]) + 12, A.Y(Pb[1][1]) + 24, { s: 13, c: C.bad, al: ub, it: true });
      }
      /* la fórmula */
      var bx3 = 332, by3 = 92, uf = ease(seg(s3, 1.2, 2.4));
      if (uf > 0) {
        caja(D, bx3, by3, 272, 92, C.y);
        D.text('cos θ₂ = (d² − L₁² − L₂²) / (2·L₁·L₂)', bx3 + 136, by3 + 30, { s: 16, a: 'center', c: C.y, it: true, al: uf });
        D.text('cos θ₂ = −0,3982', bx3 + 136, by3 + 55, { s: 17, a: 'center', c: C.w, it: true, al: uf });
        D.text('θ₂ = ±113,5°  →  dos soluciones', bx3 + 136, by3 + 78, { s: 15, a: 'center', c: C.hl, it: true, al: uf });
      }
      U.readout(D, [ua > .5 ? 'codo arriba:  θ = (+62,9°, −113,5°, +50,5°)' : '',
        ub > .5 ? 'codo abajo:  θ = (−20,4°, +113,5°, −93,0°)  ·  descartada' : ''], 566);
    }

    /* ---------- 4. el último milímetro (22–30 s) ---------- */
    else if (t < 30) {
      var s4 = t - 22;
      /* iteración real de Newton, recalculada en cada fotograma */
      var qk = [63 * RAD, -113 * RAD, 51 * RAD], obj = [PIEZA[0], PIEZA[1], PHI], hist = [];
      for (var k = 0; k < 3; k++) {
        var Pk = fk(qk), ek = [obj[0] - Pk[3][0], obj[1] - Pk[3][1], obj[2] - (qk[0] + qk[1] + qk[2])];
        hist.push({ q: qk.slice(), P: Pk, e: Math.hypot(ek[0], ek[1]) });
        var dq = sol3(jac(qk), ek);
        qk = [qk[0] + dq[0], qk[1] + dq[1], qk[2] + dq[2]];
      }
      var paso = clamp(Math.floor(seg(s4, 0.8, 6.2) * 3), 0, 2), h = hist[paso];
      P = brazo(D, A, h.q, paso === 2 ? C.ok : C.m, 1);
      pieza(D, A, paso === 2 && s4 > 5.2);
      /* el hueco que queda */
      D.line(A.X(P[3][0]), A.Y(P[3][1]), A.X(PIEZA[0]), A.Y(PIEZA[1]), C.bad, 2.4, [4, 3]);
      /* recuadro de aumento */
      var zx = 56, zy = 436, ZS = 96, Z = 46;
      D.rect(zx, zy, ZS * 2, ZS * .92, RG(C.mut, .5), RG(C.bg, .9), 1.4);
      D.text('la punta y la pieza, ×' + Z, zx + ZS, zy - 9, { s: 14, a: 'center', c: C.mut, it: true });
      var cxz = zx + ZS, cyz = zy + ZS * 0.42;
      D.dot(cxz, cyz, 5, C.hl);
      D.dot(cxz + (P[3][0] - PIEZA[0]) * Z * 40, cyz - (P[3][1] - PIEZA[1]) * Z * 40, 4.5, paso === 2 ? C.ok : C.bad);
      D.text(nf(h.e * 1000, paso === 2 ? 4 : 2) + ' mm', cxz, zy + ZS * .78, { s: 15, a: 'center', c: paso === 2 ? C.ok : C.bad, it: true, bold: true });
      /* la fórmula del paso */
      var bx4 = 352, by4 = 92;
      caja(D, bx4, by4, 252, 86, C.f);
      D.text('ẋ = J(θ)·θ̇', bx4 + 126, by4 + 28, { s: 19, a: 'center', c: C.f, it: true, bold: true });
      D.text('Δθ = J⁻¹ · Δx', bx4 + 126, by4 + 54, { s: 19, a: 'center', c: C.w, it: true });
      D.text('paso ' + paso + ' de 2', bx4 + 126, by4 + 74, { s: 14, a: 'center', c: C.mut });
      U.readout(D, ['θ = (' + nf(h.q[0] * DEG, 3) + '°, ' + nf(h.q[1] * DEG, 3) + '°, ' + nf(h.q[2] * DEG, 3) + '°)',
        'distancia a la pieza: ' + nf(h.e * 1000, 2) + ' mm'], 566);
    }

    /* ---------- 5. la singularidad (30–34 s) ---------- */
    else {
      var s5 = t - 30, u5 = ease(seg(s5, 0.2, 2.6));
      var qs = [lerp(ABAJO[0], 8 * RAD, u5), lerp(ABAJO[1], 0, u5), lerp(ABAJO[2], 2 * RAD, u5)];
      P = brazo(D, A, qs, u5 > .75 ? C.bad : C.m, 1);
      pieza(D, A, false, .45);
      var det = L1 * L2 * Math.sin(qs[1]);
      /* la elipse de manipulabilidad, aplastándose */
      var J = jac(qs), cx = A.X(P[3][0]), cy = A.Y(P[3][1]), pts = [];
      for (var i5 = 0; i5 <= 72; i5++) {
        var a5 = i5 / 72 * 2 * Math.PI, c5 = Math.cos(a5), s51 = Math.sin(a5);
        pts.push([cx + (J[0][0] * c5 + J[0][1] * s51) * 42, cy - (J[1][0] * c5 + J[1][1] * s51) * 42]);
      }
      dentro(D, A, function () { D.path(pts, C.hl, 2, RG(C.hl, .16), .95); });
      var bx5 = 332, by5 = 96;
      caja(D, bx5, by5, 272, 82, C.bad);
      D.text('det J = L₁·L₂·sen θ₂', bx5 + 136, by5 + 30, { s: 19, a: 'center', c: C.bad, it: true, bold: true });
      D.text('det J = ' + nf(det, 4), bx5 + 136, by5 + 58, { s: 18, a: 'center', c: Math.abs(det) < .06 ? C.bad : C.w, it: true });
      if (u5 > .92) D.text('¡singularidad!', A.X(0.42), A.Y(1.02), { s: 22, c: C.bad, it: true, bold: true, a: 'center' });
      U.readout(D, ['θ₂ = ' + nf(qs[1] * DEG, 1) + '°   →   la elipse se aplasta',
        'el brazo estirado pierde un grado de libertad'], 566);
    }
  }));
})();
