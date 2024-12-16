import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js'; // Imports a custom function to connect to the database
import router from './router/route.js';
import UserModel from './model/User.model.js';

const app = express();

/** middleware */

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack


const port = 8080;
const users = [
    {
      id: 1,
      username: "example123",
      email: "example123@example.com",
      password: "hashed_password"
    },
    {
      id: 2,
      username: "anotheruser",
      email: "anotheruser@example.com",
      password: "another_hashed_password"
    }
  ];

/** HTTP GET Request */
app.get('/', (req,res)=> { // Defines a route handler for GET requests to the root path ('/')
    res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', router)

app.get('/api/users', async (req, res) => {
    try {
      const users = await UserModel.find({}); // Fetch all users from the database
      res.status(200).json(users); // Send the users as a JSON response with a 200 OK status code
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' }); // Send an error response if something goes wrong
    }
  });

/** start server only when we have valid connection*/
connect().then(()=> {
    try {
        app.listen(port, ()=> {
            console.log(`Server connected to http://localhost:${port}`);
        })
    }catch (error){
        console.log('Cannot connect to the server')  //server fails
    }
}).catch(error => {
    console.log("Invalid database connection...!")  //database fails
})

