
export const parseObjectProperties = (obj, parseStruct, viewStruct) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (obj[key].type && obj[key].type === 'struct') {
                // This indicates a screen view
                parseStruct(obj[key], key, viewStruct);
            }
            parseObjectProperties(obj[key], parseStruct, viewStruct);
        }
    }
}
