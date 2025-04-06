/**
 * Sets the document title with a consistent format
 * @param {string} pageTitle - The specific page title
 */
export const setDocumentTitle = (pageTitle) => {
  document.title = pageTitle ? `${pageTitle} | Farzaan` : 'Home | Farzaan';
};
