"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const middleware_1 = require("./utils/middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('dist'));
app.use('/api/task', middleware_1.tokenExtractor, taskRoute_1.default);
app.use('/api/user', userRoute_1.default);
app.listen(3003, () => {
    console.log(`server listening to port: 3003`);
});
