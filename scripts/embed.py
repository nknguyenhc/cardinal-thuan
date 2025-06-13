import re

from db import Document, Db

def get_road_of_hope_docs() -> list[Document]:
    ids = [f"{i:02d}" for i in range(1, 39)]
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
        parts: list[str] = re.split(delim, main_text)
        matches: list[str] = re.findall(delim, main_text)
        assert len(parts) == len(matches) + 1, f"Unexpected number of parts in {id}"
        assert parts[0].strip() == "", f"Unexpected first part in {id}: {parts[0]}"

        theme = matches[0].strip("*")
        print(theme)

        for part, title in zip(parts[2:], matches[1:]):
            # check if title is in the format "**(something)**"
            if re.match(r'\*\*\(.*?\)\*\*', title):
                num = title[3:-3].strip()
                documents.append(Document(text=part.strip(), name=f"Đường Hy Vọng, số {num}, chủ đề {theme}"))
            else:
                content = title.strip("*")
                documents.append(Document(text=content, name=f"Đường Hy Vọng, chủ đề {theme}"))
    
    return documents
