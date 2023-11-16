export const getLinkId = (text: string) => text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-');
