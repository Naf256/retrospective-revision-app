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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const revisionTasks = yield prisma.task.findMany({
            where: {
                creatorId: '643660d0ec556c3a263e55f1',
                revision_dates: {
                    has: 'Thursday, April 20, 2023'
                }
            }
        });
        const today = new Date();
        const f = new Intl.DateTimeFormat("en-bn", {
            dateStyle: "full"
        });
        console.log(f.format(today));
        const todayTasks = yield prisma.task.findMany({
            where: {
                creatorId: '643660d0ec556c3a263e55f1',
                creation_date: f.format(today)
            }
        });
        const tasks = {
            todayTasks,
            revisionTasks
        };
        console.log(tasks);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('something went wrong');
    yield prisma.$disconnect();
}));
