const BASE_API_URL = import.meta.env['VITE_API_HOST'];

export const getFileUrl = (fileName: string) => `${BASE_API_URL}/api/files/${fileName}`;
