# FoodBook

You can view the demo here [foodbook.julianjesacher.dev](https://foodbook.julianjesacher.dev)

## Prerequisites

1. Install dependencies with `npm install`
2. Setup a Maria DB. If you use Docker you can use the definition in the `docker-compose.yml`
3. Copy the `.env.example` to a new file with the name `.env`
4. Fill in the `.env` with your configurations

## Development

To start this application in development mode (and thus with auto-reloading) you will need to run two commands - one for the frontend and one for the backend: 
```
# For the frontend
nx serve frontend

# For the backend; make sure your Maria DB instance is running
nx serve backend
```

You are now up and running.
