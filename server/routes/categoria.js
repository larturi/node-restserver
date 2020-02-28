const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las Categorias
// ============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })

});

// ============================
// Mostrar una Categoria por ID
// ============================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

// ============================
// Crear una nueva Categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva Categoria
    //req.categoria._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// ============================
// Actualizar una Categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    var body = req.body;

    let descripcionCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcionCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

// ============================
// Borra una Categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {


    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, catagoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!catagoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });

});


module.exports = app;