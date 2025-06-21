from fastapi import FastAPI

from .models import QueryRequest
from generation import Generation

app = FastAPI()
g = Generation()

@app.post("/")
async def query(request: QueryRequest):
    response, docs = g.query(request.query)
    return {
        "response": response,
        "docs": [doc.model_dump() for doc in docs]
    }
