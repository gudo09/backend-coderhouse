import { Router, Request, Response, NextFunction } from "express";
import config from "@/config.js";
import UsersManager from "@managers/usersManager.mdb.js";
import { User } from "@customTypes/user.interface.js";
import passport from "passport";

import initAuthStrategies from "@/auth/passport.strategies.js";

const router = Router();
const usersManager = new UsersManager();
initAuthStrategies();

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Middleware para validar que el usuario es admin

  console.log(req.session.user);
  //if (req.session.user && req.session.user.role === "admin")
  if (req.session.user?.role === "admin")
    return res
      .status(200)
      .send({ origin: config.SERVER, payload: "Bienvanido admin" });

  next();
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const login: User | null = await usersManager.login(email, password);

    if (!login) {
      console.log("Datos de acceso no válidos.");
      res.redirect("/login");
      return;
    }

    req.session.user = {
      email: login.email,
      firstName: login.firstName,
      lastName: login.lastName,
      role: login.role,
    };

    console.log(req.session.user);

    res.redirect("/profile");
  } catch (err) {
    res.status(500).send({
      origin: config.SERVER,
      payload: null,
      error: (err as Error).message,
    });
  }
});

router.get("/private", adminAuth, async (req, res) => {
  try {
    res.status(403).send({
      origin: config.SERVER,
      payload: "Se requiere nivel de autenticacion admin.",
    });
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
      res.status(200).send({
        origin: config.SERVER,
        visitas: req.session.counter,
        message: "Gracias por volver a visitarnos...",
      });
    } else {
      req.session.counter = 1;
      res.status(200).send({
        origin: config.SERVER,
        visitas: req.session.counter,
        message: "Bienvenido!! Es ti primer visita !!",
      });
    }
  } catch (err) {
    res.status(500).send({
      origin: config.SERVER,
      payload: {},
      message: (err as Error).message,
    });
  }
});

router.get(
  "/ghlogin",
  passport.authenticate("ghlogin", { scope: ["user"] }),
  async (req, res) => {}
);

router.get(
  "/ghlogincallback",
  passport.authenticate("ghlogin", {
    failureRedirect: `/login?error=${encodeURI(
      "Error al identificar con Github."
    )}`,
  }),
  async (req, res) => {
    //falta ver porque no muestra los datos al loguearse
    try {
      console.log(`Req User: ${JSON.stringify(req.user, null, 2)}`);
      req.session.user = req.user;
      req.session.save((err) => {
        if (err)
          return res.status(500).send({
            origin: config.SERVER,
            payload: {},
            message: (err as Error).message,
          });
        res.redirect("/profile");
      });
    } catch (err) {
      res.status(500).send({
        origin: config.SERVER,
        payload: {},
        message: (err as Error).message,
      });
    }
  }
);

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).send({
          origin: config.SERVER,
          payload: null,
          message: "Hubo un error al hacer el logout.",
        });
      return res.redirect("/login");
    });
  } catch (err) {
    res.status(500).send({
      origin: config.SERVER,
      payload: null,
      error: (err as Error).message,
    });
  }
});

//falta implementar
router.post("/register", (req, res) => {});
export default router;
