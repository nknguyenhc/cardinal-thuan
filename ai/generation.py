from google import genai
from google.genai import types
import dotenv
import os
import re
import logging
import json

from .documents import Document, get_road_of_hope_docs, get_5_loaves_and_2_fish_docs

dotenv.load_dotenv()

class Generation:
    def __init__(self):
        self.logger = logging.getLogger("Generation")
        with open("prompts/pull.txt", "r", encoding="utf-8") as file:
            self._pull_prompt = file.read().strip()
        with open("prompts/system.txt", "r", encoding="utf-8") as file:
            self._system_prompt = file.read().strip()
        with open("prompts/summary.txt", "r", encoding="utf-8") as file:
            self._summary_prompt = file.read().strip()
        self._road_of_hope_docs = get_road_of_hope_docs()
        self._5_loaves_and_2_fish_docs = get_5_loaves_and_2_fish_docs()
    
    def _pull(self, query: str) -> list[Document]:
        docs = self._pull_road_of_hope(query)
        docs.extend(self._pull_5_loaves_and_2_fish(query))
        return docs
    
    def _get_docs_response(self,
                           query: str,
                           book_name: str,
                           docs: list[Document],
                           ) -> list[Document]:
        client = self._get_client()
        chapters = "\n".join([json.dumps({"id": i, "name": doc.name}) for i, doc in enumerate(docs)])
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=self._pull_prompt.format(
                    book_name=book_name,
                    chapters=chapters,
                ),
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                temperature=0.2),
            contents=query,
        )
        self.logger.debug(f"Response from Gemini: {response.text.strip()}")
        return self._extract_docs(response.text.strip(), docs)

    def _pull_road_of_hope(self, query: str) -> list[Document]:
        return self._get_docs_response(
            query=query,
            book_name="Road of Hope",
            docs=self._road_of_hope_docs,
        )

    def _pull_5_loaves_and_2_fish(self, query: str) -> list[Document]:
        return self._get_docs_response(
            query=query,
            book_name="5 Loaves and 2 Fish",
            docs=self._5_loaves_and_2_fish_docs,
        )
    
    def _extract_docs(self, response: str, docs: list[Document]) -> list[Document]:
        regex = r'```json([\s\S]*?)```'
        matches = re.findall(regex, response)
        if not matches:
            self.logger.warning("No JSON found in response")
            return []
        try:
            docs_data = json.loads(matches[0].strip())
            docs = [docs[int(doc['id'])] for doc in docs_data]
            return docs
        except Exception as e:
            self.logger.error(f"Error extracting documents: {e}")
            return []

    async def query(self, query: str):
        results = self._pull(query)
        self.logger.info(f"Found {len(results)} documents for query: {query}")
        self.logger.debug(f"Documents: {results}")
        passages = self._format_docs(results)
        client = self._get_client()
        response = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=self._system_prompt.format(passages=passages),
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                temperature=0.2),
            contents=query,
        )
        for chunk in response:
            yield chunk.text
    
    def _format_docs(self, docs: list[Document]) -> str:
        return "\n\n".join(f"# {doc.book}, {doc.name}\n{doc.text}" for doc in docs)
    
    def _get_client(self):
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("Gemini API Key not provided. Please provide GEMINI_API_KEY as an environment variable")
        return genai.Client(api_key=gemini_api_key)
    
    def get_title(self, query: str) -> str:
        client = self._get_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=self._summary_prompt,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                temperature=0.7),
            contents=query,
        )
        return response.text.strip()
