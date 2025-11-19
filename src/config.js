const isLocalhost = window.location.hostname === 'localhost';

const BE_URL = isLocalhost
  ? 'http://localhost:3000'           // dev: backend local
  : 'https://t-m-be.onrender.com';    // prod: backend Render (SỬA TÊN NÀY CHO ĐÚNG)

export const API_BASE_URL = `${BE_URL}/api`;
export const ASSET_BASE_URL = BE_URL;
