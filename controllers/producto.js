const { request, response, json } = require('express');
const Producto = require('../models/producto');

const getAgotado = async (req = request, res = response)=>{
    const query = { stock: 0 };
    const agotados = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ]);
    
    res.json({
        msg: agotados
    });
}
const getMayor = async ( req = request, res = response)=>{

    const query = { vendidos:{$gt:57} };
    const mayorV = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ])

    res.json({
        msg: mayorV
    });
}


const getCatProductos = async (req = request, res = response) => {
    const { id } = req.params;

    //condiciones del get
    const query = { estado: true,categoria:id };
    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Categoria',
        listaProductos
    });

}


const postProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto( data );

    //Guardar en DB
    await producto.save();

    res.status(201).json( producto );
   
}


const putProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...restoData } = req.body;

    if ( restoData.nombre ) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }
    
    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, { new: true });

    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    })

}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    //const productoEliminado = await Producto.findByIdAndDelete( id );

    //Eliminar por el estado:false
    const productoEliminado_ = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true } );

    
   res.json({
        msg: 'DELETE',
        //productoEliminado,
        productoEliminado_
   })

}


module.exports = {
   postProducto,
   putProducto,
   deleteProducto,
   getAgotado,
   getMayor,
   getCatProductos
}
