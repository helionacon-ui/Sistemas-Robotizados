"""Pruebas: python test_practicas.py  (no necesita nada más que numpy)."""
import numpy as np
import cuaterniones as cq
import matrices as mt
from relacionar_sistemas import encadenar_matrices, encadenar_cuaterniones

def test_cuaternio_matriz():
    for eje, ang in [('x', 0.3), ('y', 1.1), ('z', -0.7)]:
        q = cq.desde_eje_angulo(eje, ang)
        assert np.allclose(cq.a_matriz(q), mt.rot(eje, ang)[:3, :3])
        assert np.allclose(cq.desde_matriz(cq.a_matriz(q)) * np.sign(q[0]), q)

def test_producto_conjugado():
    q = cq.desde_eje_angulo([1, 1, 1], 0.9)
    assert np.allclose(cq.producto(q, cq.conjugado(q)), [1, 0, 0, 0])
    r = np.array([1.0, 2.0, 3.0])
    assert np.allclose(cq.rotar_vector(q, r), cq.a_matriz(q) @ r)

def test_dh_forma():
    A = mt.dh(0.4, 0.2, 1.0, np.pi / 2)
    assert np.allclose(A[:3, :3] @ A[:3, :3].T, np.eye(3))
    assert np.isclose(A[2, 3], 0.2) and np.isclose(A[0, 3], np.cos(0.4))

def test_relacionar_comprobacion():
    r = [(4, 4, 0), (-3, 3, 7), (0, 6, 0), (3, 3, 3)]
    giros = [('z', np.radians(15)), ('x', np.radians(25)), ('y', np.radians(60))]
    esperado = [(0.3258, 6.1213, 7.0), (-1.0817, 11.3739, 9.5357), (2.0530, 15.5091, 9.8084)]
    for a, b, e in zip(encadenar_matrices(r, giros), encadenar_cuaterniones(r, giros), esperado):
        assert np.allclose(a, e, atol=2e-4), (a, e)
        assert np.allclose(a, b)

if __name__ == '__main__':
    for f in [test_cuaternio_matriz, test_producto_conjugado, test_dh_forma, test_relacionar_comprobacion]:
        f(); print('OK', f.__name__)
