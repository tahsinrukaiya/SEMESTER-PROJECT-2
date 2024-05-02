export function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return JSON.parse(value);
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
}

export function removeStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
}
