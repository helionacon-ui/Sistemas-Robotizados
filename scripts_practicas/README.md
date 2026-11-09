# Scripts de las prácticas (Python)

Versión en Python de las funciones de las prácticas de Sistemas Robotizados. Solo necesita **numpy**.

| Archivo | Qué hace | Equivale a |
|---|---|---|
| `cuaterniones.py` | producto, conjugado, giro con cuaternio, paso cuaternio ↔ matriz | `proquat`, `conjugado` |
| `matrices.py` | giros y traslaciones 4×4, matriz de Denavit-Hartenberg | `matrizth`, `mat_dh` |
| `relacionar_sistemas.py` | encadena giros y traslaciones (con matrices y con cuaternios) | `relacionar_sistemas` |
| `test_practicas.py` | comprueba que todo coincide con los valores de la práctica | — |

Uso:

    python test_practicas.py
    python relacionar_sistemas.py

Convenciones: ángulos en radianes en el código (en la guía, grados); cuaternio = (w, x, y, z) con w primero; traslaciones expresadas en el sistema ya girado.

Los datos de comprobación son los de la práctica «relacionar sistemas»: el punto P1 sale (0,3258 ; 6,1213 ; 7).

Ojo: la lectura de la hoja impresa da 0,3256 en la primera coordenada, pero el cálculo da 0,3258. Revisa la hoja original antes de fiarte de la última cifra.
