"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changesFromMessage = void 0;
const change_1 = require("./change");
const change_categories_1 = require("./change-categories");
/**
 * convert commit message to list of changes
 * @param {string} message message to convert to changes
 * @param {string} ref reference for the commit this message is from
 * @return {Change[]}
 */
function changesFromMessage(message, ref) {
    return message.split('\n').map((line) => {
        let change = undefined;
        for (const category of change_categories_1.categories) {
            for (const key of category.keys) {
                const keyMarker = `[${key}]>`;
                if (line.includes(keyMarker)) {
                    const content = line.replace(keyMarker, '').trim();
                    change = new change_1.Change(content, category, ref);
                }
            }
        }
        return change;
    }).filter((change) => change);
}
exports.changesFromMessage = changesFromMessage;
//# sourceMappingURL=commit.js.map