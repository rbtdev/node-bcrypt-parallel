const hash = require('@rbtdev/node-cmd-bcrypt'); // bcrypt passwd hasher

// Hash options
const options = {
  rounds: 12, // Rounds 12
  json: true, // Return in JSON
}

// Wrap the event emitter into a promise
const passwdAsync = (passwords, options) => new Promise(resolve => {
  hash(passwords, options)
    .on('done', result => {
      resolve(result);
    });
});

// Main entry for worker
// Take a 'chunk' of passwords, along with my worker ID (just for information)
const run = async ({ chunk, workerId }) => {
  // Hash the chunk
  const result = await passwdAsync(chunk, options);
  // Log that I'm done
  console.log(`Worker ${workerId} done`);
  // send the result back to the main thread
  return result;
};

module.exports = run;
