import { Hono, Context } from "hono";

const app = new Hono();

app.get("/", (ctx: Context) => {
  return ctx.json({
    message: "Welcome To Rendezvo",
  });
});

export default app;