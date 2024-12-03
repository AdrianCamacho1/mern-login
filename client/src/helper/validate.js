import toast from 'react-hot-toast'

//validate login page username
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);

    return errors;
}

//valdate password
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

/**validate reset password */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password did not match!");
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values) {
    const errors = usernameVerify({}, values); // Validate the username
    passwordVerify(errors, values);  // Validate the password (presumably)
    emailVerify(errors, values);

    return errors;
}



/********************************************************************************* */

// validate password
function passwordVerify (errors = {}, values){

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    }else if (values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long!")
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special characters")
    }

    return errors;
}


//  validate username
function usernameVerify (error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if (values.username.includes(" ")){
        error.username = toast.error('Invalid Username...!')
    }

    return error;
}

/** validate email */
function emailVerify(errors = {}, values){
    if(!values.email){ // Check if the email field is empty
        error.email = toast.error("Email Required...!"); // If empty, set an error message using toast
    }else if (values.email.includes(" ")){ // Check if the email contains spaces
        error.email = toast.error("Wrong Email...!") // If spaces are found, set an error message
    }else if(
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) // Check if the email matches a valid email pattern using a regular expression
      )
    {
        error.email = toast.error("Invalid email address...!"); // If the pattern doesn't match, set an error message
    }
    return error; // Return the errors object (which might contain an error message or be empty)
}