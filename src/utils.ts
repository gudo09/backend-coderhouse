import bcrypt from "bcrypt";

import config from "@/config.js";

export const createHash = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (
  enteredPassword: string ,
  savedPassword: string
) => bcrypt.compareSync(enteredPassword, savedPassword);
