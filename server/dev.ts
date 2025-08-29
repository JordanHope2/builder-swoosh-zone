// server/dev.ts
import { createServer } from "./index";

(async () => {
  const app = await createServer();
  const PORT = Number(process.env.API_PORT || 8787);

  app.listen(PORT, () => {
    console.log(`[API] listening on http://localhost:${PORT}`);
    console.log(`[GraphQL] gateway running at http://localhost:${PORT}/graphql`);
  });
})();
