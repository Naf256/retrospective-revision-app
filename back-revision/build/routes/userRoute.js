"use strict";
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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userRouter = express_1.default.Router();
// handles logging in the user
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            username: username
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const passwordCorrect = user === null
        ? false
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        : password === user.password;
    if (passwordCorrect && user) {
        const userForToken = {
            username: user.username,
            id: user.id
        };
        const token = jsonwebtoken_1.default.sign(userForToken, 'secret');
        return res.json({
            token: token,
            username: user.username,
            id: user.id
        });
    }
    return res.json('username/password is incorrect');
}));
// creating a new user
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            username: username
        }
    });
    if (user) {
        return res.json('try a different username, it already exists');
    }
    const newUser = yield prisma.user.create({
        data: {
            username: username,
            password: password
        }
    });
    if (newUser) {
        const userForToken = {
            username: newUser.username,
            id: newUser.id
        };
        const token = jsonwebtoken_1.default.sign(userForToken, 'secret');
        return res.status(201).json({
            token: token,
            username: newUser.username,
            id: newUser.id
        });
    }
    return res.json('something went wrong');
}));
// deletes a user from the database
// eslint-disable-next-line @typescript-eslint/no-misused-promises
userRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paramId = req.params.id;
    const deletedUser = yield prisma.user.delete({
        where: {
            id: paramId
        },
        select: {
            id: true
        }
    });
    if (deletedUser.id) {
        return res.status(204).send('successfully deleted');
    }
    return res.status(400).send('something went wrong');
}));
exports.default = userRouter;
