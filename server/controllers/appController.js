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
    res.json('register route');
}


/**POST : http://localhost:5000/api/login
 * @param: {
 * "username" : " example123",
 * "pas"}
 */
export async function login(req, res) {
    res.json('login route');
}