export const decodeKey = (key: string)=>decodeURIComponent(key).replace(/\+/g, " ");

export const getPath = (key: string, type: string)=>key.replace(/\.\w+$/, "." + type);