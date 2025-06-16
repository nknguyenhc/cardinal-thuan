from google import genai
from google.genai import types
import dotenv
import os

from db import Db, Document

dotenv.load_dotenv()

class Generation:
    def __init__(self):
        self.db = Db()
        with open("prompts/system.txt", "r", encoding="utf-8") as file:
            self.system_prompt = file.read().strip()

    def query(self, query: str) -> tuple[str, list[Document]]:
        results = self.db.query(query)
        passages = self._format_docs(results)
        client = self._get_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=self.system_prompt.format(passages=passages),
                temperature=0.2),
            contents=query,
        )
        return response.text.strip(), results
    
    def _format_docs(self, docs: list[Document]) -> str:
        return "\n\n".join(f"**{doc.name.strip()}**\n{doc.text.strip()}" for doc in docs)
    
    def _get_client(self):
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("Gemini API Key not provided. Please provide GEMINI_API_KEY as an environment variable")
        return genai.Client(api_key=gemini_api_key)
