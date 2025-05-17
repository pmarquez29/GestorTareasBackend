const express = require("express");
const router = express.Router();
const {
  crearTarea,
  obtenerTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
} = require("../controllers/tareaController");

// Crear una nueva tarea
router.post("/", crearTarea);

// Obtener todas las tareas
router.get("/", obtenerTareas);

// Obtener una tarea por ID
router.get("/:id", obtenerTareaPorId);

// Actualizar una tarea
router.put("/:id", actualizarTarea);

// Eliminar una tarea
router.delete("/:id", eliminarTarea);

module.exports = router;
