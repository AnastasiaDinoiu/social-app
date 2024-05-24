# social-app

Welcome to **social-app**! 🚀 <br>

## Technologies

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features

- 🔒 User authentication
- 📝 Create, edit, and delete posts
- ❤️ Like and comment on posts
- 👤 View user profiles
- ✏️ Update user profile

## Installation

1. Clone the repository

```bash
git clone
```

2. Set up Docker

```bash
docker run --name postgres_social_media -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=social_media -v postgres_data:/var/lib/postgresql/data -p 5432:5432 -d postgres
```

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -v /local-data/:/data redis/redis-stack:latest
```

3. Install dependencies

```bash
npm install
```

4. Start the server

```bash
npm start
```

5. Run tests

```bash
npm test
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory of the project. Add the following environment variables that are used to
configure the server, postgres, redis, and JWT secret:

- `DB_USER`: Postgres user
- `DB_PASSWORD`: Postgres password
- `DB_NAME`: Postgres database name
- `DB_HOST`: Postgres host
- `DB_PORT`: Postgres port
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `HOST`: Server host
- `PORT`: Server port
- `JWT_SECRET`: JWT secret

### Database Schema

The following is the database schema used in the project:
![Database Schema](./images/db_diagram.svg)

## API Documentation

Swagger documentation is available at `http://localhost:3002/docs/static/index.html`

## Workflow

The following is the workflow of the project:
![Workflow](./images/workflow_diagram.svg)

## License

📝 This project is licensed under the MIT License - see
the <a href="https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt">LICENSE</a> file for details