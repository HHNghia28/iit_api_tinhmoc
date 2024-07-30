import * as bcrypt from 'bcrypt';

export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const compare = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};
