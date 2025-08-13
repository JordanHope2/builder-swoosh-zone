// server/dev.ts
import { createServer } from "./index";

const app = createServer();
const PORT = Number(process.env.API_PORT || 8787);

app.listen(PORT, () => {
  console.log(`[API] listening on http://localhost:${PORT}`);
});
