"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseConfig {
}
DatabaseConfig.URI = `mongodb://${process.env.ENV_DOCKER === "true" ? "mongo:27017" : "localhost"}/scrumbs-website`;
exports.default = DatabaseConfig;
//# sourceMappingURL=DatabaseConfig.js.map