"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (request, response, next) => {
    const bearer = request.headers.authorization;
    if (!bearer) {
        const error = new Error('No autorizado');
        return response.status(401).json({ error: error.message });
    }
    const token = bearer.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded.id) {
            const user = await User_1.default.findById(decoded.id).select('_id name email');
            if (user) {
                request.user = user;
                next();
            }
            else {
                response.status(500).json({ error: "Token no valido" });
            }
        }
    }
    catch (error) {
        response.status(500).json({ error: "Token no valido" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map