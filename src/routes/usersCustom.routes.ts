import CustomRouter from "./custom.routes.js";
import UsersController from "@controllers/users.controller.mdb.js";
import config from "@/config.js";

const controller = new UsersController();

export default class UsersCustomRouter extends CustomRouter {
  init() {
    this.router.param("id", async (req, res, next, pid) => {
      if (!config.MONGODB_ID_REGEX.test(pid)) {
        return res.sendServerError(new Error("Id no válido"));
      }

      next();
    });

    this.get("/paginate/:page/:limit", async (req, res) => {
      try {
        const filter = { role: "admin" };
        const options = { page: parseInt(req.params.page), limit: parseInt(req.params.limit), sort: { lastName: 1 } };
        const process = await controller.getPaginated(filter, options);

        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.post("/", async (req, res) => {
      try {
        const process = await controller.add(req.body);
        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.put("/:id", async (req, res) => {
      try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const process = await controller.update(filter, update, options);

        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.delete("/:id", async (req, res) => {
      try {
        const filter = { _id: req.params.id };
        const process = await controller.delete(filter);
        res.sendSuccess(process);
      } catch (err) {
        res.sendServerError(err as Error);
      }
    });

    this.router.all("*", async (req, res) => {
      res.sendServerError(new Error("No se encuentra la ruta seleccionada"));
    });
  }
}

/*
**
 * Aggregate nos permite ejecutar varios procesos en una misma consulta.
 * Muy útil cuando necesitamos generar estadísticas o calcular totales
 * sobre las consultas, es decir, no retornar los datos de la colección
 * tal cual se encuentran almacenados, sino realizar cálculos sobre esos
 * datos en la propia consulta.
 * 
 * En este ejemplo, efectuamos 3 procesos (stages):
 * 1- Filtrado por rol.
 * 2- Agrupamiento y cálculo de suma total de grades por región (ver modelo).
 * 3- Ordenamiento por total de grades descendente (-1).

router.get('/aggregate/:role', async (req, res) => {
    try {
        if (req.params.role === 'admin' || req.params.role === 'premium' || req.params.role === 'user') {
            const match = { role: req.params.role };
            const group = { _id: '$region', totalGrade: {$sum: '$grade'} };
            const sort = { totalGrade: -1 };
            const process = await controller.getAggregated(match, group, sort);

            res.status(200).send({ origin: config.SERVER, payload: process });
        } else {
            res.status(200).send({ origin: config.SERVER, payload: null, error: 'role: solo se acepta admin, premium o user' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
    }
});
*/
