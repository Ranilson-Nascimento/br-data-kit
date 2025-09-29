
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ddd = JSON.parse(readFileSync(join(__dirname, 'data', 'ddd.json'), 'utf8'));
const banks = JSON.parse(readFileSync(join(__dirname, 'data', 'banks.json'), 'utf8'));

export const datasets = { ddd, banks };
export default datasets;
