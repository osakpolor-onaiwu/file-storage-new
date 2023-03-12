import UserModel, { User } from '../models/user';
import { Document } from 'mongoose';
import { ObjectId } from 'bson';
import { removeEmptyfilters, stripEmptyProperties } from '../utils/misc';
import LoginAttemptModel, { LoginAttempt } from '../models/login-attempt';

export async function save(data: User): Promise<Document> {
    const new_user = new UserModel(data);
    return new_user.save();
}

export async function find(user: User, projection?: string | string[] | {[key: string]: number}) { 
  if (user._id && ObjectId.isValid(user._id)) return await UserModel.findOne({ _id: new ObjectId(user._id) }).lean().select(projection || "");
    else
      return await UserModel.findOne(removeEmptyfilters({
        $or: [{ email: user.email }, { username: user.username }],
      })).lean().select(projection || "");
}


export async function saveLoginAttempt(login_attempt: LoginAttempt) {
    const new_attempt = new LoginAttemptModel(login_attempt);
    return await new_attempt.save();
  }

export async function updateLoginAttempt(login_attempt: LoginAttempt) {
    return LoginAttemptModel.updateOne(
      { user_id: login_attempt.user_id, token_id: login_attempt.token_id },
      stripEmptyProperties(login_attempt),
      { new: true, rawResult: true },
    );
  }