#! /bin/bash
cd ./prisma/config
mongod -f config1.yaml
mongod -f config2.yaml
mongod -f config3.yaml