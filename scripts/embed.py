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
        opening_content = ""
        is_opening = True

        for part, title in zip(parts[2:], matches[1:]):
            # check if title is in the format "**(something)**"
            if not re.match(r'\*\*\(.*?\)\*\*', title):
                assert is_opening, f"Unexpected title format in {id}: {title}"
                opening_content += " " + title.strip("*")
            else:
                if is_opening:
                    is_opening = False
                    if opening_content.strip():
                        documents.append(Document(text=opening_content.strip(), name=f"Đường Hy Vọng, chủ đề {theme}, mở đầu"))
                num = title[3:-3].strip()
                documents.append(Document(text=part.strip(), name=f"Đường Hy Vọng, số {num}, chủ đề {theme}"))
        
    with open("markdown/road-of-hope-b.md", "r", encoding="utf-8") as file:
        text = file.read()
    
    parts = re.split(r'\n-{60,}\n', text)
    assert len(parts) == 2, f"Unexpected number of parts in road-of-hope-b: got {len(parts)}"
    main_text = parts[1].strip("-").strip()
    match = re.search(r'\*\*(.*?)\*\*', main_text)
    assert match, "No theme found in road-of-hope-b"
    theme = match.group(1).strip("*()")
    print(theme)
    main_text = main_text[match.end():].strip()
    documents.append(Document(text=main_text, name=f"Đường Hy Vọng, chủ đề {theme}"))
    
    return documents

def get_5_loave_and_2_fish_docs() -> list[Document]:
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
        paragraphs = main_text.split("\n\n")
        for i, paragraph in enumerate(paragraphs):
            if paragraph.strip():
                documents.append(Document(text=paragraph.strip(), name=f"5 Chiếc Bánh và 2 Con Cá, {theme}, đoạn {i + 1}"))
    return documents

def get_testimony_of_hope_docs() -> list[Document]:
    with open("markdown/testimony-of-hope.md", "r", encoding="utf-8") as file:
        text = file.read()
    
    regex = r'\[.?\]\{#bookmark\d*?\}(.*?\n?.*?)\[.?\]\{#bookmark\d*?\}'
    parts: list[str] = re.split(regex, text)
    assert len(parts) % 2 == 1, f"Unexpected number of parts in testimony-of-hope: got {len(parts)} parts"

    documents: list[Document] = []
    opening = parts[0]
    for i, paragraph in enumerate(opening.split("\n\n")):
        if paragraph.strip():
            documents.append(Document(text=paragraph.strip(), name=f"Chứng Nhân Hy Vọng, lời mở đầu, đoạn {i + 1}"))
    
    for i in range(2, len(parts), 2):
        theme = parts[i - 1].strip()
        assert len(theme) < 100, f"Theme too long in testimony-of-hope: {theme[:100]}"
        print(theme)
        for j, paragraph in enumerate(parts[i].split("\n\n")):
            if paragraph.strip():
                documents.append(Document(text=paragraph.strip(), name=f"Chứng Nhân Hy Vọng, chủ đề {theme}, đoạn {j + 1}"))
    return documents

def main():
    database = Db()
    database.add_documents(get_road_of_hope_docs())
    database.add_documents(get_5_loave_and_2_fish_docs())
    # database.add_documents(get_testimony_of_hope_docs())
    print("Documents added to the database successfully.")


if __name__ == "__main__":
    main()
