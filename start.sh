#!/bin/bash

service nginx start && \
uvicorn server.main:app --host 0.0.0.0 --port 8000
