const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos

  // Aprobar pedido
router.put('/aprobar', (req, res) => {
    const id = req.body.id;
    const aprobador_id = req.body.aprobador_id;
    const fecha = new Date();
    const estado = req.body.estado;
    const send_aprob = req.body.send_aprobacion;
    const send_val= req.body.send_validacion;

    console.log('Valores recibidos en req.body:');
    console.log(req.body);

    const sqlQuery = 'UPDATE pedidos SET aprobador_id=?, fecha_aprobacion=?, estado_id=?, send_aprobacion=?, send_validacion =? WHERE id=?';
    const queryParams = [aprobador_id, fecha, estado, send_aprob, send_val, id];

    console.log('Valores de queryParams:');
    console.log(queryParams);

    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.log('Error al ejecutar la consulta:', err);
            res.status(500).send(err);
        } else {
            console.log('Consulta ejecutada correctamente. Resultado:', result);
            res.send(result);
        }
    });

})

  // Nueva función para actualizar el estado de un pedido
  router.put('/validar', (req, res) => {
    const id = req.body.id;
    const validador_id = req.body.validador_id;
    const fecha = new Date();
    const estado = req.body.estado;
    const send = req.body.send_validacion;

    console.log('Valores recibidos en req.body:');
    console.log(req.body);


    const sqlQuery = 'UPDATE pedidos SET validador_id=?, fecha_validacion=?, estado_id=?, send_validacion=? WHERE id=?';
    const queryParams = [validador_id, fecha, estado, send, id];

    console.log('Valores de queryParams:');
    console.log(queryParams);

    db.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.log('Error al ejecutar la consulta:', err);
            res.status(500).send(err);
        } else {
            console.log('Consulta ejecutada correctamente. Resultado:', result);
            res.send(result);
        }
    });
})


module.exports = router;


/*


*/