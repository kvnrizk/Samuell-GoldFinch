"""
pen.py — Calligraphy pen simulation.
"""

import math


def calculate_thickness(prev_point, curr_point,
                        min_width=1.5, max_width=5.0):
    """
    Simulate pen pressure: thicker on downstrokes, thinner on upstrokes.
    """
    dx = curr_point[0] - prev_point[0]
    dy = curr_point[1] - prev_point[1]
    angle = math.atan2(dy, dx)
    pressure = abs(math.sin(angle))
    return min_width + (max_width - min_width) * pressure


def ease_in_out(t):
    """Smooth acceleration/deceleration (Hermite interpolation)."""
    return t * t * (3 - 2 * t)
