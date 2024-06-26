import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import config from "@/config.js";
import usersManager from "@managers/usersManager.mdb.js";
import { createHash, isValidPassword } from "@/utils.js";
import { NextFunction, Request, Response } from "express";
import { User } from "@/types/user.interface.js";

const manager = new usersManager();

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const JwtExtractor = jwt.ExtractJwt;

// toma la cookie del req y la devuelve sólo el token que se llame "codercookietoken" de esa cookie
const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) token = req.cookies[config.COOKIE_NAME];

  return token;
};

const initAuthStrategies = () => {
  // Estrategia login local (cotejamos contra nuestra base de datos)
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

          if (foundUser && typeof foundUser !== "string" && isValidPassword(password, foundUser.password)) {
            const { password, role, ...filteredFoundUser } = foundUser;
            return done(null, {...filteredFoundUser, role: role});
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Estrategia register local (cotejamos contra nuestra base de datos)
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // Permite pasar toda la solicitud a la callback
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await manager.getOne({ email });
          if (existingUser) {
            return done(null, false, { message: "Email already in use" });
          }

          const hashedPassword = createHash(password);
          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hashedPassword,
            role: req.body.role ? req.body.role : "user",
          };

          const createdUser = await manager.add(newUser);
          return done(null, createdUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwtlogin",
    new JwtStrategy(
      {
        jwtFromRequest: JwtExtractor.fromExtractors([cookieExtractor]),
        secretOrKey: config.SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Estrategia de terceros (autenticamos a través de un servicio externo), en este caso Github
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
          // Si passport llega hasta acá, es porque la autenticación en Github
          // ha sido correcta, tendremos un profile disponible
          const email = profile._json?.email || null;

          // Necesitamos que en el profile haya un email
          if (email) {
            // Tratamos de ubicar en NUESTRA base de datos un usuario
            // con ese email, si no está lo creamos y lo devolvemos,
            // si ya existe retornamos directamente esos datos
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

export const passportCall = (strategy: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //{session: false} para deshabilitar el uso de sesiones de express-session
    passport.authenticate(strategy, { session: false }, function (err: Error, user: Express.User, info: { message: string } | string) {
      if (err) return next(err);
      if (!user) return res.status(401).send({ origin: config.SERVER, payload: null, error: "Usuario no autenticado" });

      req.user = user;
      next();
    })(req, res, next);
  };
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default initAuthStrategies;
