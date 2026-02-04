/**
 * Code.js
 * Main entry point for the Grace Christian School (GCS) Website.
 * Handles HTTP requests and exposes server-side functions to the client.
 */

/* =========================================================================
 * 1. HTTP HANDLERS
 * ========================================================================= */

/**
 * Serves the web app.
 * @param {Object} e - Event parameter containing query parameters.
 */
function doGet(e) {
  // Determine which page ID to load. Default to 'home'.
  // In a Single Page App (SPA) approach, we often just load index and handle routing on client,
  // but we can pass initial state here to speed up LCP.
  var pageId = e.parameter.page || 'home';

  var template = HtmlService.createTemplateFromFile('index');

  // Inject server-side data into the template for fast first paint
  // This avoids a round-trip "google.script.run" call for basic layout data.
  try {
    template.config = Database.getSiteConfig();
    template.menu = Database.getMenu();
    template.mainLayout = Database.getMainLayout();
  } catch (error) {
    // Fallback if DB not ready
    template.config = { site_title: 'Grace Christian School', main_color: '#1E3A8A' };
    template.menu = [];
    template.mainLayout = [];
    Logger.log("Error loading initial data: " + error);
  }

  template.initialPageId = pageId;

  return template.evaluate()
    .setTitle(template.config.site_title || 'Grace Christian School')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper to include HTML partials (css, js).
 * Usage: <?!= include('css/style'); ?> in index.html
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/* =========================================================================
 * 2. API ENDPOINTS (Client -> Server)
 * ========================================================================= */

/**
 * wrapper for getting news
 */
function getNews(category, limit) {
  return Database.getNews(category, limit);
}

/**
 * wrapper for getting gallery
 */
function getGallery(album) {
  return Database.getGallery(album);
}

/**
 * wrapper for submitting inquiry
 */
function submitInquiry(data) {
  try {
    var result = Database.addInquiry(data);
    if (result.success) {
      // Send email notification
      const config = Database.getSiteConfig();
      const adminEmail = config.admin_email || Session.getActiveUser().getEmail();

      MailApp.sendEmail({
        to: adminEmail,
        subject: '[GCS Website] New Inquiry Received',
        body: `
          New inquiry from: ${data.name}
          Phone: ${data.phone}
          Email: ${data.email}
          Grade: ${data.grade}
          Message: ${data.message}
        `
      });
    }
    return result;
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Fetch generic page content by key (e.g. 'greeting')
 */
function getPageContent(key) {
  return Database.getPageContent(key);
}
