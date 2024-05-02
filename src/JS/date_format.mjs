/**
 * Format a date string.
 *
 * @param {string} date - The date string to be formatted.
 * @returns {string} - The formatted date string.
 */

export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
}
