import http from "http";

const server = http
  .createServer((req, res) => {
    res.end("Hello from the server 4");
  })
  .listen(4001);

export default server;
