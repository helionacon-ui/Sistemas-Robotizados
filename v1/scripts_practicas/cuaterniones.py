"""Cuaterniones unitarios Q = (w, x, y, z) con convención de Hamilton.

Equivalencias con las funciones de la práctica de cuaterniones:
  proquat(q1, q2)   -> producto(q1, q2)
  conjugado(q)      -> conjugado(q)
  rotación de un vector r con cuaternio Q: (0, r') = Q (0, r) Q*
"""
import numpy as np


def producto(q1, q2):
    """Producto de cuaterniones (equivale a proquat de la práctica)."""
    q1 = np.asarray(q1, dtype=float)
    q2 = np.asarray(q2, dtype=float)
    esc = q1[0] * q2[0] - np.dot(q1[1:], q2[1:])
    vect = np.cross(q1[1:], q2[1:]) + q1[0] * q2[1:] + q2[0] * q1[1:]
    return np.concatenate(([esc], vect))


def conjugado(q):
    """Conjugado (equivale a conjugado de la práctica)."""
    q = np.asarray(q, dtype=float)
    return np.array([q[0], -q[1], -q[2], -q[3]])


def desde_eje_angulo(eje, ang):
    """Cuaternio de un giro de ang (rad) alrededor de eje (vector o 'x','y','z')."""
    if isinstance(eje, str):
        eje = {'x': [1, 0, 0], 'y': [0, 1, 0], 'z': [0, 0, 1]}[eje]
    u = np.asarray(eje, dtype=float)
    u = u / np.linalg.norm(u)
    return np.concatenate(([np.cos(ang / 2)], np.sin(ang / 2) * u))


def rotar_vector(q, r):
    """Gira el vector r con el cuaternio unitario q: q (0, r) q*."""
    v = producto(producto(q, [0, *r]), conjugado(q))
    return v[1:]


def a_matriz(q):
    """Matriz de rotación 3x3 de un cuaternio unitario."""
    w, x, y, z = q
    return np.array([
        [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
        [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
        [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)]])


def desde_matriz(R):
    """Cuaternio (w >= 0) de una matriz de rotación. Método de Shepperd."""
    R = np.asarray(R, dtype=float)
    tr = np.trace(R)
    if tr > 0:
        s = np.sqrt(tr + 1.0) * 2
        q = np.array([0.25 * s, (R[2, 1] - R[1, 2]) / s, (R[0, 2] - R[2, 0]) / s, (R[1, 0] - R[0, 1]) / s])
    elif R[0, 0] > R[1, 1] and R[0, 0] > R[2, 2]:
        s = np.sqrt(1.0 + R[0, 0] - R[1, 1] - R[2, 2]) * 2
        q = np.array([(R[2, 1] - R[1, 2]) / s, 0.25 * s, (R[0, 1] + R[1, 0]) / s, (R[0, 2] + R[2, 0]) / s])
    elif R[1, 1] > R[2, 2]:
        s = np.sqrt(1.0 + R[1, 1] - R[0, 0] - R[2, 2]) * 2
        q = np.array([(R[0, 2] - R[2, 0]) / s, (R[0, 1] + R[1, 0]) / s, 0.25 * s, (R[1, 2] + R[2, 1]) / s])
    else:
        s = np.sqrt(1.0 + R[2, 2] - R[0, 0] - R[1, 1]) * 2
        q = np.array([(R[1, 0] - R[0, 1]) / s, (R[0, 2] + R[2, 0]) / s, (R[1, 2] + R[2, 1]) / s, 0.25 * s])
    return q if q[0] >= 0 else -q
