const bcrypt = require('bcryptjs'); // JS bcrypt passwd hasher

// Async hash a chunk of passwords
const hash = async chunk => {
  const res = {};
  for (let password of chunk) {
    const hash = await bcrypt.hash(password, 12);
    res[hash] = password;
  }
  return res;
}

// Main entry for worker
// Take a 'chunk' of passwords, along with my worker ID (just for information)
const run = async ({ chunk, workerId }) => {
  const result = await hash(chunk);
  console.log(`Worker ${workerId} done`);
  return result;
};

module.exports = run;
