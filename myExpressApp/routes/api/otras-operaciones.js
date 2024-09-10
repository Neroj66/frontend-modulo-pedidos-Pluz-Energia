const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos

// Ejemplo de ruta para obtener datos de la tabla 'contratistas'
router.get('/contratistas', (req, res) => {
  db.query('SELECT * FROM contratista', (error, results) => {
    if (error) {
      res.status(500).send(`Error en la consulta a la base de datos:  ${error.message}`);
      console.error(error);
    } else {
      res.send(results);
    }
  });
});


router.get('/sectores', (req, res) => {
    
    db.query('SELECT * FROM sector', (err,result)=>{
        if(err){
            res.status(500).send(`Error en la consulta a la base de datos:  ${err.message}`);
            console.error(err);
        }else{
            res.send(result);
        }
    });
})

router.get('/materiales', (req, res) =>{
  db.query('SELECT * FROM material WHERE estado =1 ',
  (err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.send(result);
      }
  }
  );

})

router.get('/servicios', (req, res) =>{
  db.query('SELECT * FROM servicios',
  (err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.send(result);
      }
  }
  );

})
// Endpoint para obtener sector por contratista
router.get('/sectores/contratista/:contratista_id', (req, res) =>{
  const { contratista_id } = req.params;

  if (!contratista_id) {
    return res.status(400).send('Contratista ID is required');
  }
  db.query(
    `SELECT *
     FROM sector
     WHERE 
          sector.id IN (
              SELECT sector_id
              FROM contratista_sector
              WHERE contratista_id = ?
          )`,
    [contratista_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    });

})

// Endpoint para obtener servicios por sector
router.get('/servicios/sector/:sector_id', (req, res) => {
  const { sector_id } = req.params;

  if (!sector_id) {
    return res.status(400).send('Sector ID is required');
  }

  db.query(
    'SELECT * FROM servicios WHERE sector_id = ?',
    [sector_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    }
  );

});

// Endpoint para obtener pdi por contratista
router.get('/pdi/contratista/:contratista_id', (req, res) => {
  const { contratista_id } = req.params;

  if (!contratista_id) {
    return res.status(400).send('Sector ID is required');
  }

  db.query(
    'SELECT * FROM pdi WHERE contratista_id = ?',
    [contratista_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).send(results);
    }
  );
})

module.exports = router;



/*

*/