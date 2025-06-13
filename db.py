import chromadb
from scripts.embed import GeminiEmbeddingFunction

class Db:
    def __init__(self, name: str = "cardinal_thuan", path: str = "chroma"):
        chroma_client = chromadb.PersistentClient(path=path)
        self.collection = chroma_client.get_or_create_collection(name=name, embedding_function=GeminiEmbeddingFunction())
    
    def query(self, query: str, n_results: int = 5):
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return list(zip(results['ids'][0], results['documents'][0]))
