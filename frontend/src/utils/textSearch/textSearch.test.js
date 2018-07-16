import textSearch from './index.js';

describe('textSearch', () => {
    const searchTerm = "look";
    let collection;

    beforeEach(() => {
        collection = [
            {
                messageId: 1,
                type: "insight",
                recievedAt: "2018-07-06T23:12:36.639Z",
                properties: {
                    title: "entered segment"
                }
            },
            {   
                messageId: 2,
                type: "Page",
                recievedAt: "2018-07-06T23:12:36.639Z",
                properties: {
                    title: "entered website"
                }
            },
            {   
                messageId: 5,
                type: "insight",
                recievedAt: "2018-07-06T23:12:36.639Z",
                properties: {
                    title: "entered segment"
                }
            }
        ];
    })

    it('should handle an absent collections', () => {
        const absentCollections = [undefined, null];
        let result;

        absentCollections.forEach((col) => {
            result = textSearch(col, searchTerm);
            expect(result).toEqual([]);
        })
    });

    it('should handle non array collections', () => {
        const absentCollections = [1, "String", new Date(), {"object": 1}, new Set()];
        let result;

        absentCollections.forEach((col) => {
            result = textSearch(col, searchTerm);
            expect(result).toEqual([]);
        });
    });

    it('should handle an undefined search terms', () => {
        const searchTerms = [undefined, null, ""];
        let result;

        searchTerms.forEach((term) => {
            result = textSearch(collection, term);
            expect(result).toEqual(collection);
        })
    });


    it('should handle non-string search terms', () => {
        const searchTerms = [111, "String", new Date(), {"object": 1}, new Set()];
        let result;

        searchTerms.forEach((term) => {
            result = textSearch(collection, term);
            expect(result).toEqual([]);
        })
    });

    it('should find deeply nested strings and return matching object collection', () => {
        const searchTerm = "website";
        let result;

        result = textSearch(collection, searchTerm);
        expect(result).toEqual(collection.slice(1,2));
    });

    it('should find multiple string matches and return object collection', () => {
        const searchTerm = "segment";
        let result;

        result = textSearch(collection, searchTerm);
        collection.splice(1,1);
        expect(result).toEqual(collection);
    });

    it('should find numbers and reurn matching object collection', () => {
        const searchTerm = "5";
        let result;

        result = textSearch(collection, searchTerm);
        expect(result).toEqual(collection.slice(2));
    });
});