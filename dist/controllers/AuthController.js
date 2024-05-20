"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (request, response) => {
        try {
            const { password, email } = request.body;
            //# ->  Verificar si existe otro email igual -> prevenir duplicado
            const userExist = await User_1.default.findOne({ email });
            if (userExist) {
                const error = new Error("El usuario ya esta registrado");
                return response.status(409).json({ error: error.message });
            }
            //# ->  Crea un usuario
            const user = new User_1.default(request.body);
            //# ->  Hashear password
            user.password = await (0, auth_1.hashPassword)(password);
            //# ->  Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //# ->  Enviar email
            AuthEmail_1.AuthEmail.senConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            response.send("Cuenta creada, revisa tu email para confirmarla");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error aqui" });
        }
    };
    static confirAccount = async (request, response) => {
        try {
            const { token } = request.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return response.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            response.send("Cuenta confirmada correctamente xD");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static login = async (request, response) => {
        try {
            const { email, password } = request.body;
            const user = await User_1.default.findOne({ email });
            //. ->    Verificar que exista el usuario
            if (!user) {
                const error = new Error("Usuario no encontrado");
                return response.status(404).json({ error: error.message });
            }
            //. ->    Verificar que este confirmado
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                //# ->  Enviar email
                AuthEmail_1.AuthEmail.senConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });
                token.save();
                const error = new Error("Usuario no confirmado, se le ha enviado un correo de confirmacion");
                return response.status(401).json({ error: error.message });
            }
            //. ->    Verificar contraseña
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta");
                return response.status(401).json({ error: error.message });
            }
            //. ->    Paso todas las verificaciones -> Generar JWT
            const token = (0, jwt_1.generateJWT)({ id: user._id });
            response.send(token);
        }
        //# ->  Error generico
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static requestConfirmationCode = async (request, response) => {
        try {
            const { email } = request.body;
            //# ->  Verificar si existe usuario
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El usuario no esta registrado");
                return response.status(409).json({ error: error.message });
            }
            //# ->  Verificar si ya esta autenticado
            if (user.confirmed) {
                const error = new Error("El usuario ya esta confirmado");
                return response.status(403).json({ error: error.message });
            }
            //# ->  Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //# ->  Enviar email
            AuthEmail_1.AuthEmail.senConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([user.save(), token.save()]);
            response.send("Se envió un nuevo token a tu email");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error aqui" });
        }
    };
    static forgotPassword = async (request, response) => {
        try {
            const { email } = request.body;
            //# ->  Verificar si existe usuario
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error("El usuario no esta registrado");
                return response.status(409).json({ error: error.message });
            }
            //# ->  Generar token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //# ->  Enviar email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            token.save();
            response.send("Se envió un nuevo token a tu email");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static validateToken = async (request, response) => {
        try {
            const { token } = request.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return response.status(404).json({ error: error.message });
            }
            response.send("Token valido, Define tu nueva contraseña");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static updatePasswordWithToken = async (request, response) => {
        try {
            const { token } = request.params;
            const tokenExist = await Token_1.default.findOne({ token });
            const { password } = request.body;
            if (!tokenExist) {
                const error = new Error("Token no valido");
                return response.status(404).json({ error: error.message });
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.password = await (0, auth_1.hashPassword)(password);
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            response.send("La contraseña de actualizo correctamente");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static user = async (request, response) => {
        return response.json(request.user);
    };
    //# Profile
    static updateProfile = async (request, response) => {
        const { name, email } = request.body;
        const user = request.user;
        const userExist = await User_1.default.findOne({ email });
        if (userExist && user.email.toString() !== email.toString()) {
            const error = new Error("Ese email ya esta en uso");
            return response.status(409).json({ error: error.message });
        }
        user.name = name;
        user.email = email;
        try {
            await user.save();
            response.send("Perfil actualizado correctamente");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static updatePassword = async (request, response) => {
        const { passwordCurrency, password } = request.body;
        const user = await User_1.default.findById(request.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(passwordCurrency, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("Contraseña incorrecta");
            return response.status(401).json({ error: error.message });
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            response.send("Contraseña actualizada correctamente");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static checkPassword = async (request, response) => {
        const { password } = request.body;
        const user = await User_1.default.findById(request.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("Contraseña incorrecta");
            return response.status(401).json({ error: "Contraseña incorrecta" });
        }
        try {
            response.send("Contraseña correcta");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map