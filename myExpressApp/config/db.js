// Importa mysql2 para la conexión a la base de datos
var mysql = require('mysql2');

// Configura la conexión a la base de datos
var connection = mysql.createConnection({
  host: 'pyg-server.mysql.database.azure.com', // reemplaza con tu hostname de Azure
  user: 'pyg',            // reemplaza con tu nombre de usuario
  password: "Pluz2024$",
    database: "pedidos_ora"                    // reemplaza con el nombre de tu base de datos
});
// Conectar a la base de datos
connection.connect(function(err) {
  if (err) {
    console.error('Error en la consulta a la base de datos:', err.message); // Muestra el mensaje de error
    console.error('Error conectando a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

// Exporta la conexión para que pueda ser utilizada en otros archivos
module.exports = connection;


/*//manera normal
// Configura la conexión a la base de datos

var connection = mysql.createPool({
  host: 'pyg-server.mysql.database.azure.com',
  user: 'pyg',
  password: 'Pluz2024$',
  database: 'pedidos_ora',
  waitForConnections: true, // Espera conexiones si el pool está lleno
  connectionLimit: 70, // Número máximo de conexiones en el pool
  queueLimit: 10 // Número máximo de solicitudes en la cola de espera
});
*/


