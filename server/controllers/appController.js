import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENV from '../config.js'


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try{

        const {username } = req.method == "GET" ? req.query :req.body;

        //check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"})
    }
}

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
    
    const {username, password } = req.body;

    try {

        UserModel.findOne({ username })
        .then(user => {
            bcrypt.compare(password, user.password)
            .then(passwordCheck => {

                if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"})

                // create jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username
                }, ENV.JWT_SECRET, { expiresIn : "24h"});

                return res.status(200).send({
                    msg: "Login Successful...!",
                    username: user.username,
                    token
                })
            })
            .catch(error=> {
                return res.status(400).send({ error: "Password does not Match!"})
            })
        })
        .catch(error => {
            return res.status(404).send({ error : "Username not found"})
        })
    }catch(error){
        return res.status(500).send({error })
    }
}


/** GET : http://localhost: 8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;
    console.log(username);
  
    try {
      const user = await UserModel.findOne({ username }); // Wait for the query to complete
      console.log("Query result:", user); // Now log the result
  
      if (!user) {
        return res.status(404).send({ error: "Couldn't Find the User" });
      }
        /** remove password from user */
        // mongoose return unnecessary data with object so convert it into json
        const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(200).send(rest);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send({ error: "Cannot Find User Data" });
    }
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
  try {
    // Ensure the user is authenticated and userId exists in the request object
    const { userId } = req.user;  // Assuming userId is attached to req.user by authentication middleware

    if (!userId) {
      return res.status(401).send({ error: "User Not Authenticated" });
    }

    // Get the update data from the body
    const body = req.body;

    // Perform the update using updateOne
    const result = await UserModel.updateOne({ _id: userId }, body);

    if (result.modifiedCount === 0) {
      return res.status(404).send({ error: "User Not Found or No Changes Made" });
    }

    // Success response
    return res.status(200).send({ msg: "Record Updated Successfully" });
    
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

// export async function updateUser(req, res) {
//     try {
//       const { id } = req.params; // Assuming you're using URL parameters to identify the user
  
//       if (id) {
//         const body = req.body;
  
//         // Update the data using async/await
//         const updatedUser = await UserModel.findByIdAndUpdate(id, body, { new: true }); 
  
//         if (!updatedUser) {
//           return res.status(404).send({ error: "User Not Found...!" });
//         }
  
//         return res.status(200).send({ msg: "Record Updated...!" });
//       } else {
//         return res.status(400).send({ error: "User ID is required" });
//       }
//     } catch (error) {
//       console.error("Error updating user:", error); // Log the error for debugging
//       return res.status(500).send({ error });
//     }
//   }

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