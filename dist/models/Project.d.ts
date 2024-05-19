/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose, { Document, PopulatedDoc, Types } from "mongoose";
import { I_Task } from "./Task";
import { I_User } from "./User";
export type ProjectType = Document & {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<I_Task & Document>[];
    manager: PopulatedDoc<I_User & Document>;
    team: PopulatedDoc<I_User & Document>[];
};
declare const Project: mongoose.Model<ProjectType, {}, {}, {}, mongoose.Document<unknown, {}, ProjectType> & mongoose.Document<any, any, any> & {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<I_Task & Document>[];
    manager: PopulatedDoc<I_User & Document>;
    team: PopulatedDoc<I_User & Document>[];
} & {
    _id: Types.ObjectId;
}, any>;
export default Project;
