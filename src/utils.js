import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, passwordSinHashear) => bcrypt.compareSync(passwordSinHashear, user.password);
export const __dirname = dirname(__filename);