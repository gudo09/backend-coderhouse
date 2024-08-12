import CustomRouter from "../routes/custom.routes.js";

export default class TestCustomRouter extends CustomRouter {
  init() {
    this.get("/", async (req, res) => {
      try {
        throw new Error("Error de usuario personalizado")
      } catch (err) {
        res.sendUserError(err as Error);
      }
    });
  }
}
