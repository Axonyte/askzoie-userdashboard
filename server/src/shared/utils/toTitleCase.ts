export function toTitleCase(str: string): string {
    // Replace underscores and hyphens with spaces
    let result = str.replace(/[_-]/g, " ");
    // Replace camelCase with space before each uppercase letter
    result = result.replace(/([a-z])([A-Z])/g, "$1 $2");
    // Convert entire string to lowercase before capitalizing first letter of each word
    result = result.toLowerCase();
    // Capitalize the first letter of each word
    result = result.replace(/\b\w/g, (char) => char.toUpperCase());
    return result;
}