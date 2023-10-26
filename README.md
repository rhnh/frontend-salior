#  Database Setup
you need this setup only once
## Step 1
### Install project with npm/pnpm/yarn
```sh
  npm install
```
## step 2
# setup with script
```sh
# after install with npm/yarn/pnpm
./script/db-setup.sh
```

## step 3
After running db-setup.sh, you are inside mongodb shell.
### Step 3.1
replicaSet initialization
```js
  rs.initial();

```
Create admin database
### Step 4.1 Create admin user for the admin database
```js
  use admin;
  //see the manual for more infos
  db.createUser({})
```

[Mongodb Manual](https://www.mongodb.com/docs/manual/reference/method/db.createUser/)
#### Step 4.1 Example
```js 
  db.createUser({
    user:"admin",
    pwd:passwordPhrase(),
    roles:[{
      role:"root",
      db:"admin"
    }]
  })
```
### Step 4.2 
```js 
  db.auth("admin")
  //enter the password
```

### Step 4.3 
> Create new Users for the actual database.


### PS
The default Mongodb port for this project is 27001, if you want change to port you need
in all 4 files: below
- ./prisma/config1.yaml
- ./prisma/config2.yaml
- ./prisma/config3.yaml
- ./script/db-setup.sh
## Step 4
```sh
  npx prisma generate
```

# Setting up Mongodb manually
 - generate a keyFile in *./prisma/config*
 ```sh
  openssl rand -base64 756 > keyfile
 ```
- create database and logs directories inside *./prisma*

- change permission of keyFile
```sh
  chmod 400 keyfile 
```

```sh
  mkdir data/db{1..3} && touch data/db{1..3} mongodb.log
```
- Run the yaml files with mongod
```sh
mongod -f config1.yaml
```
- Run mongo instance on given port for example 27001, which is defined in Config file
```sh
  mongo admin --host localhost:27001
```
- initiate the ReplcaSet
```js
  rs.initiate();
```
- Create the root User
- authenticate the root user
- create another user

# How to install and run it ? 
## use yarn/npm
How to run ? 
# how to run this project ? 

check if database is on 27001 or your given  running 
```sh
ps -aux | grep mongod 
```
if it is not running 
```sh
./script/run-db.sh
```


- [Remix Docs](https://remix.run/docs)

## Development

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode,
which will purge the server require cache when Remix rebuilds assets 
so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.
