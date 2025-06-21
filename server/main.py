from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

from .models import QueryRequest
from generation import Generation

app = FastAPI()
g = Generation()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def query(request: QueryRequest):
    response, docs = g.query(request.query)
    return {
        "response": response,
        "docs": [doc.model_dump() for doc in docs]
    }
