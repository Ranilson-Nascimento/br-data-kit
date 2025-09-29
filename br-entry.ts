// Browser entry that exports the non-React parts of the library for the demo.
export * from '../src/validators';
export * from '../src/formatters';
export * from '../src/providers';
export * from '../src/boleto';
export * from '../src/ibge';
export * as vehicle from '../src/vehicle';
export * from '../src/ie';

// datasets.ts uses Node fs/path; for the browser bundle import the JSON files directly
import ddd from '../src/data/ddd.json';
import banks from '../src/data/banks.json';
export const datasets = { ddd, banks };
export default { datasets };
