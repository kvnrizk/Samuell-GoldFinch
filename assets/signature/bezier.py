"""
bezier.py — Cubic Bézier curve utilities.
Used for the underline flourish and any decorative curves.
"""


def cubic_bezier(t, p0, p1, p2, p3):
    """
    Calculate a point on a cubic Bézier curve.
    t: progress from 0.0 (start) to 1.0 (end)
    p0-p3: control points as (x, y) tuples
    """
    u = 1 - t
    x = (u**3 * p0[0] + 3 * u**2 * t * p1[0]
         + 3 * u * t**2 * p2[0] + t**3 * p3[0])
    y = (u**3 * p0[1] + 3 * u**2 * t * p1[1]
         + 3 * u * t**2 * p2[1] + t**3 * p3[1])
    return (x, y)


def get_curve_points(p0, p1, p2, p3, steps=50):
    """Generate a list of points along a cubic Bézier curve."""
    return [cubic_bezier(i / steps, p0, p1, p2, p3)
            for i in range(steps + 1)]
