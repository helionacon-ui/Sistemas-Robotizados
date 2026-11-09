"""Encadenar giros y traslaciones (práctica «relacionar sistemas»).

Secuencia: P = r1; después, para cada giro i:
    Q = Q · Rot(eje_i, ang_i)        (orientación acumulada)
    P = P + Q · r_{i+1}              (la traslación se expresa en el sistema girado)
Con los datos de comprobación de la práctica, los puntos son:
    P1 = (0,3258 ; 6,1213 ; 7), P2 = (−1,0817 ; 11,3739 ; 9,5357), P3 = (2,0530 ; 15,5091 ; 9,8084)
"""
import numpy as np
from matrices import rot, trasl
import cuaterniones as cq


def encadenar_matrices(r, giros):
    """r: lista de k+1 traslaciones; giros: lista de (eje, ang_rad) de longitud k."""
    P = np.asarray(r[0], dtype=float)
    Q = np.eye(3)
    puntos = []
    for i, (eje, ang) in enumerate(giros):
        Q = Q @ rot(eje, ang)[:3, :3]
        P = P + Q @ np.asarray(r[i + 1], dtype=float)
        puntos.append(P.copy())
    return puntos


def encadenar_cuaterniones(r, giros):
    """Misma cadena con cuaterniones (sin pasar por matrices)."""
    P = np.asarray(r[0], dtype=float)
    Q = np.array([1.0, 0.0, 0.0, 0.0])
    puntos = []
    for i, (eje, ang) in enumerate(giros):
        Q = cq.producto(Q, cq.desde_eje_angulo(eje, ang))
        P = P + cq.rotar_vector(Q, r[i + 1])
        puntos.append(P.copy())
    return puntos


if __name__ == '__main__':
    r = [(4, 4, 0), (-3, 3, 7), (0, 6, 0), (3, 3, 3)]
    giros = [('z', np.radians(15)), ('x', np.radians(25)), ('y', np.radians(60))]
    for k, (a, b) in enumerate(zip(encadenar_matrices(r, giros), encadenar_cuaterniones(r, giros)), 1):
        print(f'P{k} =', np.round(a, 4), ' (cuaternios: ', np.round(b, 4), ')')
