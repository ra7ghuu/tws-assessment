const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;
const dbPath = path.join(__dirname, "StudentUserMgmt.db");
const initializeDBAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  app.listen(3000, () => {
    console.log("Server starting at http://localhost:3000/");
  });
};
initializeDBAndServer();

//Student User Table Info API
app.post("/", async (request, response) => {
  const {
    id,
    firstname,
    lastname,
    username,
    email,
    password,
    profile_photo,
    address,
  } = request.body;
  const userCreateQuery = `CREATE TABLE userRegistration(id INT PRIMARY KEY,firstname VARCHAR(200),lastname VARCHAR(200),username VARCHAR(200) UNIQUE NOT NULL,email VARCHAR(200) UNIQUE NOT NULL,password VARCHAR(200) NOT NULL,profile_photo LONGBLOB,address VARCHAR(300));`;
  await db.run(userCreateQuery);
  response.send("User table created successfully!!!");
});

//Inserting student Info API
app.post("/userRegister/", async (request, response) => {
  const {
    id,
    firstname,
    lastname,
    username,
    email,
    password,
    profile_photo,
    address,
  } = request.body;
  const createUserQuery = `INSERT INTO userRegistration(id,firstname,lastname,username,email,password,profile_photo,address) VALUES(${id},'${firstname}','${lastname}','${username}','${email}','${password}','${profile_photo}','${address}');`;
  const prevUserQuery = `SELECT email FROM userRegistration WHERE id=${id};`;
  const createdQuery = await db.run(createUserQuery);
  if (createdQuery.email === prevUserQuery.email) {
    response.send("User Already exists");
    response.status(400);
  } else {
    response.send("User inserted succesfully!!");
    response.status(201);
  }
});

//Get User through UserID
app.get("/userData/:userID/", async (request, response) => {
  const { userID } = request.params;
  const getUserQuery = `SELECT * FROM userRegistration WHERE id='${userID}';`;
  const userArray = await db.get(getUserQuery);
  response.send(userArray);
});

//Update studentuser API
app.put("/studentInfoUpdate/:userID", async (request, response) => {
  const { userID } = request.params;
  const prevUserQuery = `SELECT * FROM userRegistration WHERE id='${userID}';`;
  const {
    firstname = prevUserQuery.firstname,
    lastname = prevUserQuery.lastname,
    profile_photo = prevUserQuery.profile_photo,
    address = prevUserQuery.address,
  } = request.body;
  const updateUserQuery = `UPDATE userRegistration SET firstname='${firstname}',lastname='${lastname}',profile_photo='${profile_photo}',address='${address}';`;
  await db.run(updateUserQuery);
  response.send("User Updated Successfully!!");
});

//Student User Delete API
app.delete("/studentDelete/:userID", async (request, response) => {
  const { userID } = request.params;
  const delUserQuery = `DELETE FROM userRegistration WHERE id=${userID};`;
  await db.run(delUserQuery);
  response.send("User Deleted Successfully!!!");
});

//Get all student users API
app.get("/allUsers/", async (request, response) => {
  const getAllUsersQuery = `SELECT * FROM userRegistration LIMIT 5;`;
  const getUsersArray = await db.all(getAllUsersQuery);
  response.send(getUsersArray);
});
