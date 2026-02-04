/**
 * Setup.js
 * One-time setup script to initialize the Spreadsheet structure.
 * Run `initialSetup()` from the GAS editor.
 */

function initialSetup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
        throw new Error("This script must be bound to a Google Sheet.");
    }

    // 1. site_config
    initSheet(ss, 'site_config', ['key', 'value', 'description'], [
        ['site_title', 'Grace Christian School', 'Website Title'],
        ['site_slogan', 'Coram Deo - Before the face of God', 'Main Slogan'],
        ['main_color', '#1E3A8A', 'Primary Blue Color'],
        ['secondary_color', '#FFA500', 'Secondary Orange Color'],
        ['admin_email', Session.getActiveUser().getEmail(), 'Admin Notification Email'],
        ['phone', '070-7430-2777', 'Contact Phone'],
        ['address', '경기도 안양시 동안구 동안로 70', 'Address']
    ]);

    // 2. menu
    initSheet(ss, 'menu', ['id', 'name', 'url', 'order', 'parent_id'], [
        ['home', 'Home', '?page=home', 1, ''],
        ['about', '학교소개', '?page=about', 2, ''],
        ['admission', '입학안내', '?page=admission', 3, ''],
        ['news', '학교소식', '?page=news', 4, ''],
        ['gallery', '갤러리', '?page=gallery', 5, ''],
        ['contact', '문의하기', '?page=contact', 6, '']
    ]);

    // 3. pages (Static content)
    initSheet(ss, 'pages', ['key', 'title', 'content'], [
        ['greeting', '인사말', '<h1>Welcome to GCS</h1><p>School principal greeting here...</p>'],
        ['vision', '교육이념', '<h1>Coram Deo</h1><p>Our vision...</p>']
    ]);

    // 4. news
    initSheet(ss, 'news', ['id', 'category', 'title', 'content', 'date', 'views', 'image_url', 'published'], [
        [1, '공지사항', '홈페이지 오픈 안내', '새로운 홈페이지가 오픈되었습니다.', new Date(), 0, '', true]
    ]);

    // 5. gallery
    initSheet(ss, 'gallery', ['id', 'album', 'image_url', 'description', 'date'], []);

    // 6. inquiry
    initSheet(ss, 'inquiry', ['timestamp', 'name', 'phone', 'email', 'grade', 'message', 'status'], []);

    // 7. main_layout (Dynamic Home Page Config)
    // Added: background_color, text_color
    initSheet(ss, 'main_layout', ['section_id', 'order', 'visible', 'title', 'subtitle', 'background_url', 'background_color', 'text_color', 'button_text', 'button_link'], [
        ['hero', 1, true, 'Coram Deo - 하나님 앞에서', '개혁주의 신앙 원리에 입각한 전인적 기독교 교육', 'https://source.unsplash.com/random/1600x900/?school,christian', '', '#ffffff', '입학 상담 신청', '?page=admission'],
        ['features', 2, true, '그레이스기독학교의 특징', 'Why GCS?', '', '#ffffff', '#333333', '', ''],
        ['news', 3, true, '학교 소식', 'LATEST NEWS', '', '#f8f9fa', '#333333', '소식 더보기', '?page=news']
    ]);

    Logger.log("Setup Complete! The spreadsheet is ready.");
}

function initSheet(ss, sheetName, headers, sampleData) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        // Set headers
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#efefef');
        // Lock header row
        sheet.setFrozenRows(1);
    }

    // Add sample data if empty (only checking row 2)
    if (sheet.getLastRow() < 2 && sampleData && sampleData.length > 0) {
        sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
    }
}
