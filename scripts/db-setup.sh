#! /bin/bash
mkdir -p ./prisma/data/db{1..3}
touch ./prisma/data/db{1..3}
cd ./prisma/config
openssl rand -base64 756 > keyfile
chmod 400 keyfile 
mongod -f config1.yaml
mongod -f config2.yaml
mongod -f config3.yaml
# mongosh admin --host localhost:27001 -u salio