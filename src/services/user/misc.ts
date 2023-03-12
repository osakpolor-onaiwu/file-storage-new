import { find as findUser } from "../../dal/user";
import { ObjectId } from "mongodb";

export async function getUser(key: string | ObjectId) {
  return await findUser({_id: key, email: key as string, username: key as string}, "-password");
}
