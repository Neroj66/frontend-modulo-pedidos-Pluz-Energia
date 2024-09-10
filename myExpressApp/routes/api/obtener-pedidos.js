const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos

  // obtener pedidos

router.get('/pedidos', (req, res) => {
            
        db.query( 
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
             send_generacion=1
            ORDER BY 
                pedidos.codigo DESC;
            
            `,
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result);
            }
        }
        );
        
    
    })

    router.get('/pedidos_detalle',(req, res) => {
        
        db.query(
            `SELECT 
                pedidos_detalle.*, 
                contratista.nombre AS nombre_contratista, 
                servicios.nombre AS nombre_servicio, 
                pdi.pdi AS nombre_pdi, 
                sector.nombre AS nombre_sector,
                usuarios.nombre AS nombre_usuario,
                material.descripcion AS nombre_material,
                p.codigo AS codigo,
                p.LCL_ING as lcl,
                p.total AS total,
                p.fecha AS fecha,
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
            ORDER BY 
                codigo DESC`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
        
    })
    

    router.get('/pedidos_detalle/:pedido_id',(req, res) => {
        const { pedido_id } = req.params;
    
        if (!pedido_id) {
            return res.status(400).send('Pedido ID is required');
        }
    
        db.query(
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
                p.id=?
            ORDER BY 
                pedidos_detalle.id DESC`,
            [pedido_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
        
    })
    

    router.get('/pedidos/sector/:sector_id',(req, res) => {
        const { sector_id } = req.params;
    
        if (!sector_id) {
            return res.status(400).send('Sector ID is required');
        }
    
        db.query(
            `SELECT 
                pedidos.*, 
                contratista.nombre AS nombre_contratista, 
                servicios.nombre AS nombre_servicio, 
                pdi.pdi AS nombre_pdi, 
                sector.nombre AS nombre_sector,
                usuarios.nombre AS nombre_usuario 
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
            WHERE 
                sector.id = ? AND send_generacion=1
            ORDER BY 
                pedidos.codigo DESC`,
            [sector_id],
            (err, results) => {
                if (err) {
                    console.log('Error en la consulta:', err);
                    return res.status(500).send(err);
                }
               
                res.status(200).send(results);
            }
        );

    })
    
    router.get('/pedidos/user/:user_id',(req, res) => {
        const { user_id } = req.params;
    
        if (!user_id) {
            return res.status(400).send('User ID is required');
        }
    
        db.query(
            `SELECT 
                pedidos.*, 
                contratista.nombre AS nombre_contratista, 
                servicios.nombre AS nombre_servicio, 
                pdi.pdi AS nombre_pdi, 
                sector.nombre AS nombre_sector,
                usuarios.nombre AS nombre_usuario 
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
            WHERE 
                usuario = ?
            ORDER BY 
                pedidos.codigo DESC`,
            [user_id],
            (err, results) => {
                if (err) {
                    console.log('Error en la consulta:', err);
                    return res.status(500).send(err);
                }
               
                res.status(200).send(results);
            }
        );
    })
    
    router.get('/pedidos/liquidador/:liquidador_id',(req, res) => {
        const { liquidador_id } = req.params;
    
        if (!liquidador_id) {
            return res.status(400).send('Liquidador ID is required');
        }
    
        console.log('Liquidador ID recibido:', liquidador_id);
    
        db.query(
            `SELECT 
                pedidos.*, 
                contratista.nombre AS nombre_contratista, 
                servicios.nombre AS nombre_servicio, 
                pdi.pdi AS nombre_pdi, 
                sector.nombre AS nombre_sector,
                usuarios.nombre AS nombre_usuario 
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
            WHERE 
                pedidos.contratista_id IN (
                    SELECT contratista_id
                    FROM liquidador_contratista
                    WHERE liquidador_id = ?
                )
                AND send_aprobacion=1
            ORDER BY 
                pedidos.codigo DESC`,
            [liquidador_id],
            (err, results) => {
                if (err) {
                    console.log('Error en la consulta:', err);
                    return res.status(500).send(err);
                }
    
                res.status(200).send(results);
            }
        );
    })

    module.exports = router;

/*





*/