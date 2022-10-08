# Example using `bcryptjs` in an async parallel worker pool

This is a simple example of using the `Piscina` worker pool manager to create a pool of workers which take advantage of all CPUs to hash a large array of passwords using `bcryptjs` in parallel.

`index.js` sets up the `Piscina` worker pool using `worker.js` as the code to run.  A password file is read into memory and an array is created using each line as an entry in the array.

The array is chunked into sub arrays, one chunk for each CPU.  Workers are spawned to process each chunk in parallel . Once all workers complete the results are collated and printed.

```
$ npm install
$ node index.js
```