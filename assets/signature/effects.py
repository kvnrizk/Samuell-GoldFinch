"""
effects.py — Visual effects for the premium signature.
"""

import random


def gold_gradient(progress):
    """
    Returns an RGB tuple (0-1 range) shifting from dark gold to bright gold.
    progress: 0.0 (dark) to 1.0 (bright)
    """
    progress = max(0.0, min(1.0, progress))
    r = (138 + (232 - 138) * progress) / 255
    g = (109 + (212 - 109) * progress) / 255
    b = (43 + (139 - 43) * progress) / 255
    return (r, g, b)


def draw_sparkles(turtle_obj, path_points, count=40):
    """Draw tiny gold dots scattered near the given points."""
    turtle_obj.penup()
    for _ in range(count):
        point = random.choice(path_points)
        offset_x = random.uniform(-15, 15)
        offset_y = random.uniform(-15, 15)
        size = random.uniform(1, 3)
        brightness = random.uniform(0.4, 1.0)
        color = gold_gradient(brightness)
        turtle_obj.goto(point[0] + offset_x, point[1] + offset_y)
        turtle_obj.dot(size, color)
