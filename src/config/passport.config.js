import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import User from '../models/user.model.js';  // Solo importamos una vez

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body; // 👈 No redeclaramos email porque username ya lo tenemos

            try {
                const existingUser = await User.findOne({ email: username });
                if (existingUser) {
                    console.log('User already exists');
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password)
                };

                const userCreated = await User.create(newUser);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    console.log('Usuario no encontrado');
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!isValidPassword(user, password)) {
                    console.log('Contraseña incorrecta');
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        if (!user) {
            return done(new Error("User is null"));
        }
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            if (!id) {
                return done(new Error("ID vacío en la sesión"));
            }
            console.log("Intentando deserializar ID:", id);
    
            const user = await User.findById(id);
    
            if (!user) {
                console.log("Usuario no encontrado para ID:", id);
                return done(null, false);  // ⚡ devolvé false, NO tires error
            }
    
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
    
};

export default initializePassport;