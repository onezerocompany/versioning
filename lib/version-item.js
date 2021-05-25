"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const changelogs_1 = require("./changelogs");
const version_number_1 = require("./version-number");
const commit_1 = require("./commit");
/**
 * contains all the information
 */
class Version {
    /**
     * creates a version
     * @param {VersionInput} input input from a version creation request
     */
    constructor(input) {
        let bump = version_number_1.VersionBump.none;
        this.changes = input.commits.flatMap((commit) => commit_1.changesFromMessage(commit.message, commit.ref));
        this.changelogs = {
            internal: changelogs_1.changelog(changelogs_1.ChangelogType.internal, this.changes),
            external: changelogs_1.changelog(changelogs_1.ChangelogType.external, this.changes),
        };
        let triggersRelease = false;
        let triggersTests = false;
        for (const change of this.changes) {
            const oldIndex = version_number_1.bumpOrder.indexOf(bump);
            const index = version_number_1.bumpOrder.indexOf(change.category.versionBump);
            if (index > oldIndex)
                bump = change.category.versionBump;
            if (change.category.triggers.release)
                triggersRelease = true;
            if (change.category.triggers.tests)
                triggersTests = true;
        }
        this.triggers = {
            release: triggersRelease,
            tests: triggersTests,
        };
        this.version = version_number_1.VersionNumber
            .fromVersionString(input.version, input.track, input.build)
            .bumped(bump);
    }
}
exports.Version = Version;
//# sourceMappingURL=version-item.js.map