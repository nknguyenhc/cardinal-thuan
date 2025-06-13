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

def create_collection(documents: list[Document], name: str, path: str = "chroma"):
    chroma_client = chromadb.PersistentClient(path=path)
    collection = chroma_client.create_collection(name=name,
                                                 embedding_function=GeminiEmbeddingFunction())
    collection.add(documents=[doc.text for doc in documents], ids=[doc.name for doc in documents])
    return collection

def create_documents(folder: str = "markdown") -> list[Document]:
    documents = []
    for filename in os.listdir(folder):
        if filename.endswith(".md"):
            with open(os.path.join(folder, filename), "r", encoding="utf-8") as f:
                text = f.read()
                documents.append(Document(text=text, name=filename))
    return documents

if __name__ == "__main__":
    documents = create_documents()
    collection = create_collection(documents, name="cardinal_thuan")
    print(f"Collection '{collection.name}' created with {len(documents)} documents.")
