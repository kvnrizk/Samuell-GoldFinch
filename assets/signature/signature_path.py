# Bezier control points for the "Samuel Goldfinch" premium signature.
# Each curve = [p0, p1, p2, p3] (cubic Bezier).
# Consecutive curves share endpoints for smooth, continuous strokes.

# ── "Samuel" ── (one continuous stroke)
SAMUEL_CURVES = [
    # Capital S - decorative entry upstroke
    [(-380, -20), (-365, 30), (-340, 70), (-305, 50)],
    # S - top curve sweeping back
    [(-305, 50), (-275, 35), (-280, 10), (-260, 0)],
    # S - bottom curve forward
    [(-260, 0), (-240, -12), (-255, -40), (-275, -30)],
    # S - exit stroke rising to connect to 'a'
    [(-275, -30), (-265, -20), (-255, 8), (-240, 20)],
    # a - small arch
    [(-240, 20), (-228, 32), (-215, 28), (-208, 15)],
    # a-to-m connector
    [(-208, 15), (-202, 5), (-198, 8), (-192, 18)],
    # m - first hump
    [(-192, 18), (-185, 35), (-175, 35), (-168, 18)],
    # m - second hump
    [(-168, 18), (-161, 35), (-150, 32), (-142, 15)],
    # u - dip down and back up
    [(-142, 15), (-135, -2), (-118, -2), (-108, 15)],
    # e - small loop
    [(-108, 15), (-100, 28), (-88, 22), (-82, 12)],
    # l - tall upstroke and back down
    [(-82, 12), (-76, 35), (-68, 50), (-58, 15)],
]

# ── "Goldfinch" ── (pen lifts after Samuel, starts a new stroke)
GOLDFINCH_CURVES = [
    # Capital G - sweeping entry upward
    [(-20, 5), (-8, 55), (10, 75), (40, 58)],
    # G - top arc curving down
    [(40, 58), (65, 42), (55, 12), (38, 2)],
    # G - crossbar and exit right
    [(38, 2), (25, -8), (50, -2), (68, 12)],
    # o - small loop
    [(68, 12), (62, 28), (78, 32), (88, 18)],
    # l - upstroke
    [(88, 18), (94, 40), (104, 48), (112, 18)],
    # d - tall upstroke
    [(112, 18), (116, 45), (126, 50), (130, 22)],
    # d - exit connector
    [(130, 22), (133, 8), (138, 5), (145, 15)],
    # f - tall stroke
    [(145, 15), (150, 42), (158, 52), (162, 18)],
    # i - short connector
    [(162, 18), (166, 5), (172, 5), (178, 15)],
    # n - hump
    [(178, 15), (186, 32), (198, 30), (208, 12)],
    # c - open curve
    [(208, 12), (202, 25), (218, 28), (228, 15)],
    # h - upstroke
    [(228, 15), (234, 38), (242, 42), (248, 18)],
    # h - hump and exit
    [(248, 18), (256, 32), (268, 25), (280, 8)],
    # Sweeping exit tail
    [(280, 8), (300, -5), (340, -18), (385, 5)],
]

# ── Underline flourish ──
FLOURISH_CURVES = [
    [(-350, -55), (-150, -78), (100, -68), (385, -35)],
]

# ── SG Monogram (small, centered above the signature) ──
MONOGRAM_S = [
    [(-20, 108), (-18, 122), (-8, 128), (-2, 120)],
    [(-2, 120), (3, 113), (-5, 105), (-14, 110)],
]

MONOGRAM_G = [
    [(5, 112), (3, 126), (15, 130), (22, 120)],
    [(22, 120), (28, 112), (18, 105), (10, 110)],
    [(10, 110), (8, 108), (16, 109), (20, 114)],
]

# ── Dot for the 'i' in Goldfinch ──
I_DOT_POS = (170, 38)
