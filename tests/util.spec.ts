import { strictEqual, doesNotMatch } from "assert";
import * as util from "../src/util"
const validResponse = {
    key: 'test+key.mp4',
    keyWithPrefix: '%22elephants%22/test+key.mp4'
}
const invalidResponse = {
    key: 'test+key',
    keyWithPrefix: '"elephants"/test+key.jpg'
}
const fileTypes = ["mov", "mpg", "mpeg", "mp4", "wmv", "avi"]

describe("Testing utility functions", () => {
    it("should be able to decode a key", () => {
        strictEqual(util.decodeKey(validResponse.keyWithPrefix), '"elephants"/test key.mp4');
        strictEqual(util.decodeKey(validResponse.key), 'test key.mp4');
        doesNotMatch(util.decodeKey(validResponse.keyWithPrefix), /^\%22elephants\%22\/test\+key\.mp4/ig);
    });
    it("should be able to get a filename without an extension", () => {
        let decodedKey = util.decodeKey(validResponse.key)
        strictEqual(util.getFileName(decodedKey), "test key")
        decodedKey = util.decodeKey(validResponse.keyWithPrefix)
        strictEqual(util.getFileName(decodedKey), '"elephants"/test key')
    })
    it("should validate file types", () => {
        let decodedKey = util.decodeKey(validResponse.keyWithPrefix)
        strictEqual(util.isValidType(decodedKey, fileTypes), true);
        decodedKey = util.decodeKey(invalidResponse.keyWithPrefix)
        strictEqual(util.isValidType(decodedKey, fileTypes), false);
    });
    it("should get a new filename", () => {
        let decodedKey = util.decodeKey(validResponse.keyWithPrefix)
        strictEqual(util.getNewName(decodedKey, "png"), '"elephants"/test key.png');
        decodedKey = util.decodeKey(validResponse.key)
        strictEqual(util.getNewName(decodedKey, "png"), 'test key.png');
        decodedKey = util.decodeKey(invalidResponse.key)
        strictEqual(util.getNewName(decodedKey, "png"), 'test key.png');

    })
});