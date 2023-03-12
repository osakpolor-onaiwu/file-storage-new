import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Pick<Document, "_id"> {
  email?: string;
  password?: string;
  hash_password?: string;
  username?: string;
  is_verified?: boolean;
  blacklisted?: boolean;
  role?: string;
};

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true,'email is required'], 
    },
    password: {
      type: String,
      required: true,
      minlength:8
    },
    role:{
      type: String,
      required: true,
    },
    is_verified:{
      type: Boolean,
      required: true,
      default: false,
    },
    blacklisted: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  { timestamps: true },
);


// NB: this is a mongoose hook/middleware. it allows you to perform certain action before or after a document
//is saved,updated, deleted etc. read more from https://mongoosejs.com/docs/middleware.html
// the function must be a normal function, not an arrow function.
// * Hash the password before it is saved to the 
UserSchema.pre('save', async function (next: (err: Error | null) => void) {
  // Make sure you don't hash the hash
  if (!this.isModified('password')) {
    return next(null);
  }

  //NB. salt rounds (also called cost)is a number that specifies how slow the hashing should be. the slower the harder it is for hackers
  //break. bcrypt will generate a salt based on the salt round. A salt is random text added to the string to be hashed. just stick with 10 for now
  this.password = await bcrypt.hash(String(this.password), parseInt(process.env.SALT_ROUNDS));
  next(null);
});
//TO DO: i will need to add a hook to hash password when findandupdate is done, when user wants to update thier password
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
