"""
Samuel Goldfinch - Premium Animated Signature (Luxury Ink Style)
Uses font rendering with accurate tkinter font metrics for proper spacing.
"""
import turtle
import time
import random
import os
import tkinter.font as tkfont

from effects import gold_gradient


# ── CONFIG ───────────────────────────────────────────────
SCREEN_W, SCREEN_H = 1400, 700
BG_COLOR = "#0B0E13"

FONT_CANDIDATES = [
    "Playfair Display", "Georgia", "Palatino Linotype",
    "Palatino", "Book Antiqua", "Garamond", "Times New Roman",
]

TITLE_SIZE = 72
LETTER_DELAY = 0.08
SPARKLE_COUNT = 55

NAME_Y = 5         # "Samuel" baseline
LAST_Y = -85       # "Goldfinch" baseline
MONO_Y = 125       # monogram center


# ── SETUP ────────────────────────────────────────────────

def setup_screen():
    screen = turtle.Screen()
    screen.bgcolor(BG_COLOR)
    screen.setup(SCREEN_W, SCREEN_H)
    screen.title("Samuel Goldfinch - Premium Signature")
    screen.colormode(1.0)
    turtle.tracer(0)
    return screen


def new_pen():
    p = turtle.Turtle()
    p.hideturtle()
    p.speed(0)
    return p


def pick_font():
    """Return the first installed font from candidates."""
    available = set(tkfont.families())
    for name in FONT_CANDIDATES:
        if name in available:
            return name
    return "Times New Roman"


# ── BACKGROUND VIGNETTE ─────────────────────────────────

def draw_vignette(pen):
    """Subtle radial glow in the center of the canvas."""
    pen.penup()
    pen.goto(0, 0)
    # BG is #0B0E13 ~ (0.043, 0.055, 0.075) — go slightly lighter toward center
    for radius, r, g, b in [
        (800, 0.055, 0.065, 0.088),
        (550, 0.062, 0.072, 0.095),
        (350, 0.070, 0.080, 0.102),
    ]:
        pen.dot(radius, (r, g, b))


# ── ROUNDED BORDER ──────────────────────────────────────

def _draw_rounded_rect(pen, half_w, half_h, r, color, width):
    """Draw a single centered rounded rectangle."""
    pen.penup()
    pen.pencolor(color)
    pen.pensize(width)
    pen.goto(-half_w + r, -half_h)
    pen.setheading(0)
    pen.pendown()
    pen.forward(2 * half_w - 2 * r)
    pen.circle(r, 90)
    pen.forward(2 * half_h - 2 * r)
    pen.circle(r, 90)
    pen.forward(2 * half_w - 2 * r)
    pen.circle(r, 90)
    pen.forward(2 * half_h - 2 * r)
    pen.circle(r, 90)
    pen.penup()


def draw_border(pen):
    """Gold rounded border with a subtle outer glow."""
    w = SCREEN_W // 2 - 35
    h = SCREEN_H // 2 - 35
    r = 12
    # Glow layers (outermost first)
    _draw_rounded_rect(pen, w + 3, h + 3, r + 2, (0.10, 0.08, 0.03), 5)
    _draw_rounded_rect(pen, w + 1, h + 1, r + 1, (0.18, 0.15, 0.06), 3)
    # Main border
    _draw_rounded_rect(pen, w, h, r, (0.60, 0.48, 0.20), 2.2)
    turtle.update()


# ── MONOGRAM ────────────────────────────────────────────

