import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import config from "../config.ts";
import usersManager from "../controllers/users.controller.mdb.ts";
import { createHash, isValidPassword } from "../services/utils.ts";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/users.model.ts";
import path from "path";

const manager = new usersManager();

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const JwtExtractor = jwt.ExtractJwt;

// toma la cookie del req y la devuelve sólo el token que se llame "codercookietoken" de esa cookie
const cookieExtractor = (req: Request) => {
  let token = null;

  token = req.cookies[config.COOKIE_NAME] || null;
  return token;
};

const initAuthStrategies = () => {
  /** LocalStrategy - Estrategia login local (cotejamos contra nuestra base de datos)
   *
   */
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email", // Uso el email como campo principal que se guarda en username
      },
      async (req, username, password, done) => {
        try {
          const foundUser = await manager.getOne({ email: username });
          console.log(foundUser)

          if (!foundUser) return done(null, false, { message: "Usuario no encontrado" });

          if (!isValidPassword(password, (foundUser as User).password)) {
            console.log("contraseña incorrecta")
            return done(null, false, { message: "Contraseña incorrecta" });
          }
            

          const { password: _password, role, ...filteredFoundUser } = foundUser as User;

          return done(null, { ...filteredFoundUser, role: role });
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  /** LocalStrategy - Estrategia register local (cotejamos contra nuestra base de datos)
   *
   */
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // Permite pasar toda la solicitud al callback
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await manager.getOne({ email });
          if (existingUser) {
            return done(null, false, { message: "Email en uso." });
          }

          const hashedPassword = createHash(password);
          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hashedPassword,
            role: req.body.role,
          };

          const createdUser = await manager.add(newUser);
          return done(null, (createdUser as User).toJSON());
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /** JwtStrategy - Estrategia para login con jwt
   *
   */
  /* NOTE: Se reemplaza por verifyToken de /services/utils 
  passport.use(
    "jwtlogin",
    new JwtStrategy(
      {
        jwtFromRequest: JwtExtractor.fromExtractors([cookieExtractor]),
        secretOrKey: config.SECRET,
      },
      async (jwt_payload, done) => {
        try {
          if (!jwt_payload) return done(null, false, { message: "No registrado" });
          return done(null, jwt_payload);
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );*/

  /** GitHubStrategy - Estrategia de terceros (autenticamos a través de un servicio externo), en este caso Github
   *
   */
  passport.use(
    "ghlogin",
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Si passport llega hasta acá, es porque la autenticación en Github ha sido correcta, tendremos un profile disponible
          const email = profile._json?.email || null;

          // Necesitamos que en el profile haya un email
          if (email) {
            // Tratamos de ubicar en NUESTRA base de datos un usuario con ese email, si no está lo creamos y lo devolvemos, si ya existe retornamos directamente esos datos
            const foundUser = await manager.getOne({ email: email });
            console.log(`FoundUser: ${JSON.stringify(foundUser)}`);
            if (!foundUser) {
              const user = {
                firstName: profile._json.name.split(" ")[0],
                lastName: profile._json.name.split(" ")[1],
                email: email,
                password: "none",
              };
              const process = await manager.add(user);
              return done(null, process);
            } else {
              return done(null, foundUser);
            }
          } else {
            return done(new Error("Faltan datos de perfil"), undefined);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};

/** Llama a las estrategias inicializadas en initAuthStrategies()
 *
 */
export const passportCall = (strategy: string, options: passport.AuthenticateOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //{session: false} para deshabilitar el uso de sesiones de express-session
    passport.authenticate(strategy, { session: false, ...options }, function (err: Error, user: User, info: { message: string } | null) {
      // Si no hay token en el login, solo mostramos el formulario
      if (req.path === '/login' && !req.cookies[config.COOKIE_NAME] && info?.message === "No auth token") {
        return next(); // Mostrar la vista de login
      }
      
      if (info?.message) {
        return res.redirect(`${req.path}?error=${encodeURI(info.message)}`);
      }

      if (err) {
        return next(err);
      }
      if (!user) {

        // Para la ruta de login, no redirigimos en bucle, simplemente mostramos el formulario
        if (req.path === "/login") {
          return res.render("login", { error: info?.message || null });
        }


        // Redirige a la URL especificada en `failureRedirect`
        if (options.failureRedirect) {
          return res.redirect(options.failureRedirect);
        }
        // Si no se especifica `failureRedirect`, devuelve un error de usuario
        return res.sendUserError(new Error("Usuario no autenticado."));
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

/* NOTE: DESHABILITADO AL NO USAR EXPRESS-SESSIONS
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: User, done) => {
  done(null, user);
});
*/

export default initAuthStrategies;
