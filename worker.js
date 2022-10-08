const bcrypt = require('bcrypt'); // bcrypt passwd hasher

// Hash options
const options = {
  rounds: 12, // Rounds 12
  json: true, // Return in JSON
}

const passwdAsync = async (passwords, options) => {
  const tasks = passwords.map(pw => bcrypt.hash(pw, options.rounds));
  const hashes = await Promise.all(tasks);
  const res = hashes.reduce((res, h,i) => {
    res[h] = passwords[i];
    return res;
  }, {});
  return res;
}

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
