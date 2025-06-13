import subprocess
import requests

BASE_URL = "https://vntaiwan.catholic.org.tw/hyvong2/hyvong{index}.htm"

# indices = ["{:02d}".format(i) for i in range(1, 39)]
# indices.insert(0, "b")
indices = ["b"]

def process_page(index: str):
    url = BASE_URL.format(index=index)
    response = requests.get(url)
    
    if response.status_code == 200:
        content = response.text
        with open(f"html/road-of-hope-{index}.html", "w", encoding="utf-8") as file:
            file.write(content)
    else:
        print(f"Failed to retrieve page {index}: {response.status_code}")
        exit(1)
    
    command = f"pandoc html/road-of-hope-{index}.html -o markdown/road-of-hope-{index}.md"
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error converting HTML to Markdown for {index}: {e}")
        exit(1)

def main():
    for index in indices:
        print(f"Processing page {index}...")
        process_page(index)
    print("All pages processed successfully.")


if __name__ == "__main__":
    main()
