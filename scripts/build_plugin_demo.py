#!/usr/bin/env python3
"""Build a short, synthetic-data demo video for the OpenAI plugin review."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess


ROOT = Path(__file__).resolve().parents[1]
FRAMES = ROOT / "output" / "plugin-demo-frames"
OUT = ROOT / "app" / "public" / "juno-health-tools-demo.mp4"
FONT = "/System/Library/Fonts/Helvetica.ttc"

W, H = 1280, 720
BG = "#f4fbf9"
INK = "#12312d"
MUTED = "#526b67"
GREEN = "#0f766e"
MINT = "#ccfbf1"
WHITE = "#ffffff"


def font(size: int, bold: bool = False):
    return ImageFont.truetype(FONT, size=size, index=1 if bold else 0)


def wrap(draw, text, fnt, width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def block(draw, x, y, width, label, text, accent=False):
    label_font = font(20, True)
    body_font = font(25)
    lines = wrap(draw, text, body_font, width - 48)
    height = 78 + len(lines) * 36
    fill = MINT if accent else WHITE
    draw.rounded_rectangle((x, y, x + width, y + height), radius=24, fill=fill, outline="#b5d9d2", width=2)
    draw.text((x + 24, y + 18), label, font=label_font, fill=GREEN)
    yy = y + 54
    for line in lines:
        draw.text((x + 24, yy), line, font=body_font, fill=INK)
        yy += 36
    return y + height


def slide(index, eyebrow, title, prompt, response, note):
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((42, 32, 1238, 688), radius=32, fill=WHITE, outline="#d3e8e3", width=2)
    draw.rounded_rectangle((42, 32, 1238, 98), radius=32, fill=GREEN)
    draw.rectangle((42, 66, 1238, 98), fill=GREEN)
    draw.ellipse((72, 54, 94, 76), fill="#99f6e4")
    draw.text((108, 50), "Juno Health Tools", font=font(24, True), fill=WHITE)
    draw.text((1040, 51), f"Demo {index}/6", font=font(21), fill="#d7fffa")
    draw.text((82, 126), eyebrow.upper(), font=font(18, True), fill=GREEN)
    draw.text((82, 161), title, font=font(38, True), fill=INK)
    y = block(draw, 82, 225, 1116, "SYNTHETIC USER NOTE", prompt, accent=True)
    y = block(draw, 82, y + 20, 1116, "JUNO HEALTH TOOLS", response)
    draw.text((84, 644), note, font=font(18), fill=MUTED)
    image.save(FRAMES / f"slide-{index:02d}.png")


def main():
    FRAMES.mkdir(parents=True, exist_ok=True)
    slides = [
        (
            "Find symptom words",
            "Describe a hard-to-name sensation without guessing a cause",
            "After screen time I get a strange heavy feeling behind my eyes. Help me describe it neutrally.",
            "Possible descriptors: pressure, heaviness, fullness, aching, pulsing. Location: behind or around the eyes. Pattern to note: onset after screen time, duration, severity, and what changes it.",
            "Read-only tool • observation language only • no diagnosis",
        ),
        (
            "Build a health timeline",
            "Turn dated fragments into an appointment-ready sequence",
            "12 Jul: energy dropped after errands. 14 Jul: rested most of day. 18 Jul: energy closer to baseline.",
            "12 Jul — Energy worsened after errands. 14 Jul — Increased rest needed. 18 Jul — Partial return toward baseline. Unknowns are left explicit rather than inferred.",
            "Synthetic notes • chronology preserved • missing facts are not invented",
        ),
        (
            "Prepare appointment brief",
            "Compress messy notes into a one-page discussion aid",
            "Main concern: unpredictable fatigue. Goal: explain the last month clearly. Include questions I want to ask.",
            "Brief sections: main concern; change from baseline; timeline; patterns noticed; impact on daily life; current supports; questions for the clinician. The person stays in control of what is included.",
            "Designed for conversation preparation, not clinical decision-making",
        ),
        (
            "Reflect on a flare",
            "Structure what changed before, during, and after",
            "Before: busy weekend. During: more fatigue and light sensitivity. After: improved over three quiet days.",
            "Before — higher-than-usual activity. During — fatigue and light sensitivity increased. After — gradual improvement over three days. The tool labels this as a personal observation, not proof of causation.",
            "No causal claim • no treatment recommendation • user-supplied observations only",
        ),
        (
            "Render the brief",
            "Show the structured result as a clean in-chat card",
            "Create a concise appointment brief from the timeline and keep my unanswered questions visible.",
            "The MCP Apps widget renders a readable summary with priorities, timeline, impacts, and questions. It is suitable for reviewing in ChatGPT and copying into a private document.",
            "MCP Apps UI resource • responsive, accessible presentation",
        ),
        (
            "Safety and privacy",
            "Boundaries are built into every tool",
            "What does this plugin store, and can it tell me what condition I have?",
            "The public tools process submitted text transiently and intentionally store no patient data. They organise notes; they do not diagnose, prescribe, replace a clinician, or provide emergency care.",
            "Five read-only tools • public MCP endpoint • privacy and terms published",
        ),
    ]
    for i, data in enumerate(slides, 1):
        slide(i, *data)

    concat = FRAMES / "concat.txt"
    with concat.open("w") as handle:
        for i in range(1, 7):
            handle.write(f"file 'slide-{i:02d}.png'\n")
            handle.write("duration 5\n")
        handle.write("file 'slide-06.png'\n")

    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat),
            "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "22",
            "-movflags", "+faststart", str(OUT),
        ],
        check=True,
    )
    print(OUT)


if __name__ == "__main__":
    main()
