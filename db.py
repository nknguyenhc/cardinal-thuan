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
    def __init__(self, name: str = "cardinal_thuan", path: str = "chroma"):
        chroma_client = chromadb.PersistentClient(path=path)
        self.collection = chroma_client.get_or_create_collection(name=name, embedding_function=GeminiEmbeddingFunction())
    
    def query(self, query: str, n_results: int = 5):
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return list(zip(results['ids'][0], results['documents'][0]))
    
    def add_documents(self, documents: list[Document]):
        self.collection.add(documents=[doc.text for doc in documents], ids=[doc.name for doc in documents])
