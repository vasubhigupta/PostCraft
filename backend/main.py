import os
from fastapi import FastAPI
import endpoints.analyze as analyze
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://post-craft-sigma.vercel.app",  # frontend deployed
        "http://localhost:3000"                  # local frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)

