# Intro to containerization

---

## Primer

In modern software development containerization is king. It is a robust was to package and deploy software to multiple different configurations. It allows for reproducibility, greater control of runtime environment, and faster time-to-deploy. Docker is a very popular tool to help developers build containers and is synonymous with containerization. 

## What are Containers?

Containers are lightweight packages of your application code along with other dependencies needed to run this code like runtimes, libraries, etc. The goal is to group everything your application needs to run into a single distributable image. 

_Containers vs Virtualization:_

![containers vs virtualization](https://www.docker.com/wp-content/uploads/2021/11/docker-containerized-and-vm-transparent-bg.png)

Containers are similar to Virtual Machines but with a few key differences. Containers do not require a full OS like VMs do, rather they run on a 'Container Runtime' (Docker Engine, containerd, podman, etc). This means they are much smaller than a full VM, both in image size and in resource needs. There are more nuanced differences between the two but we don't need to think about those at the surface level.

## Docker

Docker is a collection of tools that lets us build and run containers easily. Note Docker isn't the only option to do this but it is the most ubiquitous and what you will commonly see used. The first thing we will need in order to start is to install [Docker Desktop](https://www.docker.com/products/docker-desktop/). This will install the underlying container runtime, the Docker CLI, as well as some helpful UI application for managing docker.

__Linux and Containers__

When we are talking about containers it is implied that we also intend to run our application through Linux. While possible to run Windows based containers it is not very common and not all tools/platforms/applications will support it. When we install Docker Desktop it will use WSL to run our containers. Older versions of Docker Desktop would use Hyper-V to do this. The Mac version will also spin up a Linux VM in order to run our containers. Most of the time you don't really need to think about this but it is still important to understand what is actually happening behind the scenes.

## Running a container

Now that we have Docker installed let try just running a container on our machine. Lets run an example .NET Core image.

```
docker run -it -p 8000:80 mcr.microsoft.com/dotnet/samples:aspnetapp
```

The "run" keyword is used for running containers with the docker CLI. We then give it two arguments. "-it" which means keep this running in this terminal and "-p 8200:80" which will connect port "8200" on our machine to port "80" of the container we are running. Finally we pass the name of the image we want to run "mcr.microsoft.com/dotnet/samples:aspnetapp". This can be broken intro three parts `<repo>/<image>:<tag>`. The repo is the Container Repository. Think similar to a git or npm repo but for fully built/published container images. Repositories can have multiple images so we need to specify which image we are looking for. And finally images can have multiple tags. Tags are how images will be versioned, similar to git tags. There are no rules for tagging so each project is different. It is common for images to be tagged for different underlying distros as well. For example the Node image has a tag for version "20", "20-apline", "20-buster", and "latest".

## Building our own image

---

What if we want to build our own image? This is the job of a `Dockerfile`. It is a file with a list of commands for building and setting up the runtime for our application. [Here is an example.](https://github.com/Devcon4/kite/blob/main/dockerfile)

```
FROM mcr.microsoft.com/dotnet/sdk:6.0 as api
ARG VERSION=1.0.0
WORKDIR /build
COPY api/*.csproj ./
RUN dotnet restore ./
COPY api/ ./
RUN dotnet publish -c Release --no-restore -o /build/publish /p:Version=${VERSION} ./

FROM node:16-alpine as app
WORKDIR /build
COPY app/package.json ./
COPY app/package-lock.json ./
RUN npm ci;
COPY app/ ./
RUN npm run build;

FROM mcr.microsoft.com/dotnet/aspnet:6.0 as entry
ARG USER=appuser
ARG UID=1001
ARG GID=1001
RUN groupadd -g $GID $USER
RUN useradd --uid $UID --gid $GID --create-home --shell /bin/bash $USER
RUN mkdir /app && chown -R $USER:$USER /app
USER $USER
WORKDIR /app
COPY --chown=$USER:$USER --from=api /build/publish .
COPY --chown=$USER:$USER --from=app /build/dist/kite ./wwwroot/
ENV ASPNETCORE_URLS="http://*:8080"
EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
```

This is the Dockerfile used for my Kite repo. It is a .Net and Angular application. All dockerfile commands basically break down into `<CMD> <Arguments>` so it's pretty simple; No if blocks or complicated logic allowed. Lets look at just the first block.

All Dockerfiles begin with a `FROM` statement. All Dockerfiles extend from an existing image. What we are doing here is grabbing the existing dotnet/sdk image that Microsoft has already created as our starting point. In turn that image will have a From statement extending from probably an ubuntu image which then extends from the magic root image called `Scratch` which is basically the plain Linux kernel. It's Docker images all the way down.

The next interesting command is `COPY`. Think of our container as a folder, anything we want included into that folder we will need to copy from our local system into the container. That normally includes things like .csproj or package.json files first so we can install dependencies followed by then copying the rest of our source code. Docker will try to cache our build commands as much as possible to speed up build time. By copying things in a smart way we can optimize this caching for us.

`RUN` is also another important command. This will allow us to run shell commands during the build process. The Terminal used depends on your FROM but most of the time it is either sh or bash. In this block we are using RUN to call dotnet cli commands to restore packages as well as publish our api into the /build/publish folder.

Okay first block out of the way. This Dockerfile is using a pattern called "Multi-stage Builds" in Docker. Different parts of our application might need different tools in order to build. Some of those tools might not even be required to actually run our app, only to build it. Rather than having a single FROM and installing every tool we need to build our application we can split up our build, building our api and app separately then finally copy everything we actually need to run into a final entry block.

Finally there will normally an `EXPOSE` which will specify what ports we will allow docker will bind too. There is also an `ENTRYPOINT` which will be what will actually run when we start the container.

## Final thoughts

Containerization is a very powerful concept and one of the core pillars of modern DevOps principles. There is a lot more to containerization that we haven't gone over here. Compose is another powerful part of the docker ecosystem that we use frequently.

---
