import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

//simple collection text search
export default (collection, searchText) => {
    if (!Array.isArray(collection)) {
        return [];
    }

    return searchText ? collection.filter((object) => {
        let isTextPresent = false;

        const textArray = extractAndFlattenTextFromObject(object);

        for (let index = 0; index < textArray.length; index++) {
            const element = textArray[index];
            
            if (element.includes(searchText.toString().toLowerCase())) {
                isTextPresent = true;
                break;
            }
        }
        
        return isTextPresent;
    }) : collection;
}

const extractAndFlattenTextFromObject = (object) => {
    const textArray = [];

    if (!isPlainObject(object)) {
        return textArray;
    }

    let objectValues = Object.values(object);
    
    while (objectValues.length) {
        const element = objectValues[0];

        if (isPlainObject(element)) {
            objectValues = objectValues.concat(Object.values(element));
        } else if (isFunction(element.toString)) {
            textArray.push(element.toString().toLowerCase());
        }

        objectValues.shift();
    }

    return textArray;
}