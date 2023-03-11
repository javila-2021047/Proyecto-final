const { request, response } = require('express');

const Factura = require('../models/factura');

const Producto = require('../models/producto');

const Carrito = require('../models/carrito');

const getCarrito = async ( res = response) => {

    const listaCarrto = await Promise.all([
        Carrito.countDocuments(),
        Carrito.find()
    ]);

    res.json({
        msg: 'get Api - Controlador Carrito',
        listaCarrto
    });

}

const getCarritoById = async (req = request, res = response) => {
    const _User = req.usuario.id

    const carritoById = await Factura.find( {usuario:_User} );
 
    res.status(201).json( carritoById );
 
 }

 const postCarrito = async (req = request, res = response) => {
    const _user= req.usuario.id;
    const { producto,cantidad } = req.body;

    let totalProducto = 0;
    let totalCompra = 0;
    const productosCompra = [];

    for(let i = 0; i< producto.length;i++){

            const productoComprar = producto[i];
            const cantidadPedida = cantidad[i];
            const buscarSolictudP = await Producto.findById(productoComprar);
            
            let productoPrecio = buscarSolictudP.precio;
            let cantidadUser = parseInt(cantidadPedida),
            totalProducto = productoPrecio*cantidadUser;
            
            productosCompra.push({producto:productoComprar,cantidad:cantidadPedida,total:totalProducto});
            totalCompra = totalProducto + totalCompra;

            let vendicoC = parseInt(buscarSolictudP.vendidos);
            let stockEditar = parseInt(buscarSolictudP.stock);

            const {...resto}  = "";
            if (stockEditar === 0) {
                resto.estado = false;
            }

            let cantidadEditada = parseInt(stockEditar - cantidadPedida);
            let totalFactura = parseInt(vendicoC + cantidadPedida);
            if (cantidadEditada >= cantidadPedida) {
                resto.stock = cantidadEditada;
                resto.vendidos = totalFactura;
            }

            console.log(resto);
            await Producto.findByIdAndUpdate(productoComprar, resto, { new: true });
            
        
        
    }

    const editar = {
        producto:productosCompra,
        usuario:_user,
        total : totalCompra,
    }  
   
    const carritoGuardada = new Carrito(editar);

    await carritoGuardada.save();
    const facturas = {
        usuario:_user,
        producto:carritoGuardada._id
    }
    const facturadb = new Factura(facturas);
    res.json({
        msg:carritoGuardada
    })
    await facturadb.save();

 }


 module.exports = {
    getCarrito,
    getCarritoById,
    postCarrito
}
