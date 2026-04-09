const ramadanKareem = `
   * * *       *      *       *    * * *    * * *    *       *
   *    *     * *     **     **   *     *   *    *   **      *
   * * *     *   *    * *   * *   * * * *   *    *   * *     *
   *    *    * * *    *  * *  *   *     *   *    *   *  *    *
   *     *  *     *   *   *   *   *     *   * * *    *   * * *

    *    *     *      * * *    * * * *   * * * *   *       *
    *   *     * *     *    *   *         *         **     **
    * *      *   *    * * *    * * *     * * *     * *   * *
    *   *    * * *    *    *   *         *         *  * *  *
    *    *  *     *   *     *  * * * *   * * * *   *   *   *
`;

console.log("%c" + ramadanKareem, "color: #FFD700; font-weight: bold;");

// Part 1
console.log("Hello from Node.js!");

// Part 2
const math = require("./math");

const add = math.add(5, 10);
console.log(`sum: ${add}`);

const mult = math.multiply(5, 10);
console.log(`multiply: ${mult}`);

const sub = math.subtract(10, 5);
console.log(`subtract: ${sub}`);

const div = math.divide(10, 5);
console.log(`divide is: ${div}`);

// Part 3
const FileSystem = require("fs");
FileSystem.writeFileSync("data.txt", "sample data.");
let data = FileSystem.readFileSync("data.txt", "utf-8");
console.log(`data.txt (sync): ${data}`);

FileSystem.readFile("data.txt", "utf-8", (err, asyncData) => {
  console.log(`data.txt (async): ${asyncData}`);
});


// Part 4
console.log("3 seconds delay timer started...");
setTimeout(() => {
  console.log("3 seconds delay timer is done");
}, 3000);

// Part 5

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from the HTTP server!");
});
// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });


//part 6
// const http = require("http");
const server1 = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page!");
    } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page.");
    } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } });
server1.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
}); 