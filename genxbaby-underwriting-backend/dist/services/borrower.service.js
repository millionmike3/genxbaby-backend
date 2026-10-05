"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowerService = void 0;
const client_1 = require("../db/client");
exports.borrowerService = {
    async create(data) {
        return client_1.prisma.borrower.create({ data });
    },
};
