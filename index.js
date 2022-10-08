const Piscina = require('piscina'); // An amazing worker thread manager
const fs = require('fs'); // To read files
const os = require('os'); // To count CPUS
const _ = require('lodash'); // To Chunk the big array into smaller ones
const path = require('path'); // To resolve path names

// Set options for worker threads
const options = { filename: path.resolve(__dirname, 'worker') }

// Read example passwords, split into array, 1 password per line
const contents = fs.readFileSync('./passwds.txt', 'utf8');
const passwords = contents.split('\n');
console.log(`Read ${passwords.length} lines`);

// Split array of passwords into chunks based on number of CPUs
const chunks = _.chunk(passwords, Math.round(passwords.length / os.cpus().length));

// Create a worker promise for each chunk
const workers = chunks.map((chunk, i) => {
  const worker = new Piscina();
  console.log(`Creating worker with ${chunk.length} passwords`);
  return worker.run({ chunk, worker: i }, options);
});

console.log('Running workers...');

// Wait for all workers to complete
Promise.all(workers)
  .then(chunks => {
    // Consolidate the worker results into a flat object
    const result = chunks.reduce((res, chunk) => {
      res = {
        ...res,
        ...chunk,
      }
      return res;
    });

    // Print it!
    console.log(result);
    console.log(`${Object.keys(result).length} unique keys`);
  })
  .catch(err => {
    // Just in case
    console.error(err);
  });