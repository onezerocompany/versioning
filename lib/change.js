"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Change = void 0;
const crypto_1 = require("crypto");
/**
 * Represents a single change in a changlog
 */
class Change {
    /**
     * Creates a change
     * @param {string} content content of this change
     * @param {ChangeCategory} category category for this change
     * @param {string} commit commit ref for this change
     */
    constructor(content, category, commit) {
        this.ref = crypto_1.createHash('md5').update(commit + content).digest('base64');
        this.content = content;
        this.category = category;
    }
}
exports.Change = Change;
//# sourceMappingURL=change.js.map