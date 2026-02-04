/**
 * Database.js
 * Handles all interactions with the Google Spreadsheet.
 */

// Hardcoded ID from the project we just created
var SPREADSHEET_ID = '1tAPtBAXPLeSNKMaxIYlPWc7-btotPZyAeu69eo0jzA4';

var Database = (function () {

    /**
     * Helper to get the spreadsheet instance.
     */
    function getSS() {
        // Always try opening by ID first as it's most reliable in Web App context
        if (SPREADSHEET_ID) {
            return SpreadsheetApp.openById(SPREADSHEET_ID);
        }
        try {
            return SpreadsheetApp.getActiveSpreadsheet();
        } catch (e) {
            throw new Error("No active spreadsheet found. Please bind script to sheet or set SPREADSHEET_ID.");
        }
    }

    /**
     * Generic helper to get data from a sheet as an array of objects.
     * Assumes Row 1 is headers.
     */
    function _getSheetData(sheetName) {
        const ss = getSS();
        const sheet = ss.getSheetByName(sheetName);
        if (!sheet) return [];

        // Check if sheet is empty
        if (sheet.getLastRow() < 2) return [];

        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

        return data.map(row => {
            let obj = {};
            headers.forEach((header, index) => {
                // Simple camelCase conversion or just use header as key
                obj[header] = row[index];
            });
            return obj;
        });
    }

    return {

        getSiteConfig: function () {
            // Logic: config sheet has Key, Value columns
            const ss = getSS();
            const sheet = ss.getSheetByName('site_config');
            if (!sheet) return {};

            const data = sheet.getDataRange().getValues(); // Read all
            // Assuming Row 1 is headers: [Key, Value, Description]
            const config = {};
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    config[data[i][0]] = data[i][1];
                }
            }
            return config;
        },

        getMenu: function () {
            const allMenus = _getSheetData('menu');
            // Filter visible? We can assume all rows in 'menu' are items.
            // Sort by 'order'
            return allMenus.sort((a, b) => (a.order || 0) - (b.order || 0));
        },

        getMainLayout: function () {
            const layout = _getSheetData('main_layout');
            // Filter visible and sort by order
            return layout
                .filter(item => item.visible === true || item.visible === 'TRUE')
                .sort((a, b) => (a.order || 0) - (b.order || 0));
        },

        getNews: function (category, limit) {
            let news = _getSheetData('news');

            // Filter published
            news = news.filter(item => item.published === true || item.published === 'TRUE');

            if (category) {
                news = news.filter(item => item.category === category);
            }

            // Sort desc by date
            news.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (limit) {
                return news.slice(0, limit);
            }
            return news;
        },

        getGallery: function (album) {
            let photos = _getSheetData('gallery');
            if (album) {
                photos = photos.filter(p => p.album === album);
            }
            return photos;
        },

        getPageContent: function (pageKey) {
            // A mechanism to fetch simple HTML content chunks stored in a 'pages' sheet
            // Headers: [key, title, content]
            const pages = _getSheetData('pages');
            const page = pages.find(p => p.key === pageKey);
            return page || { title: 'Not Found', content: '' };
        },

        addInquiry: function (data) {
            const ss = getSS();
            const sheet = ss.getSheetByName('inquiry');
            if (!sheet) throw new Error("Inquiry sheet missing");

            sheet.appendRow([
                new Date(),
                data.name,
                data.phone,
                data.email,
                data.grade,
                data.message,
                'New' // status
            ]);
            return { success: true };
        }
    };

})();
