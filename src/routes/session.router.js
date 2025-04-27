import { Router } from "express";
import User from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate('register', {
    failureRedirect: '/api/sessions/failregister'
}), (req, res) => {
    res.redirect("/login");
});


router.get('/failregister', (req,res) => {
    res.send({error: "Failed"})
})

router.post("/login", passport. authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res) => {
    try { 
        if(!req.user) {
            return res.status(400).send({status: false, message: "Credenciales inválidas"});
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }

        res.redirect("/perfil");
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log (error);
    }
});

router.get('/faillogin', (req,res) => {
    res.send({error: "Failed"})
})

router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.redirect('/login');
    })
});

router.post('/restore-password', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({status: false,message: "Email y nueva contraseña son requeridos",});
    }
    try{
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).send({ status: false, message: "Usuario no encontrado" });
        }
        user.password = createHash(password);
        await user.save();
        res.redirect('/login');
    }catch(error){
        return res.status(500).send("Error al restaurar la contraseña");
    }
});

export default router;
