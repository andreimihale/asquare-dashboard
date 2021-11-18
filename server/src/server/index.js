import http from "http";

const server = http
  .createServer((req, res) => {
    res.end("Hello from the server 4");
  })
  .listen(4001);

console.log("Server is up and running 3");

export default server;
