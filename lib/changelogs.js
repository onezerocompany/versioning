"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changelog = exports.ChangelogType = void 0;
const change_categories_1 = require("./change-categories");
/**
 * Defines who gets to see the changelog
 */
var ChangelogType;
(function (ChangelogType) {
    ChangelogType["internal"] = "internal";
    ChangelogType["external"] = "external";
})(ChangelogType = exports.ChangelogType || (exports.ChangelogType = {}));
/**
 * Generates a changelog for a list of changes
 * @param {ChangelogType} type the type of this changelog
 * @param {Change[]} changes a list of changes to include in this changelog
 * @return {string} the generated changelog
 */
function changelog(type, changes) {
    const filteredChanges = changes
        .filter((change) => change.category.changelogType == type);
    const filteredCategories = change_categories_1.categories.filter((category) => filteredChanges.some((change) => change.category.keys[0] == category.keys[0]));
    let changelog = '';
    for (const category of filteredCategories) {
        changelog += category.title + ':\n';
        const categoryChanges = filteredChanges
            .filter((change) => change.category.keys[0] == category.keys[0]);
        for (const change of categoryChanges) {
            changelog += '- ' + change.content + '\n';
        }
        changelog += '\n';
    }
    return changelog.trim();
}
exports.changelog = changelog;
//# sourceMappingURL=changelogs.js.map