const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Importa la conexión a la base de datos
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/login',  (req, res) =>{
    //usar: https://bcrypt-generator.com/   para generacion de contraseñas hash
    const username = req.body.username;
    const password = req.body.password;
    
    const consult = 'SELECT * FROM usuarios WHERE username = ?';
    
    try {
        db.query(consult, [username], (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).json({ error: 'Error en la consulta' });
                return;
            }
    
            if (result.length > 0) {
                const hashedPassword = result[0].password;
                
                console.log("Contraseña ingresada:", password);
                console.log("Contraseña hasheada:", hashedPassword);
                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) {
                        console.error('Error al comparar contraseñas:', err);
                        res.status(500).send('Error al comparar contraseñas');
                        return;
                    }
    
                    if (isMatch) {
                        const token = jwt.sign({ username }, "Stack", {
                            expiresIn: '2h'
                        });
                        console.log(`[${new Date().toLocaleString()}] Loggeo correcto de: ${username}`);
                        res.send({ token });
                    } else {
                        console.log(`[${new Date().toLocaleString()}] Error loggeo de: ${username}`);
                        res.send({ message: 'Usuario y/o contraseña inválida.' });
                    }
                });
            } else {
                console.log(`[${new Date().toLocaleString()}] Usuario no encontrado: ${username}`);
                res.send({ message: 'Usuario no encontrado.' });
            }
        });
    } catch (e) {
        console.error('Error inesperado:', e);
        res.status(500).send('Internal server error');
    } 
    
})
router.get('/obtener/:user',  (req, res) => {
    const { user } = req.params;
  
    if (!user) {
      return res.status(400).send('Username is required');
    }

  
    db.query(
            `SELECT usuarios.*, 
                generador_contratista.contratista_id AS contratistaId
                FROM usuarios
                LEFT JOIN generador_contratista ON generador_contratista.generador_id = usuarios.id
                WHERE usuarios.username = ?;
                `,
      [user],
      (err, results) => {
        console.log('user encontrado:', results); 
        if (err) {
          console.error('Error en la consulta:', err); // Imprimir el error en la consola del servidor
          return res.status(500).send(err);
        }
  
        res.status(200).send(results);
      }
    );
  })

module.exports = router;


/*



*/