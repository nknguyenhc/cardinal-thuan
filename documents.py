from pydantic import BaseModel
import re

class Document(BaseModel):
    text: str
    name: str

def get_road_of_hope_docs() -> list[Document]:
    ids = [f"{i:02d}" for i in range(1, 39)]
    ids.append("b")
    documents: list[Document] = []
    for id in ids:
        with open(f"markdown/road-of-hope-{id}.md", "r", encoding="utf-8") as file:
            text = file.read()
        
        # Split by "------"
        parts = re.split(r'\n-{60,}\n', text)
        assert len(parts) == 2, f"Unexpected number of parts in {id}: got {len(parts)}"
        main_text = parts[1].strip("-").strip()

        # Split by "**(something)**" and capture the delimiter
        delim = r'\*\*.*?\*\*'
        parts: list[str] = re.split(delim, main_text, 1)
        matches: list[str] = re.findall(delim, main_text)
        assert parts[0].strip() == "", f"Unexpected first part in {id}: {parts[0]}"

        theme = matches[0].strip("*")
        print(theme)
        body = parts[1].strip()
        documents.append(Document(name=theme, text=body))
    
    return documents

def get_5_loaves_and_2_fish_docs() -> list[Document]:
    with open("markdown/5-loaves-and-2-fish.md", "r", encoding="utf-8") as file:
        text = file.read()
    parts = re.split(r'\n={60,}\n', text)
    assert len(parts) == 8, f"Unexpected number of parts in 5-loaves-and-2-fish: got {len(parts)}"

    documents: list[Document] = []
    for part in parts:
        part = part.strip("=").strip()
        match = re.search(r'\*\*(.*?)\*\*', part)
        assert match, "No theme found in 5-loaves-and-2-fish"
        theme = match.group(1).strip("*()")
        print(theme)
        main_text = part[match.end():].strip()
        documents.append(Document(text=main_text, name=theme))
    
    return documents

def get_testimony_of_hope_docs() -> list[Document]:
    with open("markdown/testimony-of-hope.md", "r", encoding="utf-8") as file:
        text = file.read()
    
    regex = r'\[.?\]\{#bookmark\d*?\}(.*?\n?.*?)\[.?\]\{#bookmark\d*?\}'
    parts: list[str] = re.split(regex, text)
    assert len(parts) % 2 == 1, f"Unexpected number of parts in testimony-of-hope: got {len(parts)}"

    documents: list[Document] = []
    opening = parts[0].strip()
    documents.append(Document(text=opening, name="Lời mở đầu"))
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        assert len(title) < 100, f"Title too long in testimony-of-hope: {title}"
        print(title)
        content = parts[i + 1].strip()
        if not content:
            continue
        documents.append(Document(text=content, name=title))
    return documents
