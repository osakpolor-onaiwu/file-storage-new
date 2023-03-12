import throwcustomError from '../../utils/customerror'
import { service_return } from '../../interface/service_response'

export async function user_details(data:any) {
 try{
    const res: service_return = {
      data,
      message: `User details fetched`
    }
    return res;
  } catch (error: any) {
    throwcustomError(error.message);
  }
}
