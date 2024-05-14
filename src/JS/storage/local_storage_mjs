export function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function removeStorage(key) {
    localStorage.removeItem(key);
}