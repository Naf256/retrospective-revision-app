"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = void 0;
// eslint-disable-next-line @typescript-eslint/ban-types
const tokenExtractor = (req, _res, next) => {
    const auth = req.get('authorization');
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        req.token = auth.substring(7);
    }
    else {
        req.token = null;
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
