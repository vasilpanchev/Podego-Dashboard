from typing import Dict
from aiocache import cached
import os
from dotenv import load_dotenv


import httpx

load_dotenv()
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
USER_EMAIL = os.getenv("FIREBASE_USER_EMAIL")
USER_PASSWORD = os.getenv("FIREBASE_USER_PASSWORD")


async def get_auth_headers() -> Dict[str, str]:
    token = await firebase_login()
    return {"Authorization": f"Bearer {token}"}


@cached(ttl=3000)
async def firebase_login():
    url = (
        f"https://identitytoolkit.googleapis.com/v1/"
        f"accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    )
    payload = {
        "email": USER_EMAIL,
        "password": USER_PASSWORD,
        "returnSecureToken": True,
    }
    print(
        f"Attempting Firebase login with email: {USER_EMAIL}, key: {FIREBASE_API_KEY}, pass: {USER_PASSWORD}"
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

        id_token = data.get("idToken")

        if not id_token:
            raise RuntimeError("Failed to retrieve the ID token from Firebase Auth.")

        print("Retrieved ID token:")
        print(id_token)
        return id_token
