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
- 📰 View posts from followed users on feed
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

## License
📝 This project is licensed under the MIT License - see the <a href="https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt">LICENSE</a> file for details