"""Matrices de transformación homogénea (equivale a matrizth y mat_dh de la práctica)."""
import numpy as np


def rot(eje, ang):
    """Matriz 4x4 de un giro de ang (rad) alrededor de x, y o z."""
    c, s = np.cos(ang), np.sin(ang)
    T = np.eye(4)
    if eje == 'x':
        T[1:3, 1:3] = [[c, -s], [s, c]]
    elif eje == 'y':
        T[[0, 0, 2, 2], [0, 2, 0, 2]] = [c, s, -s, c]
    elif eje == 'z':
        T[0:2, 0:2] = [[c, -s], [s, c]]
    else:
        raise ValueError("eje debe ser 'x', 'y' o 'z'")
    return T


def trasl(r):
    """Matriz 4x4 de una traslación r = (x, y, z)."""
    T = np.eye(4)
    T[:3, 3] = r
    return T


def dh(theta, d, a, alpha):
    """Matriz A_i de Denavit-Hartenberg: Rz(theta) Tz(d) Tx(a) Rx(alpha)."""
    ct, st = np.cos(theta), np.sin(theta)
    ca, sa = np.cos(alpha), np.sin(alpha)
    return np.array([
        [ct, -ca * st, sa * st, a * ct],
        [st, ca * ct, -sa * ct, a * st],
        [0, sa, ca, d],
        [0, 0, 0, 1]])
