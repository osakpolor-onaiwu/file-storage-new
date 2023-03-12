export default function(message:string, status = 400){
    throw { customError: 1, message: message, status, data: null };
}
