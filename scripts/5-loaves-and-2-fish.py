# Downdload the PDF from here:
# https://suyniemhangngay.net/wp-content/uploads/2016/08/N%C4%82M-CHI%E1%BA%BEC-B%C3%81NH-V%C3%80-HAI-CON-C%C3%81-%C4%90HY-Nguy%E1%BB%85n-V%C4%83n-Thu%E1%BA%ADn.pdf
# Save it to `pdf/5-loaves-and-2-fish.pdf`

# Download "testimony of hope" from:
# https://data.xdttns.com/wl/?id=b3v0VblQOFNTLPxUU31j0CVWCibQS4wD
# Save it to `pdf/testimony-of-hope.pdf`

import subprocess

import pdfplumber
from markdownify import markdownify as md

def pdf_to_markdown(pdf_path: str = "pdf/5-loaves-and-2-fish.pdf",
                    output_md_path: str = "markdown/5-loaves-and-2-fish.md"):
    markdown_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            if text:
                markdown_text += f"\n\n## Page {page_num}\n\n"
                markdown_text += md(text)
    
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(markdown_text)
    print(f"Markdown saved to: {output_md_path}")


if __name__ == "__main__":
    pdf_to_markdown("pdf/testimony-of-hope.pdf",
                    "markdown/testimony-of-hope.md")
