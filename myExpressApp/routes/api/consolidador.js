const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos


router.get('/detalle', (req, res) => {
    const { dateFrom, dateTo, contratista, sector, servicio, pdi} = req.query;
   
    // Construye la consulta SQL base
    let query = 
        `SELECT 
            pedidos_detalle.*, 
            contratista.nombre AS nombre_contratista, 
            servicios.nombre AS nombre_servicio, 
            pdi.pdi AS nombre_pdi, 
            sector.nombre AS nombre_sector,
            usuarios.nombre AS nombre_usuario,
            material.descripcion AS nombre_material,
            p.codigo AS codigo,
            p.total AS total,
            p.fecha AS fecha,
            p.LCL_ING AS lcl,
            estado.id AS estado_id,
            material.matricula AS matricula,
            material.precio AS precio_material
        FROM 
            pedidos_detalle
        INNER JOIN 
            pedidos AS p ON pedidos_detalle.pedidos_id = p.id
        INNER JOIN 
            usuarios ON p.usuario = usuarios.id
        INNER JOIN 
            contratista ON p.contratista_id = contratista.id
        INNER JOIN 
            servicios ON p.servicio_id = servicios.id
        INNER JOIN 
            sector ON p.sector_id = sector.id
        INNER JOIN 
            pdi ON p.pdi_id = pdi.id
        INNER JOIN 
            material ON pedidos_detalle.material_id = material.id
        INNER JOIN 
            estado ON p.estado_id = estado.id
        WHERE 
            estado_id=4
            `

    // Añade el filtro de fechas si están presentes
    const params = [];
    if (dateFrom && dateTo) {
        query += 'AND p.fecha >= ? AND p.fecha < DATE_ADD(?, INTERVAL 1 DAY)';
        params.push(dateFrom, dateTo);
    }else if (dateFrom) {
        query += ` AND p.fecha >= ?`;
        params.push(dateFrom);
    } else if (dateTo) {
        query += `AND p.fecha < DATE_ADD(?, INTERVAL 1 DAY)`;
        params.push(dateTo);
    }
    if(contratista){
        query += ` AND p.contratista_id = ?`;
        params.push(contratista);
    }
    if(pdi){
        query += ` AND p.pdi_id = ?`;
        params.push(pdi);
    }
    if(sector){
        query += ` AND p.sector_id = ?`;
        params.push(sector);
    }
    if(servicio){
        query += ` AND p.servicio_id = ?`;
        params.push(servicio);
    }

    query += `
        
         ORDER BY 
            codigo DESC;`;

    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la consulta de la base de datos');
        } else {
            res.send(result);
        }
    });
})


router.get('/pedidos',(req, res) => {
    const { dateFrom, dateTo, contratista, sector, servicio, pdi } = req.query;

    // Construye la consulta SQL base
    let query = 
        `SELECT 
            pedidos.*, 
            contratista.nombre AS nombre_contratista, 
            servicios.nombre AS nombre_servicio, 
            pdi.pdi AS nombre_pdi, 
            sector.nombre AS nombre_sector,
            usuarios.nombre AS nombre_usuario,
            us_aprob.nombre AS nombre_aprobador,
            us_valid.nombre AS nombre_validador
        FROM 
            pedidos 
        INNER JOIN 
            contratista ON pedidos.contratista_id = contratista.id
        INNER JOIN 
            servicios ON pedidos.servicio_id = servicios.id
        INNER JOIN 
            sector ON pedidos.sector_id = sector.id
        INNER JOIN 
            pdi ON pedidos.pdi_id = pdi.id
        INNER JOIN 
            usuarios ON pedidos.usuario = usuarios.id
        LEFT JOIN 
            usuarios AS us_aprob ON pedidos.aprobador_id = us_aprob.id
        LEFT JOIN 
            usuarios AS us_valid ON pedidos.validador_id = us_valid.id
        WHERE 
            estado_id = 4`;

    // Añade el filtro de fechas si están presentes
    const params = [];
    if (dateFrom && dateTo) {
        query += ' AND pedidos.fecha >= ? AND pedidos.fecha < DATE_ADD(?, INTERVAL 1 DAY)';
        params.push(dateFrom, dateTo);
    } else if (dateFrom) {
        query += ' AND pedidos.fecha >= ?';
        params.push(dateFrom);
    } else if (dateTo) {
        query += ' AND pedidos.fecha < DATE_ADD(?, INTERVAL 1 DAY)';
        params.push(dateTo);
    }

    // Añade otros filtros si están presentes
    if (contratista) {
        query += ' AND pedidos.contratista_id = ?';
        params.push(contratista);
    }
    if (pdi) {
        query += ' AND pedidos.pdi_id = ?';
        params.push(pdi);
    }
    if (sector) {
        query += ' AND pedidos.sector_id = ?';
        params.push(sector);
    }
    if (servicio) {
        query += ' AND pedidos.servicio_id = ?';
        params.push(servicio);
    }

    // Ordena los resultados
    query += ' ORDER BY pedidos.codigo DESC';

    // Ejecuta la consulta
    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la consulta de la base de datos');
        } else {

            res.send(result);
        }
    });
})



router.get('/logistica', (req, res) => {
    const { dateFrom, dateTo } = req.query;

    // Construye la consulta SQL base
    let query = `
        SELECT 
            pdi.pdi AS nombre_pdi, 
            material.matricula AS matricula,
            material.precio AS precio,
            ROUND(SUM(pedidos_detalle.importe), 2) AS importe_total,
            SUM(pedidos_detalle.cantidad) AS cantidad_total,
            contratista.nombre AS nombre_contratista
        FROM 
            pedidos_detalle
        INNER JOIN 
            pedidos AS p ON pedidos_detalle.pedidos_id = p.id
        INNER JOIN 
            pdi ON p.pdi_id = pdi.id
        INNER JOIN 
            material ON pedidos_detalle.material_id = material.id
        INNER JOIN 
            estado ON p.estado_id = estado.id
        INNER JOIN 
            contratista ON p.contratista_id = contratista.id
        WHERE 
            estado.id = 4
    `;

    // Añade el filtro de fechas si están presentes
    const params = [];
    if (dateFrom && dateTo) {
        query += 'AND p.fecha >= ? AND p.fecha < DATE_ADD(?, INTERVAL 1 DAY)';
        params.push(dateFrom, dateTo);
    } else if (dateFrom) {
        query += ` AND p.fecha >= ?`;
        params.push(dateFrom);
    } else if (dateTo) {
        query += ` AND p.fecha < DATE_ADD(?, INTERVAL 1 DAY)`;
        params.push(dateTo);
    }

    query += `
        GROUP BY 
            pdi.pdi, 
            material.matricula, 
            material.precio, 
            contratista.nombre
        ORDER BY 
            pdi.pdi ASC, 
            material.matricula ASC;
    `;

    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(`Error en la consulta de la base de datos: ${err.message}`);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;


/*




*/