# 📄 Kako Konvertovati DOKUMENTACIJA.md u PDF

Imaš nekoliko opcija za konverziju Markdown dokumenta u PDF:

---

## Opcija 1: Visual Studio Code (Najlakše) ⭐ PREPORUČENO

### Instalacija Extension-a
1. Otvori VS Code
2. Idi u Extensions (Ctrl+Shift+X)
3. Pretraži: "Markdown PDF"
4. Instaliraj: **Markdown PDF** by yzane

### Konverzija
1. Otvori `DOKUMENTACIJA.md` u VS Code
2. Pritisni `Ctrl+Shift+P` (Command Palette)
3. Ukucaj: `Markdown PDF: Export (pdf)`
4. Pritisni Enter

✅ PDF će biti kreiran u istom folderu sa imenom `DOKUMENTACIJA.pdf`

---

## Opcija 2: Pandoc (Terminal) - Najbolji kvalitet

### Instalacija Pandoc

**Windows:**
```bash
# Preuzmi sa: https://pandoc.org/installing.html
# Ili koristi Chocolatey:
choco install pandoc
```

**macOS:**
```bash
brew install pandoc
brew install basictex  # Za LaTeX engine
```

**Linux:**
```bash
sudo apt-get install pandoc
sudo apt-get install texlive-xetex
```

### Konverzija
```bash
# Osnovna konverzija
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf

# Sa Table of Contents
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf --toc --toc-depth=3

# Sa lepim formatiranjem
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt
```

---

## Opcija 3: Online Alati (Bez instalacije)

### Preporučeni Online Konvertori:

1. **Markdown to PDF** - https://www.markdowntopdf.com/
   - Upload `DOKUMENTACIJA.md`
   - Klikni "Convert"
   - Download PDF

2. **Dillinger** - https://dillinger.io/
   - Open `DOKUMENTACIJA.md`
   - Export → PDF

3. **CloudConvert** - https://cloudconvert.com/md-to-pdf
   - Upload fajl
   - Convert
   - Download

---

## Opcija 4: GitHub (Ako imaš repo)

1. Pushuj `DOKUMENTACIJA.md` na GitHub
2. Otvori fajl na GitHub-u
3. Koristi browser extension: "Print to PDF"
4. Ili koristi: https://gitprint.com/

---

## Opcija 5: Chrome/Edge Browser

1. Otvori `DOKUMENTACIJA.md` u VS Code
2. Pritisni `Ctrl+Shift+V` (Markdown Preview)
3. Desni klik → "Open in Browser" (ili koristi extension)
4. U browseru: `Ctrl+P` (Print)
5. Destination: "Save as PDF"
6. Podesi opcije:
   - Layout: Portrait
   - Margins: Default
   - Background graphics: ON
7. Klikni "Save"

---

## Najbolje Podešavanje za Profesionalni PDF

### Pandoc sa Custom Template:

```bash
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V documentclass=report \
  -V geometry:margin=2.5cm \
  -V fontsize=11pt \
  -V linestretch=1.2 \
  -V mainfont="Arial" \
  -V monofont="Courier New" \
  --highlight-style=tango
```

Ovo daje:
- ✅ Table of Contents
- ✅ Numerisane sekcije
- ✅ Lepe margine
- ✅ Čitljiv font
- ✅ Syntax highlighting za kod

---

## Troubleshooting

### Problem: "pandoc: pdflatex not found"
**Rešenje:** Instaliraj LaTeX engine:
```bash
# Windows
choco install miktex

# macOS
brew install basictex

# Linux
sudo apt-get install texlive-xetex texlive-fonts-recommended
```

### Problem: "Command 'pandoc' not found"
**Rešenje:** Dodaj pandoc u PATH ili reinstaliraj

### Problem: Emojis ne prikazuju se
**Rešenje:** Koristi `--pdf-engine=xelatex` umesto default engine-a

---

## Preporučeni Workflow

Za **najkvalitetniji** PDF, koristi ovaj workflow:

1. **Instaliraj Pandoc** (one-time setup)
   ```bash
   # Windows
   choco install pandoc miktex
   
   # macOS
   brew install pandoc basictex
   
   # Linux
   sudo apt-get install pandoc texlive-xetex
   ```

2. **Konvertuj sa optimalnim podešavanjima**
   ```bash
   cd C:\Users\drazen\Desktop\master-rad
   
   pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf \
     --pdf-engine=xelatex \
     --toc \
     --toc-depth=3 \
     --number-sections \
     -V geometry:margin=2.5cm \
     -V fontsize=11pt \
     -V linestretch=1.2 \
     --highlight-style=tango
   ```

3. **Otvori i proveri PDF**
   ```bash
   start DOKUMENTACIJA.pdf  # Windows
   open DOKUMENTACIJA.pdf   # macOS
   xdg-open DOKUMENTACIJA.pdf  # Linux
   ```

---

## Alternativa: Word pa PDF

Ako preferiš:
1. Konvertuj MD → DOCX:
   ```bash
   pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.docx
   ```
2. Otvori u Microsoft Word
3. Uredi formatiranje po želji
4. Save as PDF

---

## Za Brze Rezultate ⚡

Ako ti je hitno:

**Najbrže:** VS Code + Markdown PDF extension (2 minuta)  
**Najkvalitetnije:** Pandoc sa custom options (5 minuta)  
**Bez instalacije:** Online converter (3 minuta)

---

## Šta Nakon Konverzije?

1. ✅ Proveri da li su sve sekcije prisutne
2. ✅ Proveri da li su slike/dijagrami vidljivi (ako ih ima)
3. ✅ Proveri da li je kod čitljiv
4. ✅ Proveri Table of Contents (linkovi)
5. ✅ Proveri ukupan broj stranica (~150-200 stranica očekivano)

---

## Bonus: Automatizacija

Kreiraj `generate-pdf.bat` (Windows):
```batch
@echo off
echo Generating PDF from DOKUMENTACIJA.md...
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf --pdf-engine=xelatex --toc --toc-depth=3 --number-sections -V geometry:margin=2.5cm -V fontsize=11pt
echo Done! PDF created: DOKUMENTACIJA.pdf
pause
```

Ili `generate-pdf.sh` (macOS/Linux):
```bash
#!/bin/bash
echo "Generating PDF from DOKUMENTACIJA.md..."
pandoc DOKUMENTACIJA.md -o DOKUMENTACIJA.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V geometry:margin=2.5cm \
  -V fontsize=11pt
echo "Done! PDF created: DOKUMENTACIJA.pdf"
```

Zatim samo pokreni:
```bash
# Windows
generate-pdf.bat

# macOS/Linux
chmod +x generate-pdf.sh
./generate-pdf.sh
```

---

**Srećno sa konverzijom! 📄➡️📕**








