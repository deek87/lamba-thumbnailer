export const decodeKey = (key: string) => decodeURIComponent(key).replace(/\+/g, " ");

export const getNewName = (key: string, type: string) => { if (key.match(/\.\w+$/)) return key.replace(/\.\w+$/, "." + type); return key + "." + type; };

export const getFileName = (key: string) => key.replace(/\.\w+$/, "");

export const isValidType = (filename: string, types: string[]) => { const type = filename.toLowerCase().match(/\.\w+$/); if (!type) return false; const ft: string = type[0].substr(1); return types.indexOf(ft) !== -1; };
