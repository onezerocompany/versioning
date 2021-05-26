"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const version_item_1 = require("./version-item");
const input = {
    version: core_1.getInput('version'),
    commits: JSON.parse(core_1.getInput('commits')),
    track: core_1.getInput('track'),
    build: Number(core_1.getInput('build')),
};
core_1.setOutput('version', JSON.stringify(new version_item_1.Version(input)));
//# sourceMappingURL=index.js.map