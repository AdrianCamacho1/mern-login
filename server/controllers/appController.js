import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'

// POST: http://localhost:8080/api/register 
// * @param : {
// "username": "example123",
// "password": "admin123",
// "email": "example@gmail.com",
// "firstName": "bill",
// "lastName": "william",
// "mobile": 8009860560,
// "address": "Apt. 556, Kulas Light, Gwenborough",
// "profile": ""
// }

export async function register(req, res) {
    
    try{
        const {username, password, profile, email } = req.body;

        //check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username })  // Initiate the query to find a user with the given username
              .then(user => {           // When the query completes successfully:
                if (user) {              // If a user with that username is found
                  reject({ error: "Please use a unique username" });  // Reject the promise with an error message
                } else {
                  resolve();             // Otherwise, resolve the promise (username is unique)
                }
              })
              .catch(err => reject(err)); // If there's an error during the query, reject the promise with the error
          });
          
          const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email })  // Initiate the query to find a user with the given email
              .then(email => {           // When the query completes successfully:
                if (email) {              // If a user with that email is found
                  reject({ error: "Please use a unique email" });  // Reject the promise with an error message
                } else {
                  resolve();             // Otherwise, resolve the promise (email is unique)
                }
              })
              .catch(err => reject(err)); // If there's an error during the query, reject the promise with the error
          });


        Promise.all([existUsername, existEmail])
        .then(()=> {
            if(password){
                bcrypt.hash(password, 10)
                .then( hashedPassword => {

                    const user = new UserModel({
                        username,
                        password: hashedPassword,
                        profile: profile || '',
                        email
                    })

                    //return save result as a response
                    user.save()
                        .then(result => res.status(201).send({ msg: "User Register Successfull"}))
                        .catch(error => res.status(500).send({error}))

                }).catch (error => {
                    return res.status(500).send({
                        error : "Enable to hashed password"
                    })
                })
            }
        }).catch(error => {
            console.error("Error during registration:", error);
            return res.status(500).send({ error });
        })

    } catch(error) {
        return res.status(500).send(error);
    }

}


/**POST : http://localhost:5000/api/login
 * @param: {
 * "username" : " example123",
 * "password" : "admin123"
 * }
 */
export async function login(req, res) {
    res.json('login route');
}


/** GET : http://localhost: 8080/api/user/example123 */
export async function getUser(req, res) {
    res.json('getUser route');
}



/**PUT: http://localhost:8080/api/updateuser
 * @param : {
 * "id" : "<userid>"
 * }
 * body: {
 * firstName: '',
 * lastName: '',
 * profile: '',
 * } 
 */
export async function updateUser(req, res) {
    res.json('updateUser route');
}

/** GET : http://localhost: 8080/api/user/generateOTP */
export async function generateOTP(req, res) {
    res.json('generateOTP route');
}

/** GET : http://localhost: 8080/api/user/verifyOTP */
export async function verifyOTP(req, res) {
    res.json('verifyOTP route');
}



//successfully redirect user when OTP is valid
/** GET : http://localhost: 8080/api/user/createResetSession */
export async function createResetSession(req, res) {
    res.json('createResetSession route');
}


//update the password when we have valid session
/**PUT: http://localhost:8080/api/resetPassword **/
export async function resetPassword(req, res) {
    res.json('resetPassword route');
}