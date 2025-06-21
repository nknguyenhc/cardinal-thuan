# Build the frontend folder, then copy it to the backend folder
FROM node:20-alpine AS frontend

WORKDIR /app

COPY ./frontend/package.json ./

RUN npm install

COPY ./frontend/ ./

RUN npm run build

FROM python:3.10-slim AS backend

WORKDIR /app

RUN apt-get update && apt-get install nginx -y

COPY ./requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY ./ai ./ai

COPY ./markdown ./markdown

COPY ./server ./server

COPY ./prompts ./prompts

COPY .env ./

COPY ./start.sh ./

COPY ./nginx /etc/nginx

COPY --from=frontend /app/dist ./static

EXPOSE 80

CMD ["sh", "./start.sh"]
