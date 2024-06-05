import { Router } from "express";
import config from "@/config.js";

const router = Router();

router.post("/login", (req, res) => {
  try {
    //
    // Toda la logica
    //
    res.redirect("/profile");
  } catch (err) {
    res.status(500).send({
      origin: config.SERVER,
      payload: null,
      error: (err as Error).message,
    });
  }
});

router.get("/counter", async (req, res) => {
  try {
    if (req.session.counter) {
      req.session.counter++;
      res
        .status(200)
        .send({
          origin: config.SERVER,
          visitas: req.session.counter,
          message: "Gracias por volver a visitarnos...",
        });
    } else {
      req.session.counter = 1;
      res
        .status(200)
        .send({
          origin: config.SERVER,
          visitas: req.session.counter,
          message: "Bienvenido!! Es ti primer visita !!",
        });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        origin: config.SERVER,
        payload: {},
        message: (err as Error).message,
      });
  }
});

//falta implementar
router.post("/register", (req, res) => {});
export default router;
