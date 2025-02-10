import * as v from 'valibot';

export const LoginSchema = v.object({
  username: v.pipe(v.string(), v.nonEmpty('Username is required')),
  password: v.pipe(v.string(), v.nonEmpty('Password is required')),
});
