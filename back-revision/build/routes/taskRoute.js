"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const taskRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ('token' in req) {
        const token = req.token;
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const decoded = yield jwt.verify(token, 'secret');
        if (typeof decoded !== 'string') {
            const f = new Intl.DateTimeFormat("en-bn", {
                dateStyle: "full"
            });
            const d = new Date();
            const today = yield prisma.task.findMany({
                where: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    creatorId: decoded.id,
                    creation_date: f.format(d)
                },
                select: {
                    id: true,
                    name: true,
                }
            });
            const revision = yield prisma.task.findMany({
                where: {
                    creatorId: decoded.id,
                    revision_dates: {
                        has: f.format(d)
                    }
                },
                select: {
                    id: true,
                    name: true,
                }
            });
            return res.status(200).json({
                today,
                revision
            });
        }
    }
    return res.status(400).json({
        error: 'something wrong with the auth'
    });
}));
// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const id = req.body.id;
    if ('token' in req) {
        const token = req.token;
        const decoded = jwt.verify(token, 'secret');
        const f = new Intl.DateTimeFormat("en-bn", {
            dateStyle: "full"
        });
        const today = new Date();
        const seven = new Date();
        const fourteen = new Date();
        const tweentyOne = new Date();
        const thirty = new Date();
        const arr = [
            f.format(seven.setDate(today.getDate() + 7)),
            f.format(fourteen.setDate(today.getDate() + 14)),
            f.format(tweentyOne.setDate(today.getDate() + 21)),
            f.format(thirty.setDate(today.getDate() + 30))
        ];
        if (typeof decoded !== 'string') {
            const task = yield prisma.task.create({
                data: {
                    creator: {
                        connect: {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            id: decoded.id,
                        }
                    },
                    id: id,
                    name: name,
                    creation_date: f.format(today),
                    revision_dates: [...arr]
                },
                select: {
                    id: true,
                    name: true,
                }
            });
            return res.status(201).json(task);
        }
    }
    return res.status(400).json({
        error: 'cannot create the task'
    });
}));
// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deletedTask = yield prisma.task.delete({
        where: {
            id: id
        },
        select: {
            name: true
        }
    });
    if (deletedTask.name) {
        return res.status(204).json({
            message: 'task is deleted',
            name: deletedTask.name
        });
    }
    return res.status(400).send('deletion error');
}));
// eslint-disable-next-line @typescript-eslint/no-misused-promises
taskRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const id = req.params.id;
    const updatedTask = yield prisma.task.update({
        where: {
            id: id
        },
        data: {
            name: name
        },
        select: {
            id: true,
            name: true,
        }
    });
    return res.status(200).json(updatedTask);
}));
exports.default = taskRouter;
