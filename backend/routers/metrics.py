from fastapi import APIRouter, HTTPException
import httpx
from aiocache import cached

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from utils.auth import get_auth_headers


@cached(ttl=60)
async def fetch_metrics(endpoint: str):
    headers = await get_auth_headers()
    url = f"https://quotable.box.podego.com/metrics/{endpoint}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(
                url,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise e
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="External API timeout")
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")


router = APIRouter()


@router.get("/daily-active-users")
async def get_daily_active_users():
    return await fetch_metrics("daily_active_users")


@router.get("/api-requests")
async def get_api_requests():
    return await fetch_metrics("api_requests")


@router.get("/new-signups")
async def get_new_signups():
    return await fetch_metrics("new_signups")


@router.get("/endpoint-error")
async def get_endpoint_error():
    return await fetch_metrics("endpoint_error")


@router.get("/feature-usage")
async def get_feature_usage():
    return await fetch_metrics("feature_usage")


@router.get("/country-metrics")
async def get_country_metrics():
    return await fetch_metrics("country_metrics")


@router.get("/response-times")
async def get_response_times():
    return await fetch_metrics("response_times")
