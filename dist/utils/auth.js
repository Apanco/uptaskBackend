"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    //# ->  Hashear password
    const salt = await bcrypt_1.default.genSalt(10); //Valor aleatorio y unco que se genera para cada contraseñaa
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const checkPassword = async (enteredPassword, storeHash) => {
    return await bcrypt_1.default.compare(enteredPassword, storeHash);
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=auth.js.map