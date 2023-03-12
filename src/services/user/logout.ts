import throwcustomError from '../../utils/customerror'

export async function logout(options:any) {
    try {
      
          return {
              message: "logout successful",
              data: {}
          }   
    } catch (error: any) {
        throwcustomError(error.message);
    }
  }