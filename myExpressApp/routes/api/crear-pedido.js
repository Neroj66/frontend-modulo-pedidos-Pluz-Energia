const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos

async function generateUniqueCode(fecha, db) {
    const year = fecha.getFullYear(); // Obtener el año
    const yearShort = year.toString().slice(-2); // Obtener los últimos dos dígitos del año

    const countQuery = 'SELECT COUNT(*) AS count FROM pedidos WHERE YEAR(fecha) = ?';
    const countParams = [year];

    const rows = await new Promise((resolve, reject) => {
        db.query(countQuery, countParams, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });

    if (!rows || rows.length === 0) {
        throw new Error('No se pudo obtener el conteo de pedidos');
    }

    let count = rows[0].count + 1; // Incrementar el conteo
    let codigo;
    let isUnique = false;

    while (!isUnique) {
        const countString = count.toString().padStart(6, '0');
        codigo = `P${yearShort}${countString}`;

        const checkQuery = 'SELECT COUNT(*) AS count FROM pedidos WHERE codigo = ?';
        const checkParams = [codigo];

        const checkRows = await new Promise((resolve, reject) => {
            db.query(checkQuery, checkParams, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!checkRows || checkRows.length === 0) {
            throw new Error('Error al verificar la unicidad del código');
        }

        if (checkRows[0].count === 0) {
            isUnique = true;
        } else {
            count++; // Incrementar el contador si el código ya existe
        }
    }

    return codigo;
}

router.post('/pedido', async (req, res) => {
    const { contratista, sector, servicio, pdi, lcl, usuario, total, materiales } = req.body;
    const fecha = new Date();
    const estado = 1;

    if (!contratista || !sector || !materiales || !Array.isArray(materiales) || materiales.length === 0) {
        return res.status(400).send('Contratista ID, Sector ID, y materiales son requeridos');
    }

    try {
        const codigo = await generateUniqueCode(fecha, db).catch(error => { throw error });

        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) reject(err);
                else resolve();
            });
        });

        const pedidoQuery = 'INSERT INTO pedidos (contratista_id, sector_id, servicio_id, codigo, pdi_id, LCL_ING, usuario, fecha, total, estado_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const pedidoParams = [contratista, sector, servicio, codigo, pdi, lcl, usuario, fecha, total, estado];

        const pedidoResult = await new Promise((resolve, reject) => {
            db.query(pedidoQuery, pedidoParams, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const pedidoId = pedidoResult.insertId;

        const materialQueries = materiales.map(material => {
            const materialQuery = 'INSERT INTO pedidos_detalle (pedidos_id, material_id, cantidad, importe) VALUES (?, ?, ?, ?)';
            const materialParams = [pedidoId, material.id, material.quantity, material.importe];
            return new Promise((resolve, reject) => {
                db.query(materialQuery, materialParams, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        });

        await Promise.all(materialQueries);

        await new Promise((resolve, reject) => {
            db.commit(err => {
                if (err) reject(err);
                else resolve();
            });
        });

        return res.status(200).send({ message: 'Pedido creado con éxito' });
    } catch (error) {
        if (db) {
            await new Promise((resolve, reject) => {
                db.rollback(() => {
                    console.error('Transacción revertida debido a un error:', error);
                    resolve();
                });
            });
        }
        
        console.error('Error en la creación del pedido:', error.message, error.stack);
        return res.status(500).send('Error en la creación del pedido');
    }
});

module.exports = router;
