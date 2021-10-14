/**
 * This function decodes an s3 url encoded string replacing + with spaces
 * @param {string} key s3 url-encoded string
 * @returns {string} decoded string
 */
export const decodeKey = (key: string) => decodeURIComponent(key).replace(/\+/g, " ");

/**
 * This function returns the new filename with the new extension
 * @param {string} key The key/filename of the original file
 * @param {string} type The filetype of the screenshot/thumbnail
 * @returns {string} the new filename with the correct extension
 */
export const getNewName = (key: string, type: string) => { if (key.match(/\.\w+$/)) return key.replace(/\.\w+$/, "." + type); return key + "." + type; };

/**
 * This function gets the filename without an extension
 * @param key The key/filename of the original file
 * @returns {string} filename without any extension
 */
export const getFileName = (key: string) => key.replace(/\.\w+$/, "");

/**
 * This function checks if a filename has a type in the list of allowed extensions
 * @param filename The filename to be checked
 * @param types The array of filetypes/extensions to be checked against
 * @returns {boolean} true if the filename is of the correct type
 */
export const isValidType = (filename: string, types: string[]) => { const type = filename.toLowerCase().match(/\.\w+$/); if (!type) return false; const ft: string = type[0].substr(1); return types.indexOf(ft) !== -1; };
