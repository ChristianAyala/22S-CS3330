# A basic run command that pulls the getting-started image from here: https://hub.docker.com/r/docker/getting-started
docker run -dp 80:80 docker/getting-started

# Let's build our own container. This will build a container by following all the build commands found in Dockerfile
docker build -t smu-container .

# Now that we built it, we can run it and also connect the container port 3000 with the OS port 3000
docker run -dp 3000:3000 smu-container

# This shows all running containers. We can then stop, start, or remove that container
docker ps
docker stop [id]
docker rm [id]

# If we want to run a multi-container setup, then we need to define a network for those containers to live in
docker network create smu-app

# This will create a mysql container that is running mysql v8. The MYSQL_ROOT_PASSWORD and MYSQL_DATABASE
# will be used to create a set of user credentials (username: root) and a database (smu).

docker run -dp 3306:3306 \                          # Start by running a docker command. Expose port 3306 to the OS.
     --network smu-app --network-alias mysql \      # This will use the smu-app network. The container will be reachable at `mysql`.
     --platform "linux/amd64" \                     # Necessary if you're running an M1 mac. Optional otherwise
     -v smu-app-data:/var/lib/mysql \               # Create a volume so that our database is persisted across containers
     -e MYSQL_ROOT_PASSWORD=secret \                # Set the password of our mysql container to "secret"
     -e MYSQL_DATABASE=smu \                        # Set the database of our mysql container to "smu"
     mysql:8                                        # Use mysql version 8 as our base docker container image

docker run -dp 3000:3000 \                          # Start by running a docker command. Export port 3000 to the OS.
    --network smu-app --network-alias app \         # This will ALSO live in the smu-app network. Anything in the same network can talk to each other
    smu-container                                   # Everything about smu-container is already configured in the Dockerfile. So just use it!

# If we want to run migrations + seeds, we need to run them in the app container. The app container knows how
# to reach the mysql database via the knexfile.js file.
docker exec -it [id] npm run migrate:up
docker exec -it [id] npm run seed:run


docker run -dp 3306:3306 \
--network smu-app --network-alias mysql \
--platform "linux/amd64" \
-v smu-app-data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=secret \
-e MYSQL_DATABASE=smu \
mysql:8

docker run -dp 3000:3000 \
--network smu-app --network-alias app \
smu-container