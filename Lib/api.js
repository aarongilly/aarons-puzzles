const url = "https://script.google.com/macros/s/AKfycbxEMiKvUvMsmtYTQKv57QMBxjmdNbooOwBNkD2IOoqrqEakxmCLPDFHh-s9kp2NsB6Y/exec";

/**
 * Get high scores for a game
 * @param {string} gameName name of sheet, no spaces, case insensitive
 * @returns 
 */
export function fetchData(gameName) {
    return fetch(url + "?game=" + encodeURIComponent(gameName))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

/**
 * Post comments or score data to a sheet
 * @param {string} sheet name of sheet to be updated
 * @param {string[]} data values in columns 2 and beyond (date supplied automatically in col 1)
 * @returns 
 */
export function postData(sheet, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify({sheet: sheet, data: data})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}