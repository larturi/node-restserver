// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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