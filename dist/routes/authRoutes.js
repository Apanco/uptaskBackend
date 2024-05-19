"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
//$ EndPoints
//# -> Create a user [C]
router.post("/create-account", (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre no puede ir vacio"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
        throw new Error("Las contraseñas no son iguales");
    }
    return true;
}), (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("El email no puede ir vacio")
    .isEmail()
    .withMessage("Email no valido"), validation_1.handleInputsErrors, AuthController_1.AuthController.createAccount);
//# Confirm the email
router.post("/confirm", (0, express_validator_1.body)("token").notEmpty().withMessage("El token no puede ir vacio "), validation_1.handleInputsErrors, AuthController_1.AuthController.confirAccount);
//# ->  Login
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no valido"), (0, express_validator_1.body)("password").notEmpty().withMessage("La contraseña es obligatoria"), validation_1.handleInputsErrors, AuthController_1.AuthController.login);
//# ->  request tokem
router.post("/request-code", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no valido"), validation_1.handleInputsErrors, AuthController_1.AuthController.requestConfirmationCode);
//# ->  recupare password
router.post("/forgot-password", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no valido"), validation_1.handleInputsErrors, AuthController_1.AuthController.forgotPassword);
router.post("/validate-token", (0, express_validator_1.body)("token").notEmpty().withMessage("El token no puede ir vacio "), validation_1.handleInputsErrors, AuthController_1.AuthController.validateToken);
router.post("/update-password/:token", (0, express_validator_1.param)('token').isNumeric().withMessage('Token no valido'), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
        throw new Error("Las contraseñas no son iguales");
    }
    return true;
}), validation_1.handleInputsErrors, AuthController_1.AuthController.updatePasswordWithToken);
//# -
router.get("/user", auth_1.authenticate, AuthController_1.AuthController.user);
//# ->  profile
router.put("/profile", auth_1.authenticate, (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre no puede ir vacio"), (0, express_validator_1.body)("email")
    .notEmpty().withMessage("El email no puede ir vacio")
    .isEmail().withMessage("Email no valido"), validation_1.handleInputsErrors, AuthController_1.AuthController.updateProfile);
router.post("/update-password", auth_1.authenticate, (0, express_validator_1.body)("passwordCurrency").notEmpty().withMessage("Es obligatorio ingresar su contraseña actual"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta [min: 8 caracteres]"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value != req.body.password) {
        throw new Error("Las contraseñas no son iguales");
    }
    return true;
}), validation_1.handleInputsErrors, AuthController_1.AuthController.updatePassword);
router.post("/check-password", auth_1.authenticate, (0, express_validator_1.body)("password").notEmpty().withMessage("Es obligatorio ingresar su contraseña"), validation_1.handleInputsErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map