def draw_monogram(pen, x, y, radius=40):
    """SG monogram inside a double gold circle."""
    font_family = pick_font()

    steps = 200  # high step count for smooth circles

    # Outer circle glow (soft halo behind the main line)
    pen.penup()
    pen.setheading(0)
    pen.goto(x, y - radius - 1)
    pen.pencolor(0.16, 0.13, 0.05)
    pen.pensize(6)
    pen.pendown()
    pen.circle(radius + 1, steps=steps)
    pen.penup()

    # Outer circle
    pen.goto(x, y - radius)
    pen.pencolor(gold_gradient(0.60))
    pen.pensize(2.5)
    pen.pendown()
    pen.circle(radius, steps=steps)
    pen.penup()

    # Inner circle
    inner_r = radius - 6
    pen.goto(x, y - inner_r)
    pen.pencolor(gold_gradient(0.45))
    pen.pensize(1.5)
    pen.pendown()
    pen.circle(inner_r, steps=steps)
    pen.penup()

    # "SG" text — adaptive sizing to fit inside the circle regardless of DPI
    # Search for the largest font size that fits (ascent includes space above caps,
    # so we can be generous — actual cap height is ~70% of ascent)
    target_h = inner_r * 1.15
    target_w = inner_r * 1.85
    mono_size = 12
    for size in range(12, 60):
        f = tkfont.Font(family=font_family, size=size, weight="bold")
        if f.metrics()["ascent"] > target_h or f.measure("SG") > target_w:
            mono_size = size - 1
            break
        mono_size = size

    tk_font = tkfont.Font(family=font_family, size=mono_size, weight="bold")
    sg_w = tk_font.measure("SG")
    ascent = tk_font.metrics()["ascent"]

    # Center horizontally via measured width, vertically via measured ascent
    pen.goto(x - sg_w / 2, y - ascent / 2)
    pen.pencolor(gold_gradient(0.65))
    pen.write("SG", font=(font_family, mono_size, "bold"))
    turtle.update()


# ── LETTER-BY-LETTER TEXT ───────────────────────────────

def animate_text(pen, text, y, font_family, font_size, delay=0.08):
    """
    Write text letter-by-letter with gold gradient.
    Uses tkinter.font.Font.measure() for accurate kerned positioning.
    Returns a list of (x, y) character centres for sparkle placement.
    """
    tk_font = tkfont.Font(family=font_family, size=font_size)
    total_w = tk_font.measure(text)
    start_x = -total_w / 2

    char_positions = []

    for i, ch in enumerate(text):
        progress = i / max(len(text) - 1, 1)
        color = gold_gradient(progress)

        # Cumulative width gives the correct kerned x-position
        x = start_x + tk_font.measure(text[:i])

        pen.penup()
        pen.goto(x, y)
        pen.pencolor(color)
        pen.write(ch, font=(font_family, font_size, "normal"))

        if ch.strip():
            ch_w = tk_font.measure(ch)
            char_positions.append((x + ch_w / 2, y + font_size * 0.4))

        turtle.update()
        time.sleep(delay)

    return char_positions


# ── CORNER SPARKLES ─────────────────────────────────────

def draw_sparkles(pen, count=55):
    """Gold dust concentrated in the top-left and bottom-right corners."""
    pen.penup()
    w = SCREEN_W // 2 - 55
    h = SCREEN_H // 2 - 55

    corners = [
        (-w, h,  250, -250),   # top-left
        ( w, -h, -250,  250),  # bottom-right
    ]

    for idx in range(count):
        cx, cy, sx, sy = random.choice(corners)
        # Concentrate toward the corner (power curve)
        ox = (random.random() ** 1.5) * sx
        oy = (random.random() ** 1.5) * sy
        size = random.uniform(1.0, 4.0)
        color = gold_gradient(random.uniform(0.35, 1.0))
        pen.goto(cx + ox, cy + oy)
        pen.dot(size, color)
        if idx % 4 == 0:
            turtle.update()
            time.sleep(0.015)
    turtle.update()


# ── MAIN SHOW ────────────────────────────────────────────

def main():
    screen = setup_screen()
    font_family = pick_font()

    # 1. Background vignette
    draw_vignette(new_pen())
    turtle.update()

    # 2. Rounded gold border
    draw_border(new_pen())
    time.sleep(0.4)

    # 3. SG monogram
    draw_monogram(new_pen(), 0, MONO_Y, radius=40)
    time.sleep(0.5)

    # 4. "Samuel" letter-by-letter
    pen = new_pen()
    pos_s = animate_text(pen, "Samuel", NAME_Y, font_family, TITLE_SIZE,
                         delay=LETTER_DELAY)
    time.sleep(0.2)

    # 5. "Goldfinch" letter-by-letter
    pos_g = animate_text(pen, "Goldfinch", LAST_Y, font_family, TITLE_SIZE,
                         delay=LETTER_DELAY)
    time.sleep(0.3)

    # 6. Corner sparkles
    draw_sparkles(new_pen(), count=SPARKLE_COUNT)

    # 7. Export
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    try:
        turtle.getcanvas().postscript(
            file=os.path.join(output_dir, "signature.eps"))
        print(f"Saved to {output_dir}/signature.eps")
    except Exception as e:
        print(f"Export note: {e}")

    print("Animation complete. Close the window to exit.")
    turtle.done()


if __name__ == "__main__":
    main()
