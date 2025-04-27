import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);

const PRIVATE_KEY = config.JWT_PRIVATE_KEY;
const EXPIRES_TIME_TOKEN = config.JWT_EXPIRES_TIME_TOKEN;

export const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn: EXPIRES_TIME_TOKEN});
    return token;
}


export const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({
        error: "Not authenticated"
    });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {

        if(error) return res.status(403).send( {error: "Not authorized"});

        req.user = credentials;
        next();
    })
}


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, passwordSinHashear) => bcrypt.compareSync(passwordSinHashear, user.password);
export const __dirname = dirname(__filename);