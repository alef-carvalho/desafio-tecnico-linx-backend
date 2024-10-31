import * as os from 'os';

export const HEALTHY_INTERNET_PING_CHECK_URL = 'https://www.google.com';
export const HEALTHY_MEMORY_CHECK_HEAP_LIMIT = 150 * 1024 * 1024;
export const HEALTHY_STORAGE_CHECK_PATH = os.platform() === 'win32' ? 'C:/' : '/';
