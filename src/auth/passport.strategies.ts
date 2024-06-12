import config from "@/config.js";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import usersManager from "@managers/usersManager.mdb.js";

const manager = new usersManager();

const initAuthStrategies = () => {
  // Estrategia de terceros (autenticamos a través de un servicio externo)
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
          console.log(`profile: ${JSON.stringify(profile)}`)
          const email = profile._json?.email || null;
          console.log(email)

          // Necesitamos que en el profile haya un email
          if (email) {
            // Tratamos de ubicar en NUESTRA base de datos un usuario
            // con ese email, si no está lo creamos y lo devolvemos,
            // si ya existe retornamos directamente esos datos
            const foundUser = await manager.getOne({ email: email });
            console.log(`FoundUser: ${JSON.stringify(foundUser)}`)
            if (!foundUser) {
              const user = {
                firstName: profile._json.name.split(" ")[0],
                lastName: profile._json.name.split(" ")[1],
                email: email,
                password: "none",
              };
              console.log(`new user: ${user}`)
              const process = await manager.add(user);
              console.log(`process: ${process}`)
              return done(null, process);
            } else {
              console.log(`FoundUser2: ${foundUser}`)
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


passport.serializeUser((user, done) => {
  done(null, user);
});
  
passport.deserializeUser((user: any, done) => {
  done(null, user);
});


export default initAuthStrategies;
