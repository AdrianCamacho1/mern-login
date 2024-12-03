
/** image onto base64 */
export default function convertToBase64(file){
    return new Promise((resolve, reject)=> {
        const fileReader = new FileReader(); // Create a new FileReader object
        fileReader.readAsDataURL(file); // Read the file as a data URL

        fileReader.onload = () => {
            resolve(fileReader.result) // Resolve the promise with the base64-encoded data URL
        }

        fileReader.onerror = (error)=> {
            reject(error) // Reject the promise if there's an error
        }
    })
}