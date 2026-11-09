import re, subprocess, unicodedata, os
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=lambda n: os.path.join(RAIZ,'descargas',n)
from pypdf import PdfReader, PdfWriter
import html as H
def norm(t): 
    t=unicodedata.normalize('NFKD',t); t=''.join(c for c in t if not unicodedata.combining(c))
    return re.sub(r'\s+',' ',t).strip().lower()
src=open(D('Guia_estudio_Sistemas_Robotizados.html'),encoding='utf-8').read()
h2=[norm(H.unescape(re.sub(r'<[^>]+>','',x))) for x in re.findall(r'<h2>(.*?)</h2>',src,re.S)]
ex=[(H.unescape(re.sub(r'<[^>]+>','',m.group(1))).strip()) for m in re.finditer(r'<summary>(Ejercicio [^<]*?)</summary>',src)]
def build(pdf, out, items):
    n=len(PdfReader(pdf).pages)
    texts=[norm(subprocess.run(['pdftotext','-f',str(i+1),'-l',str(i+1),'-layout',pdf,'-'],capture_output=True,text=True).stdout) for i in range(n)]
    w=PdfWriter(clone_from=pdf)
    found=[]
    last=0
    for title in items:
        key=norm(title)[:40]
        for i in range(last,n):
            if key and key in re.sub(r'\s+',' ',texts[i]):
                found.append((title,i)); last=i; break
    for title,i in found:
        w.add_outline_item(title, i)
    w.write(out)
    return found
f1=build(D('Guia_completa_Sistemas_Robotizados.pdf'),D('Guia_completa_Sistemas_Robotizados.pdf'),
         [x.split('</h2>')[0] for x in []] or [H.unescape(re.sub(r'<[^>]+>','',x)) for x in re.findall(r'<h2>(.*?)</h2>',src,re.S)])
print('guía: marcadores', len(f1), [t for t,_ in f1][:20])
f2=build(D('Ejercicios_resueltos_Sistemas_Robotizados.pdf'),D('Ejercicios_resueltos_Sistemas_Robotizados.pdf'), ex)
print('resueltos: marcadores', len(f2), [t for t,_ in f2])
