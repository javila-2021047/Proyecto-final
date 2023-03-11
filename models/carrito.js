
const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    producto:[{
        producto: Schema.Types.ObjectId,
       
        cantidad: 0,

        total: 0
    }],

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = model('Carrito', CarritoSchema);