import { Router, request } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();
//$ EndPoints

//# -> Create a user [C]
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  body("email")
    .notEmpty()
    .withMessage("El email no puede ir vacio")
    .isEmail()
    .withMessage("Email no valido"),
  handleInputsErrors,
  AuthController.createAccount
);
//# Confirm the email
router.post(
  "/confirm",
  body("token").notEmpty().withMessage("El token no puede ir vacio "),
  handleInputsErrors,
  AuthController.confirAccount
);
//# ->  Login
router.post(
  "/login",
  body("email").isEmail().withMessage("E-mail no valido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputsErrors,
  AuthController.login
);
//# ->  request tokem
router.post(
  "/request-code",
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputsErrors,
  AuthController.requestConfirmationCode
);
//# ->  recupare password
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no valido"),
  handleInputsErrors,
  AuthController.forgotPassword
);
router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacio "),
  handleInputsErrors,
  AuthController.validateToken
);
router.post(
  "/update-password/:token",
  param('token').isNumeric().withMessage('Token no valido'),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputsErrors,
  AuthController.updatePasswordWithToken
);

//# -
router.get("/user",
  authenticate,
  AuthController.user
)


//# ->  profile
router.put("/profile",
  authenticate,
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("email")
  .notEmpty().withMessage("El email no puede ir vacio")
  .isEmail().withMessage("Email no valido"),
  handleInputsErrors,
  AuthController.updateProfile
)
router.post("/update-password",
  authenticate,
  body("passwordCurrency").notEmpty().withMessage("Es obligatorio ingresar su contraseña actual"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"),
  body("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputsErrors,
  AuthController.updatePassword
)

router.post("/check-password",
  authenticate,
  body("password").notEmpty().withMessage("Es obligatorio ingresar su contraseña"),
  handleInputsErrors,
  AuthController.checkPassword
)

export default router;
