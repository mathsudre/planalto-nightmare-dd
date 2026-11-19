import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

PDF = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\Users\Matheus\Downloads\DnD 5.5 - Livro do Jogador (2024) - Erratas Agosto.pdf")
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("src/lib/rules/book-spells.json")

reader = PdfReader(str(PDF))
records = []
header = re.compile(r"(?m)^([^\n]{2,80})\n((?:Truque|[1-9]º Círculo), [^\n]+)$")

for page_number, page in enumerate(reader.pages, 1):
    text = (page.extract_text() or "").replace("\r", "")
    if "CAPÍTULO 7 | MAGIAS" not in text or "Descrições da Magias" not in text and page_number < 245:
        continue
    matches = list(header.finditer(text))
    for index, match in enumerate(matches):
        name = " ".join(match.group(1).split())
        meta = " ".join(match.group(2).split())
        if name.startswith("CAPÍTULO") or name in {"Usando um Espaço de Magia de Círculo Superior", "Aprimoramento de Truque"}:
            continue
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[match.end():end]
        def field(label):
            found = re.search(rf"{label}:\s*([^\n]+)", block)
            return " ".join(found.group(1).split()) if found else ""
        description = block
        duration_line = re.search(r"Duração:\s*[^\n]+\n", description)
        if duration_line:
            description = description[duration_line.end():]
        description = re.split(r"\n(?:Usando um Espaço de Magia|Aprimoramento de Truque|Fonte do Luar|Notas)", description)[0]
        paragraphs = []
        for paragraph in re.split(r"\n\s*\n", description):
            paragraph = " ".join(line.strip() for line in paragraph.splitlines()).strip()
            if paragraph:
                paragraphs.append(paragraph)
        description = "\n\n".join(paragraphs)
        level_match = re.match(r"(Truque|[1-9]º Círculo),\s*([^()]+)\s*(?:\(([^)]+)\))?", meta)
        if not level_match:
            continue
        level = 0 if level_match.group(1) == "Truque" else int(level_match.group(1)[0])
        record = {
            "id": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"),
            "name": name,
            "level": level,
            "school": level_match.group(2).strip(),
            "classes": [value.strip() for value in (level_match.group(3) or "").split(",") if value.strip()],
            "castingTime": field("Tempo de Conjuração"),
            "range": field("Alcance"),
            "components": field("Componentes"),
            "duration": field("Duração"),
            "concentration": "Concentração" in field("Duração"),
            "ritual": "Ritual" in meta or "Ritual" in field("Tempo de Conjuração"),
            "summary": description,
            "reference": f"Livro do Jogador 2024, capítulo 7, p. {page_number - 6}",
        }
        if len(record["summary"]) > 20:
            records.append(record)

unique = {record["id"]: record for record in records}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(list(unique.values()), ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Imported {len(unique)} spells to {OUT}")
