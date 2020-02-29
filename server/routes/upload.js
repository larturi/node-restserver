const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // Validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    // Extensiones permitidas
    let extencionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

    let archivo = req.files.archivo;
    let nombreSplit = archivo.name.split('.');
    let extension = nombreSplit[nombreSplit.length - 1];

    if (extencionesPermitidas.indexOf(extension) < 0) {
        res.json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extencionesPermitidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo para que sea unico

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    })

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios'); // <-- Borro la imagen

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios'); // <-- Borro la imagen

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
        }

        borraArchivo(usuarioDB.img, 'usuarios'); // <-- Borro la imagen vieja

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });

        });

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos'); // <-- Borro la imagen

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos'); // <-- Borro la imagen

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
        }

        borraArchivo(productoDB.img, 'productos'); // <-- Borro la imagen vieja

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });

        });

    });

}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    console.log(pathImagen);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;