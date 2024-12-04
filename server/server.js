import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js'; // Imports a custom function to connect to the database
import router from './router/route.js';

const app = express();

/** middleware */

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack


const port = 8080;

/** HTTP GET Request */
app.get('/', (req,res)=> { // Defines a route handler for GET requests to the root path ('/')
    res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', router)


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

