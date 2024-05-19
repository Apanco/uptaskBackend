"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputsErrors = void 0;
const express_validator_1 = require("express-validator");
const handleInputsErrors = (request, response, next) => {
    let errors = (0, express_validator_1.validationResult)(request); //Obtiene los errores
    if (!errors.isEmpty()) { //Verifica si no esta vacio
        return response.status(400).json({ errors: errors.array() }); //Retorna un estado 400 y los errores en json
    }
    next(); //Permite pasar al siguiente middleware
};
exports.handleInputsErrors = handleInputsErrors;
//# sourceMappingURL=validation.js.map