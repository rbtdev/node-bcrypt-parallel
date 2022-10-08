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
console.log(`Hashing ${passwords.length} passwords...`);

const startTime = Date.now(); // Start a timer

// Split array of passwords into chunks based on number of CPUs
const chunks = _.chunk(passwords, Math.round(passwords.length / os.cpus().length));

// Create a worker promise for each chunk
const workers = chunks.map((chunk, i) => {
  const workerId = i+1;
  const worker = new Piscina();
  console.log(`Starting worker ${workerId} with ${chunk.length} passwords`);
  return worker.run({ chunk, workerId }, options);
});

console.log('Waiting for workers...');

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
    }, {});
    const endTime = Date.now(); // Stop the timer

    // Print it!
    console.log(result);
    console.log(`${Object.keys(result).length} unique keys`);
    const timeDeltaSec= (endTime-startTime)/1000;
    const timePerHash = timeDeltaSec/passwords.length;
    console.log(`Total time (secs): ${timeDeltaSec.toFixed(3)} sec`);
    console.log(`Total time/hash (secs): ${timePerHash.toFixed(3)} sec`);
  })
  .catch(err => {
    // Just in case
    console.error(err);
  });