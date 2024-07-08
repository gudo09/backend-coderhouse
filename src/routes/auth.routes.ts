import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

import config from "@/config.js";
import { User } from "@/types/user.interface.js";
import UsersManager from "@controllers/users.controller.mdb.js";
import { createToken, verifyRequiredBody, verifyToken } from "@services/utils.js";
import initAuthStrategies, { passportCall } from "@auth/passport.strategies.js";

const router = Router();
const usersManager = new UsersManager();
initAuthStrategies();

// Middleware para validar que el usuario es admin (solo para session)
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session.user);
  //if (req.session.user && req.session.user.role === "admin")
  if (req.session.user?.role === "admin") return res.status(200).send({ origin: config.SERVER, payload: "Bienvanido admin" });

  next();
};

const handlePolicies = (policies: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    policies = policies.map((policy) => policy.toLowerCase());
    if (policies[0] === "public") return next();

    // FALTA IMPLEMENTAR EL RESTO DE POLITICAS
    // DESPUES DE IMPLEMENTAR SE SEBE MOVER A LA CLASE CUSOMROUTES

    next();
  };
};

//Middleware para validar que el usuario es admin (solo para cookies y jwt)
const verifyAuthorization = (role: "user" | "admin" | "premium") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).send({ origin: config.SERVER, payload: "Usuario no autenticado" });
    if ((req.user as User).role !== role) return res.status(403).send({ origin: config.SERVER, payload: "No tiene permisos para acceder al recurso" });

    next();
  };
};

// valida los datos requeridos en el body
router.post("/login", verifyRequiredBody(["email", "password"]), async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = await usersManager.login(email, password);

    if (!login) {
      console.log("Datos de acceso no válidos.");
      res.redirect(`/login?error=${encodeURI("Usuario o contraseña no válidos.")}`);
      return;
    }

    req.session.user = { email: login.email, firstName: login.firstName, lastName: login.lastName, role: login.role };
    res.redirect("/profile");
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.get("/private", adminAuth, async (req, res) => {
  try {
    res.status(403).send({ origin: config.SERVER, payload: "Se requiere nivel de autenticacion admin." });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.get("/counter", async (req, res) => {
  try {
    if (req.session.counter) {
      req.session.counter++;
      res.status(200).send({ origin: config.SERVER, visitas: req.session.counter, message: "Gracias por volver a visitarnos..." });
    } else {
      req.session.counter = 1;
      res.status(200).send({ origin: config.SERVER, visitas: req.session.counter, message: "Bienvenido!! Es ti primer visita !!" });
    }
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: {}, message: (err as Error).message });
  }
});

// login con passort y session
router.post("/pplogin", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI("Usuario o contraseña no válidos.")}` }), async (req, res) => {
  try {
    const { email, password: _password } = req.body;
    const login = await usersManager.login(email, _password);

    if (!login) {
      console.log("Datos de acceso no válidos.");
      res.redirect(`/login?error=${encodeURI("Usuario o contraseña no válidos.")}`);
      return;
    }

    const { password, ...filteredUser } = login.toJSON(); // toJSON() para evitar el formateo de mongoose

    req.session.user = filteredUser;

    // Uso req.session.save para mantener la asincronía
    req.session.save((err) => {
      if (err) res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
      res.redirect("/profile");
    });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.get("/ghlogin", passport.authenticate("ghlogin", { scope: ["user"] }), async (req, res) => {});

router.get("/ghlogincallback", passport.authenticate("ghlogin", { failureRedirect: `/login?error=${encodeURI("Error al identificar con Github.")}` }), async (req, res) => {
  try {
    req.session.user = req.user;
    req.session.save((err) => {
      if (err) return res.status(500).send({ origin: config.SERVER, payload: {}, message: (err as Error).message });
      res.redirect("/profile");
    });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: {}, message: (err as Error).message });
  }
});

router.get("/logout", async (req, res) => {
  try {
    //destruyo los datos de la sesion
    req.session.destroy((err) => {
      if (err) return res.status(500).send({ origin: config.SERVER, payload: null, message: "Hubo un error al hacer el logout." });
      return res.redirect("/login");
    });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.post("/register", verifyRequiredBody(["firstName", "lastName", "email", "password"]), passport.authenticate("register", { failureRedirect: `/register?error=${encodeURI("Error al registrar usuario.")}` }), async (req, res) => {
  try {
    const { email, password: _password } = req.body;
    const login = await usersManager.login(email, _password);

    if (!login) {
      console.log("Error al registrar usuario.");
      res.redirect(`/register?error=${encodeURI("Error al registrar usuario.")}`);
      return;
    }

    const { password, ...filteredUser } = login.toJSON(); // toJSON() para evitar el formateo de mongoose

    req.session.user = filteredUser;

    // Uso req.session.save para mantener la asincronía
    req.session.save((err) => {
      if (err) res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
      res.redirect("/profile");
    });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.get("/current", passportCall("jwtlogin"), async (req, res) => {
  try {
    const currentUserFirstName = (req.user as User).firstName;
    const currentUserLastName = (req.user as User).lastName;
    res.status(200).send({ origin: config.SERVER, payload: `El usuario actualemte autenticado es ${currentUserFirstName} ${currentUserLastName}` });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

// usa passport base para el login y crea un token en la cookie con jwt
router.post("/jwtlogin", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI("Usuario o contraseña no válidos.")}` }), async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(500).send({ origin: config.SERVER, payload: {}, message: "Error" });
    //req.session.user = req.user;
    const token = createToken(req.user as User, "1h");
    res.cookie(config.COOKIE_NAME, token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true });
    res.status(200).send({ origin: config.SERVER, payload: "Usuario autenticado", token: token });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: {}, message: (err as Error).message });
  }
});

// verifica el token con jwt para acceder a admin
// funciona tanto como por req.query.access_token, header (con prefijo "Bearer") ó
// con cookies. Todo esto lo gestiona "verifyToken"
router.get("/jwtLocalAdmin", verifyToken, verifyAuthorization("admin"), async (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, payload: "Bienvenido admin." });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

// verifica el token con passport-jwt mediante el middleware passportCall y la estrategia jwtlogin para acceder a admin
// usa cookies, es decir que requiere estar logueado con las cookies cargadas con el token
router.get("/jwtppAdmin", passportCall("jwtlogin"), verifyAuthorization("admin"), async (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, payload: "Bienvenido admin." });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

//Siempre al último por si no entra a ningún otro endpoint
router.all("*", async (req, res) => {
  res.status(404).send({ origin: config.SERVER, payload: {}, error: "No se encuentra la ruta seleccionada" });
});
export default router;
