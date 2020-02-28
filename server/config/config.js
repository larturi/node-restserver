// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '480h';

// ============================
//  Seed de autenticacion Token
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de Datos
// ============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27018/cafe';
} else {
    urlDB = 'mongodb+srv://larturi:oPkRMCgBBucDeBQK@cluster0-cubqz.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

// ============================
//  Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '477903923098-lmh9jtoodthbm7rvqh5j4l9fvmu30pcu.apps.googleusercontent.com';