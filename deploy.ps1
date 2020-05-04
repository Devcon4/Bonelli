docker build . -t devync/bonelli:latest;
docker push devync/bonelli:latest;
kubectl rollout restart deployment/bonelli;
