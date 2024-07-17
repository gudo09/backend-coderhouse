import { Router } from "express";

import config from "../config.js";
import UsersController from "@controllers/users.controller.mdb.js";

const router = Router();
const controller = new UsersController();

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

router.get("/paginate/:page/:limit", async (req, res) => {
  try {
    const filter = { role: "admin" };
    const options = { page: parseInt(req.params.page), limit: parseInt(req.params.limit), sort: { lastName: 1 } };
    const process = await controller.getPaginated(filter, options);

    res.status(200).send({ origin: config.SERVER, payload: process });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.post("/", async (req, res) => {
  try {
    const process = await controller.add(req.body);

    res.status(200).send({ origin: config.SERVER, payload: process });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;
    const options = { new: true };
    const process = await controller.update(filter, update, options);

    res.status(200).send({ origin: config.SERVER, payload: process });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const process = await controller.delete(filter);

    res.status(200).send({ origin: config.SERVER, payload: process });
  } catch (err) {
    res.status(500).send({ origin: config.SERVER, payload: null, error: (err as Error).message });
  }
});

//Siempre al último por si no entra a ningún otro endpoint
router.all("*", async (req, res) => {
  res.status(404).send({ origin: config.SERVER, payload: {}, error: "No se encuentra la ruta seleccionada" });
});

export default router;
