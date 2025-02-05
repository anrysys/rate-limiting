.PHONY: up down install dev test build clean

up:
	docker-compose up -d

down:
	docker-compose down

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	docker-compose up -d redis
	cd backend && npm run start:dev & cd frontend && npm run dev

test:
	cd backend && npm run test
	cd frontend && npm run test

build:
	docker-compose build

clean:
	docker-compose down -v
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
