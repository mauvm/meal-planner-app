# Meal Planner: App Service

> Web interface via NextJS server

This TypeScript service is part of the [Meal Planner project](https://github.com/users/mauvm/projects/1).

## Local Development

Prerequisites:

- [NodeJS v10+](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)
- [Auth0 Application credentials](https://github.com/auth0/nextjs-auth0#getting-started)

Configure the project:

```bash
cp .env.example .env
edit .env
```

Then install the dependencies and run app in development mode:

```bash
yarn install
yarn dev
```

## Deploy to Production

```bash
# Configure Docker CLI
eval $(minikube docker-env) # Or "minikube docker-env | Invoke-Expression" on Windows

# Build Docker image
docker build -t app-service .

# Deploy via infrastructure repository
```

### Github Actions

For Docker image builds with Github Actions you must configure the following secrets:

- `DOCKER_HOST`: domain name for custom registry, leave blank to use Docker Hub
- `DOCKER_USERNAME`: username for registry authentication
- `DOCKER_PASSWORD`: password for registry authentication
- `DOCKER_REPOSITORY`: the repository/user and image name, for example: `meal-planner/app-service`
