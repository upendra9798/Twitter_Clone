Backend-> Install backend->routes->authRoutes->controllers->form database
for signup(MongoDB) ->.env file->read .env in index/server-> connect database ->Form model



(in Twitter folder)
1. npm init -y 
2. npm install express mongoose jsonwebtoken bcryptjs dotenv cors cookie-parser cloudinary
3. npm i -D nodemon
4. change these things in package.json: 
  "type" : "module",
  "scripts": {
    "dev": "nodemon Backend/server.js", //updated bydefault on any change
    "start": "node Backend/server.js"
  },
  "main": "Backend/server.js",
Note:- Getting dev not found so deleted package and reinstall by:-(Make sure to save the file, see dot on file name)
rm package-lock.json
rm -r node_modules
npm install 

5. In index/server.js form app with express and listen it and get(home page) //Home route(later change to use)
Note:- As mongoDB is a noSQL database so there are collections not tables
6. For simplicity of code we will make routes separately as we have to write routes for many things like auth,post,etc
7. Make controllers section separate
8. Make models folder for MONGODB
9. Make auth route:
      1. signup - first use get to check then change to post 
      2. login,logout,etc
      3. after checking make it use and transfer all inside data in auth controller using async fn
10. Form mongo dv cluster and .env file in backend
11. connect db in another file and import in index.js

12. Make user model
13. To use req.body() for taking information of user use app.use(express.json()) in index
14. Form signup controller and encrypt password with JWT
15. Form jwt token for encrypting pass in lib-utils
16. write JWT secret in .env
OPEN GITBASH in terminal and type:- openssl rand -base64 32 to get JWT secret(random)
17. Test it in postman for signup
app.use(express.urlencoded({ extended: true })); // to parse form data
use this if needed