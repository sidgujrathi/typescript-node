import { model, Schema, Model } from 'mongoose';
import { pbkdf2, randomBytes } from 'crypto';
import { IUser, PersistedPassword } from './interface';
import { string } from 'joi';

const KEY_LENGTH = 256;
const SALT_LENGTH = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';
const BYTE_TO_STRING_ENCODING = 'hex'; // this could be base64, for instance

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    salt: { type: String, select: false },
    password: { type: String, select: false },
    iterations: { type: Number, select: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

UserSchema.set('toJSON', {
  transform(doc: any, ret: any, options: any) {
    ret.userId = ret._id;
    delete ret.password;
    delete ret.salt;
    delete ret.iterations;
    delete ret._id;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform(doc: any, ret: any, options: any) {
    ret.userId = ret._id;
    delete ret.password;
    delete ret.salt;
    delete ret.iterations;
    delete ret._id;
    return ret;
  },
});

UserSchema.pre<IUser>('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  generateHashPassword(user.password)
    .then(data => {
      user.password = data.password;
      user.salt = data.salt;
      user.iterations = ITERATIONS;
      next();
    })
    .catch(err => {
      next(err);
    });
});

UserSchema.virtual('fullName').get(function (): string {

  return this.firstName + ' ' + this.lastName;
});

/**
 * Generates a PersistedPassword given the password provided by the user. This should be called when creating a user
 * or redefining the password
 */
export async function generateHashPassword(
  password: string,
): Promise<PersistedPassword> {
  return new Promise<PersistedPassword>((resolve, reject) => {
    const salt = randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
    pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (error, hash) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          salt,
          password: hash.toString(BYTE_TO_STRING_ENCODING),
          iterations: ITERATIONS,
        });
      }
    });
  });
}

/**
 * Verifies the attempted password against the password information saved in the database. This should be called when
 * the user tries to log in.
 */
export async function verifyPassword(
  savedPassword: string,
  savedSalt: string,
  savedIterations: number,
  passwordAttempt: string,
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    pbkdf2(
      passwordAttempt,
      savedSalt,
      savedIterations,
      KEY_LENGTH,
      DIGEST,
      (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(savedPassword === hash.toString(BYTE_TO_STRING_ENCODING));
        }
      },
    );
  });
}

const User: Model<IUser> = model<IUser>('user', UserSchema);

export default User;
