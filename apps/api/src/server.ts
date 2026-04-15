import { createServer } from "node:http";

import { modules } from "./modules/index.js";
import { buildHealthcheck } from "./shared/healthcheck.js";

const port = Number(process.env.PORT ?? 4000);

const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(buildHealthcheck(modules)));
    return;
  }

  if (request.url === "/modules") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ modules }));
    return;
  }

  response.writeHead(200, { "content-type": "application/json" });
  response.end(
    JSON.stringify({
      name: "@cafe-system/api",
      architecture: "modular-monolith",
      modules,
    }),
  );
});

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
