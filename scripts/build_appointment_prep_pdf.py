#!/usr/bin/env python3
"""Build the printable and Canva-importable Juno Appointment Prep Pack."""

from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "juno-appointment-prep-pack.pdf"

W, H = A4
INK = HexColor("#14201D")
MUTED = HexColor("#60706A")
GREEN = HexColor("#16705A")
MINT = HexColor("#DFF6ED")
PALE = HexColor("#F4F7F5")
WARM = HexColor("#FFF3E3")
ORANGE = HexColor("#E6A260")
LINE = HexColor("#D7E4DE")


def wrap(text, font, size, width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if not current or stringWidth(trial, font, size) <= width:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


class Pack:
    def __init__(self, path):
        self.c = canvas.Canvas(str(path), pagesize=A4)
        self.page = 0

    def logo(self, x=42, y=H - 54):
        self.c.setFillColor(GREEN)
        self.c.roundRect(x, y - 14, 28, 28, 9, fill=1, stroke=0)
        self.c.setFillColor(white)
        self.c.setFont("Helvetica-Bold", 17)
        self.c.drawCentredString(x + 14, y - 5, "J")
        self.c.setFillColor(INK)
        self.c.setFont("Helvetica-Bold", 12)
        self.c.drawString(x + 38, y - 5, "JUNO APPOINTMENT PREP")

    def footer(self):
        self.c.setStrokeColor(LINE)
        self.c.line(42, 34, W - 42, 34)
        self.c.setFillColor(MUTED)
        self.c.setFont("Helvetica", 7.5)
        self.c.drawString(42, 21, "Organises information only — not medical advice, diagnosis, treatment, or emergency care.")
        self.c.drawRightString(W - 42, 21, f"junocompanion.com  •  {self.page}")

    def new_page(self, title, subtitle=None, accent=MINT):
        if self.page:
            self.footer()
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(PALE)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.logo()
        self.c.setFillColor(accent)
        self.c.roundRect(42, H - 145, W - 84, 60, 16, fill=1, stroke=0)
        self.c.setFillColor(INK)
        self.c.setFont("Helvetica-Bold", 23)
        self.c.drawString(58, H - 112, title)
        if subtitle:
            self.c.setFillColor(MUTED)
            self.c.setFont("Helvetica", 9.5)
            self.c.drawString(58, H - 131, subtitle)

    def text(self, x, y, text, size=9.5, color=INK, width=470, leading=13, font="Helvetica"):
        self.c.setFillColor(color)
        self.c.setFont(font, size)
        for line in wrap(text, font, size, width):
            self.c.drawString(x, y, line)
            y -= leading
        return y

    def label(self, x, y, text):
        self.c.setFillColor(GREEN)
        self.c.setFont("Helvetica-Bold", 8)
        self.c.drawString(x, y, text.upper())

    def lines(self, x, y, width, count=3, gap=20):
        self.c.setStrokeColor(LINE)
        for i in range(count):
            yy = y - i * gap
            self.c.line(x, yy, x + width, yy)
        return y - count * gap

    def checkbox_list(self, x, y, items, width=220, gap=27):
        for item in items:
            self.c.setStrokeColor(GREEN)
            self.c.roundRect(x, y - 8, 11, 11, 2, fill=0, stroke=1)
            self.text(x + 19, y, item, size=8.6, width=width - 20, leading=11)
            y -= gap
        return y

    def panel(self, x, y, width, height, title, tint=white):
        self.c.setFillColor(tint)
        self.c.setStrokeColor(LINE)
        self.c.roundRect(x, y - height, width, height, 14, fill=1, stroke=1)
        self.label(x + 14, y - 20, title)
        return x + 14, y - 38, width - 28, height - 50

    def finish(self):
        self.footer()
        self.c.save()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    p = Pack(OUTPUT)

    p.new_page("A clearer appointment starts here", "A free, reusable pack for turning scattered notes into a focused conversation.")
    p.c.setFillColor(white)
    p.c.setStrokeColor(LINE)
    p.c.roundRect(42, 90, W - 84, H - 265, 22, fill=1, stroke=1)
    p.c.setFillColor(INK)
    p.c.setFont("Helvetica-Bold", 33)
    p.c.drawString(68, H - 225, "Juno Appointment")
    p.c.drawString(68, H - 265, "Prep Pack")
    p.text(68, H - 308, "Use one page at a time. Write only what helps you remember and communicate. You do not need to complete every box.", size=13, width=410, leading=18, color=MUTED)
    p.c.setFillColor(MINT)
    p.c.roundRect(68, H - 455, 205, 92, 16, fill=1, stroke=0)
    p.c.setFillColor(WARM)
    p.c.roundRect(292, H - 455, 205, 92, 16, fill=1, stroke=0)
    p.text(84, H - 390, "Before", size=10, font="Helvetica-Bold", color=GREEN)
    p.text(84, H - 410, "Choose the goal, changes, impact, and questions that matter most.", width=170, size=9, color=INK)
    p.text(308, H - 390, "After", size=10, font="Helvetica-Bold", color=GREEN)
    p.text(308, H - 410, "Write down decisions, owners, dates, and what to do if things change.", width=170, size=9, color=INK)
    p.text(68, 136, "Free to print, copy, adapt, and import into Canva under the MIT licence.", size=9, color=MUTED)
    p.text(68, 116, "Open source: github.com/MarshallBear1/juno-open-health-tools", size=9, color=GREEN)

    p.new_page("1. Set the appointment focus", "A short, prioritised brief is easier to use than a complete life history.")
    x, y, width, _ = p.panel(42, H - 170, W - 84, 145, "The one outcome that would make this appointment useful", MINT)
    p.lines(x, y - 8, width, 4, 22)
    x1, y1, w1, _ = p.panel(42, H - 335, 247, 210, "Three changes to mention")
    for n in range(1, 4):
        p.c.setFillColor(GREEN); p.c.circle(x1 + 6, y1 - 3, 9, fill=1, stroke=0)
        p.c.setFillColor(white); p.c.setFont("Helvetica-Bold", 8); p.c.drawCentredString(x1 + 6, y1 - 6, str(n))
        p.lines(x1 + 22, y1, w1 - 22, 2, 18); y1 -= 52
    x2, y2, w2, _ = p.panel(306, H - 335, 247, 210, "What changed in daily life", WARM)
    p.text(x2, y2, "Use concrete examples: what takes longer, happens less often, needs help, or is no longer possible?", width=w2, size=8.5, color=MUTED)
    p.lines(x2, y2 - 48, w2, 6, 21)
    x3, y3, w3, _ = p.panel(42, H - 565, W - 84, 155, "What I want the clinician to understand")
    p.lines(x3, y3, w3, 5, 21)

    p.new_page("2. Find words that fit", "Descriptors are communication prompts, not clues to a diagnosis.", WARM)
    categories = [
        ("Sensation", ["aching", "burning / hot", "cramping", "electric", "heavy", "numb", "pressure-like", "sharp", "tight", "tingling", "throbbing"]),
        ("Timing", ["constant", "intermittent", "sudden", "gradual", "episodic", "delayed after activity", "builds through the day"]),
        ("Pattern", ["localised", "spreading", "moving", "one-sided", "symmetrical", "changed by position", "unpredictable"]),
        ("Impact", ["interrupts sleep", "limits concentration", "slows walking", "requires a rest", "prevents usual tasks", "needs help"]),
    ]
    positions = [(42, H - 170), (306, H - 170), (42, H - 435), (306, H - 435)]
    for (title, items), (x, y) in zip(categories, positions):
        px, py, pw, _ = p.panel(x, y, 247, 245, title, white if title in ("Sensation", "Pattern") else MINT)
        p.checkbox_list(px, py, items, width=pw, gap=19)
    p.label(42, 116, "One sentence I could use")
    p.text(42, 96, "“It feels __________ around __________. It is __________ and affects __________.”", width=W - 84, size=10, color=INK)
    p.lines(42, 72, W - 84, 1, 18)

    p.new_page("3. Build the short timeline", "Dates can be exact, approximate, or marked as uncertain.")
    p.label(42, H - 175, "Date / time range")
    p.label(160, H - 175, "What I observed or was told")
    p.label(405, H - 175, "Impact / uncertainty")
    top = H - 190
    for row in range(8):
        tint = white if row % 2 == 0 else PALE
        p.c.setFillColor(tint); p.c.setStrokeColor(LINE)
        p.c.rect(42, top - 65, W - 84, 65, fill=1, stroke=1)
        p.c.line(145, top - 65, 145, top)
        p.c.line(392, top - 65, 392, top)
        top -= 65
    px, py, pw, _ = p.panel(42, 94, W - 84, 40, "What changed overall", MINT)
    p.lines(px, py, pw, 1, 18)

    p.new_page("4. Medicines, tests, and details", "Copy important names and doses from authoritative labels or records.", WARM)
    px, py, pw, _ = p.panel(42, H - 170, W - 84, 230, "Current medicines and supplements")
    p.label(px, py, "Name")
    p.label(px + 190, py, "Dose / timing as recorded")
    p.label(px + 350, py, "Change or question")
    top = py - 14
    for _ in range(6):
        p.c.setStrokeColor(LINE); p.c.line(px, top - 28, px + pw, top - 28)
        p.c.line(px + 175, top - 28, px + 175, top)
        p.c.line(px + 335, top - 28, px + 335, top)
        top -= 28
    x1, y1, w1, _ = p.panel(42, H - 420, 247, 225, "Reports or results to bring", MINT)
    p.checkbox_list(x1, y1, ["Medication list", "Recent test reports", "Relevant letters", "Symptom timeline", "Photos or device notes", "Other:"], width=w1, gap=28)
    x2, y2, w2, _ = p.panel(306, H - 420, 247, 225, "Details I need to verify")
    p.text(x2, y2, "Keep guesses out of the final brief. Put uncertain names, dates, doses, or results here to check.", width=w2, size=8.5, color=MUTED)
    p.lines(x2, y2 - 48, w2, 6, 23)

    p.new_page("5. Prioritise the questions", "Put the question you most want answered first.")
    prompts = [
        "What are the most useful next steps to clarify or manage this concern?",
        "What are we prioritising today, and what may need another appointment?",
        "What should I monitor or write down before follow-up?",
        "What changes should prompt me to contact the care team, and how?",
        "Who owns the next step, and when should I expect it?",
    ]
    px, py, pw, _ = p.panel(42, H - 170, W - 84, 195, "Optional neutral prompts", MINT)
    p.checkbox_list(px, py, prompts, width=pw, gap=29)
    y = H - 395
    for n in range(1, 6):
        p.c.setFillColor(GREEN); p.c.circle(53, y + 3, 11, fill=1, stroke=0)
        p.c.setFillColor(white); p.c.setFont("Helvetica-Bold", 9); p.c.drawCentredString(53, y, str(n))
        p.lines(75, y + 4, W - 117, 2, 20)
        y -= 68

    p.new_page("6. Reflect on a flare", "Record observations in sequence; possible patterns are questions, not proven causes.", WARM)
    titles = [("Before", "Baseline, sleep, activity, stressors, routine or exposure changes"), ("During", "Onset, symptoms, intensity, duration, and what became harder"), ("After", "Recovery time, residual effects, and return toward baseline")]
    y = H - 170
    for index, (title, hint) in enumerate(titles):
        px, py, pw, _ = p.panel(42, y, W - 84, 155, title, MINT if index != 1 else white)
        p.text(px, py, hint, width=pw, size=8.3, color=MUTED)
        p.lines(px, py - 30, pw, 4, 21)
        y -= 174
    px, py, pw, _ = p.panel(42, 145, W - 84, 80, "A pattern I might track next time — without assuming cause", WARM)
    p.lines(px, py, pw, 2, 20)

    p.new_page("7. Leave with the next step", "Write it in your own words, then check anything unclear with the care team.")
    left_x, left_y, left_w, _ = p.panel(42, H - 170, 247, 420, "What was agreed", MINT)
    p.label(left_x, left_y, "Next action")
    p.lines(left_x, left_y - 16, left_w, 4, 22)
    p.label(left_x, left_y - 120, "Who owns it")
    p.lines(left_x, left_y - 136, left_w, 2, 22)
    p.label(left_x, left_y - 202, "When")
    p.lines(left_x, left_y - 218, left_w, 2, 22)
    p.label(left_x, left_y - 284, "How I will follow up")
    p.lines(left_x, left_y - 300, left_w, 3, 22)
    right_x, right_y, right_w, _ = p.panel(306, H - 170, 247, 420, "Before I finish")
    p.checkbox_list(right_x, right_y, ["I asked my top question", "I understand the next step", "I know who is responsible", "I noted the date or timeframe", "I know how to ask for clarification", "I know how to seek help if things change"], width=right_w, gap=42)
    px, py, pw, _ = p.panel(42, 230, W - 84, 130, "One-sentence after-visit summary", WARM)
    p.lines(px, py, pw, 4, 22)
    p.text(42, 78, "Make another free copy: github.com/MarshallBear1/juno-open-health-tools", size=8.5, color=GREEN)

    p.finish()
    print(OUTPUT)


if __name__ == "__main__":
    build()
