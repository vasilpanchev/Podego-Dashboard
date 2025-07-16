from typing import Any, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from aiocache import cached
import httpx

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from routers import metrics
from utils.auth import get_auth_headers


@cached(ttl=60)
async def fetch_main(endpoint: str):
    headers = await get_auth_headers()
    url = f"https://quotable.box.podego.com/{endpoint}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise e


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def get_health():
    return await fetch_main("health")


@cached(ttl=60)
@app.get("/quotes")
async def get_quotes(n: int = 3):
    headers = await get_auth_headers()
    url = f"https://quotable.box.podego.com/quotes?n={n}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise e


app.include_router(metrics.router, prefix="/metrics")
