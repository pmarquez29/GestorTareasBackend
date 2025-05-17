const { Tarea, User } = require('../models'); // <-- mejor que require('user') directo


// Crear una tarea
const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, completada, fechaLimite } = req.body;
    const userId = req.userId;

    const nuevaTarea = await Tarea.create({
      titulo,
      descripcion,
      completada,
      fechaLimite,
      userId
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ mensaje: 'Error al crear tarea' });
  }
};

// Obtener una tarea por ID
const obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const tarea = await Tarea.findOne({
      where: { id, userId },
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

    res.json(tarea);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ mensaje: 'Error al obtener tarea' });
  }
}

// Obtener todas las tareas
const { Op } = require('sequelize');

const obtenerTareas = async (req, res) => {
  try {
    const userId = req.userId;
    const { estado, desde, hasta, q } = req.query;

    const where = { userId };

    // Validar estado
    if (estado !== undefined && !isNaN(parseInt(estado))) {
      where.completada = parseInt(estado);
    }

    // Validar fechas
    if (desde || hasta) {
      where.fechaLimite = {};
      if (desde && !isNaN(new Date(desde))) where.fechaLimite[Op.gte] = new Date(desde);
      if (hasta && !isNaN(new Date(hasta))) where.fechaLimite[Op.lte] = new Date(hasta);
    }

    // Búsqueda por título o descripción
    if (q && typeof q === 'string' && q.trim() !== '') {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${q.trim()}%` } },
          { descripcion: { [Op.iLike]: `%${q.trim()}%` } }
        ]
      });
    }

    const tareas = await Tarea.findAll({
      where,
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
};



// Actualizar una tarea
const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada, fechaLimite } = req.body;

    const tarea = await Tarea.findByPk(id);
    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

    // REGLAS:
    if (tarea.completada === 2) {
      return res.status(400).json({ mensaje: "No se puede modificar una tarea completada" });
    }

    if (completada !== undefined) {
      if (completada === 1 && tarea.completada !== 0) {
        return res.status(400).json({ mensaje: "Solo se puede pasar a 'En progreso' desde 'Pendiente'" });
      }
      if (completada === 0 && tarea.completada !== 0) {
        return res.status(400).json({ mensaje: "No se puede volver a 'Pendiente'" });
      }
      if (completada === 2 && tarea.completada !== 1) {
        return res.status(400).json({ mensaje: "Solo se puede marcar como 'Completada' si está 'En progreso'" });
      }
    }

    // Actualizar campos válidos
    tarea.titulo = titulo ?? tarea.titulo;
    tarea.descripcion = descripcion ?? tarea.descripcion;
    tarea.fechaLimite = fechaLimite ?? tarea.fechaLimite;
    tarea.completada = completada ?? tarea.completada;

    await tarea.save();

    res.json(tarea);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ mensaje: "Error al actualizar la tarea" });
  }
};


// Eliminar una tarea
const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
    if (tarea.completada !== 2) {
      return res.status(400).json({ mensaje: "Solo se puede eliminar una tarea completada" });
    }

    await tarea.destroy();
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ mensaje: "Error al eliminar la tarea" });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
};
