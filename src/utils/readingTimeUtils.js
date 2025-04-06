/**
 * Calculate reading time based on word count
 * @param {string} content - The blog content
 * @param {number} wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns {string} - Formatted reading time (e.g., "2 min read")
 */
export function calculateReadingTime(content, wordsPerMinute = 200) {
  // Strip HTML tags if content is HTML
  const text = content.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Count words by splitting on whitespace
  const words = text.trim().split(/\s+/).length;
  
  // Calculate reading time in minutes
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  
  return `${minutes} min read`;
}
