from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import logging

logging.basicConfig(level=logging.INFO)

from .models import QueryRequest
from ai.generation import Generation

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
    return StreamingResponse(g.query(request.query), media_type="text/event-stream")

@app.post("/title")
async def get_title(request: QueryRequest):
    title = g.get_title(request.query)
    return {"title": title}
