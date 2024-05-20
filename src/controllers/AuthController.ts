import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (request: Request, response: Response) => {
    try {
      const { password, email } = request.body;

      //# ->  Verificar si existe otro email igual -> prevenir duplicado
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return response.status(409).json({ error: error.message });
      }
      //# ->  Crea un usuario
      const user = new User(request.body);
      //# ->  Hashear password
      user.password = await hashPassword(password);
      //# ->  Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      //# ->  Enviar email
      AuthEmail.senConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);
      response.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error aqui" });
    }
  };
  static confirAccount = async (request: Request, response: Response) => {
    try {
      const { token } = request.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return response.status(404).json({ error: error.message });
      }
      const user = await User.findById(tokenExist.user);
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      response.send("Cuenta confirmada correctamente xD");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  };
  static login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        if (!user.confirmed) {
            const token = new Token()
            token.user = user.id
            token.token = generateToken()
            await token.save()

            // enviar el email
            AuthEmail.senConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
            return res.status(401).json({ error: error.message })
        }

        // Revisar password
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Password Incorrecto')
            return res.status(401).json({ error: error.message })
        }

        const token = generateJWT({id: user._id})
        
        res.send(token)

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}
  static requestConfirmationCode = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { email } = request.body;

      //# ->  Verificar si existe usuario
      const user = await User.findOne({ email });
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
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      //# ->  Enviar email
      AuthEmail.senConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);
      response.send("Se envió un nuevo token a tu email");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error aqui" });
    }
  };
  static forgotPassword = async (request: Request, response: Response) => {
    try {
      const { email } = request.body;

      //# ->  Verificar si existe usuario
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return response.status(409).json({ error: error.message });
      }
      //# ->  Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      //# ->  Enviar email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      token.save();
      response.send("Se envió un nuevo token a tu email");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  };
  static validateToken = async (request: Request, response: Response) => {
    try {
      const { token } = request.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return response.status(404).json({ error: error.message });
      }
      response.send("Token valido, Define tu nueva contraseña");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  };
  static updatePasswordWithToken = async (
    request: Request,
    response: Response
  ) => {
    try {
      const { token } = request.params;
      const tokenExist = await Token.findOne({ token });
      const { password } = request.body;
      if (!tokenExist) {
        const error = new Error("Token no valido");
        return response.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      response.send("La contraseña de actualizo correctamente");
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  };
  static user = async (
    request: Request,
    response: Response
  ) => {
    return response.json(request.user)
  };

  //# Profile
  static updateProfile = async (
    request: Request,
    response: Response
  ) => {
    const { name, email } = request.body
    const user = request.user
    const userExist = await User.findOne({email})
    if(userExist && user.email.toString() !== email.toString()){
      const error = new Error("Ese email ya esta en uso");
      return response.status(409).json({error:error.message});
    }
    user.name = name;
    user.email = email
    try { 
      await user.save()
      response.send("Perfil actualizado correctamente")
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  }
  static updatePassword = async (
    request: Request,
    response: Response
  ) => {
    const { passwordCurrency, password} = request.body
    const user = await User.findById(request.user.id);
    const isPasswordCorrect = await checkPassword(passwordCurrency, user.password)
    if(!isPasswordCorrect){
      const error = new Error("Contraseña incorrecta")
      return response.status(401).json({error:error.message})
    }

    try { 
      user.password = await hashPassword(password)
      await user.save()
      response.send("Contraseña actualizada correctamente")
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  }
  static checkPassword = async (
    request: Request,
    response: Response
  ) =>{
    const { password} = request.body
    const user = await User.findById(request.user.id);
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect){
      const error = new Error("Contraseña incorrecta")
      return response.status(401).json({error:"Contraseña incorrecta"})
    }
    try { 
      response.send("Contraseña correcta")
    } catch (error) {
      response.status(500).json({ error: "Hubo un error" });
    }
  }
}
