var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); // Importa el paquete cors

// Configura CORS para permitir solo solicitudes desde un dominio específico
const corsOptions = {
  origin: 'https://ashy-grass-009f4900f.5.azurestaticapps.net', // Reemplaza con tu dominio permitido
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Asegúrate de permitir encabezados necesario
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, algunos SmartTVs) necesitan esto
};

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors(corsOptions)); // Aplica la configuración de CORS antes de las rutas

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth = require('./routes/auth/login');
var crearpedido = require('./routes/api/crear-pedido');
var otras_oper = require('./routes/api/otras-operaciones'); // Importa la nueva ruta de contratistas
var aprob_vali = require('./routes/api/aprobar_validar');
var consolidador = require('./routes/api/consolidador');
var obtPedido = require('./routes/api/obtener-pedidos');
var operate = require('./routes/api/operate-pedido');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/otrasop', otras_oper); // Usa la nueva ruta de contratistas
app.use('/aprb_vld',aprob_vali);
app.use('/consolidador',consolidador);
app.use('/crear',crearpedido);
app.use('/auth',auth);
app.use('/obt-pedidos',obtPedido);
app.use('/operate-ped',operate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
