"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionNumber = exports.VersionTrack = exports.bumpOrder = exports.VersionBump = void 0;
var VersionBump;
(function (VersionBump) {
    VersionBump["patch"] = "patch";
    VersionBump["minor"] = "minor";
    VersionBump["major"] = "major";
    VersionBump["none"] = "none";
})(VersionBump = exports.VersionBump || (exports.VersionBump = {}));
exports.bumpOrder = [
    VersionBump.none, VersionBump.patch, VersionBump.minor, VersionBump.major,
];
var VersionTrack;
(function (VersionTrack) {
    VersionTrack["live"] = "live";
    VersionTrack["beta"] = "beta";
    VersionTrack["alpha"] = "alpha";
})(VersionTrack = exports.VersionTrack || (exports.VersionTrack = {}));
/**
 * Reflects a version number and provides methods to alter it
 */
class VersionNumber {
    /**
     * creates a {VersionNumber} from individual version number components
     * @param {number} major major section of the version number
     * @param {number} minor minor section of the version number
     * @param {number} patch patch section of the version number
     * @param {VersionTrack} track type of version
     * @param {number} iteration how many times this version has been build
     */
    constructor(major = 1, minor = 0, patch = 0, track = VersionTrack.live, iteration = 1) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.track = track;
        this.iteration = iteration;
        const onlyNumber = `${this.major}.${this.minor}.${this.patch}`;
        const trackLabel = this.track == VersionTrack.live ? '' : `-${this.track}`;
        const withoutBuild = `${onlyNumber}${trackLabel}`;
        this.versionString = {
            full: this.track == VersionTrack.live ?
                withoutBuild : `${withoutBuild}/#${this.iteration}`,
            withoutBuild, onlyNumber,
        };
    }
    /**
     * bumps a version by a specified amount
     * @param {VersionBump} bump amount to bump the version by
     * @return {VersionNumber} bumped version
     */
    bumped(bump) {
        const isMajor = bump == VersionBump.major;
        const isMinor = bump == VersionBump.minor;
        const isPatch = bump == VersionBump.patch;
        return new VersionNumber(isMajor ? this.major + 1 : this.major, isMajor ? 0 : isMinor ? this.minor + 1 : this.minor, (isMajor || isMinor) ? 0 : isPatch ? this.patch + 1 : this.patch, this.track, this.iteration);
    }
    /**
     * converts a version string to a VersionNumber object
     * @param {string} versionString version string to convert
     * @param {VersionTrack} track set the track for this version
     * @param {number} iteration set the build for this version
     * @return {VersionNumber}
     */
    static fromVersionString(versionString = undefined, track = undefined, iteration = undefined) {
        var _a, _b, _c, _d;
        const components = (versionString !== null && versionString !== void 0 ? versionString : '').split('.')
            .flatMap((component) => component.split('-')
            .flatMap((subComponent) => subComponent.split('/')));
        return new VersionNumber(Number(components[0] != '' ? components[0] : '1'), Number((_a = (components[1] != '' ? components[1] : '0')) !== null && _a !== void 0 ? _a : '0'), Number((_b = (components[2] != '' ? components[2] : '0')) !== null && _b !== void 0 ? _b : '0'), (_c = (track !== null && track !== void 0 ? track : components[3])) !== null && _c !== void 0 ? _c : VersionTrack.live, iteration !== null && iteration !== void 0 ? iteration : Number(((_d = components[4]) !== null && _d !== void 0 ? _d : '1').replace(/[^0-9]/, '')));
    }
}
exports.VersionNumber = VersionNumber;
//# sourceMappingURL=version-number.js.map