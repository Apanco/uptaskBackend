"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const conectDB = async () => {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.DATABASE_URL);
        const url = `${connection.host} : ${connection.port}`;
        console.log(colors_1.default.magenta.bold(`MongoDB conectado en : ${url}`));
    }
    catch (error) {
        // console.log(colors.red(error))
        console.log(colors_1.default.red("Error al conectar la base de datos"));
        process.exit(1);
    }
};
exports.conectDB = conectDB;
//# sourceMappingURL=db.js.map