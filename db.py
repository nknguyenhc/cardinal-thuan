import google.generativeai as genai
import chromadb
import os
import dotenv
from pydantic import BaseModel

dotenv.load_dotenv()

class GeminiEmbeddingFunction(chromadb.EmbeddingFunction):
    """
    Custom embedding function using the Gemini AI API for document retrieval.

    This class extends the EmbeddingFunction class and implements the __call__ method
    to generate embeddings for a given set of documents using the Gemini AI API.

    Parameters:
    - input (Documents): A collection of documents to be embedded.

    Returns:
    - Embeddings: Embeddings generated for the input documents.
    """
    def __call__(self, input: chromadb.Documents) -> chromadb.Embeddings:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("Gemini API Key not provided. Please provide GEMINI_API_KEY as an environment variable")
        genai.configure(api_key=gemini_api_key)
        return genai.embed_content(model="models/embedding-001",
                                   content=input,
                                   task_type="retrieval_document")["embedding"]

class Document(BaseModel):
    text: str
    name: str

class Db:
    def __init__(self, path: str = "chroma"):
        chroma_client = chromadb.PersistentClient(path=path)
        self.road_of_hope = chroma_client.get_or_create_collection(name='road_of_hope',
                                                                   embedding_function=GeminiEmbeddingFunction())
        self.five_loaves_and_two_fish = chroma_client.get_or_create_collection(name='five_loaves_and_two_fish',
                                                                               embedding_function=GeminiEmbeddingFunction())
    
    def query(self,
              query: str,
              n_road_of_hope: int = 100,
              n_five_loaves_and_two_fish: int = 30) -> list[Document]:
        results = self.road_of_hope.query(query_texts=[query], n_results=n_road_of_hope)
        ids = results['ids'][0]
        texts = results['documents'][0]
        results = self.five_loaves_and_two_fish.query(query_texts=[query], n_results=n_five_loaves_and_two_fish)
        ids += results['ids'][0]
        texts += results['documents'][0]
        return [Document(name=name, text=text) for name, text in zip(ids, texts)]
    
    def add_documents(self, documents: list[Document], collection: str):
        match collection:
            case 'road_of_hope':
                self._add_to_collection(documents, self.road_of_hope)
            case 'five_loaves_and_two_fish':
                self._add_to_collection(documents, self.five_loaves_and_two_fish)
            case _:
                raise ValueError(f"Unknown collection: {collection}")

    def _add_to_collection(self, documents: list[Document], collection: chromadb.Collection):
        collection.add(documents=[doc.text for doc in documents], ids=[doc.name for doc in documents])
