// Archivo auto-generado para simular 500 productos de supermercado

const imagenesDisponibles = [
    "imagen10.jpg", "imagen11.jpg", "imagen12.jpg", "imagen13.jpg", "imagen14.jpg",
    "imagen15.jpg", "imagen16.jpg", "imagen17.jpg", "imagen18.jpg", "imagen19.jpg",
    "imagen20.jpg", "imagen21.jpg", "imagen22.jpg", "imagen23.jpg", "imagen24.jpg",
    "imagen25.jpg", "imagen26.jpg", "imagen27.jpg", "imagen28.jpg", "imagen29.jpg",
    "imagen30.jpg", "imagen6.jpg", "imagen7.jpg", "slice1.jpg.jpg", "slice2.jpg.jpg",
    "slice3.jpg.jpeg", "slice4.jpg.jpeg"
];

const categoriasBase = [
    "PROMOCIONES", "PACKS", "CERVEZA", "PISCO", "WHISKY", "RON", 
    "VODKA", "GIN", "TEQUILA", "LICORES", "BEBIDAS", "AGUA"
];

const prefijosNombre = {
    "PROMOCIONES": ["Súper Oferta", "Promo Especial", "Liquidación", "Descuento", "Oportunidad"],
    "PACKS": ["Pack Fiesta", "Combo Amigos", "Pack Degustación", "Set Premium", "Caja Sorpresa"],
    "CERVEZA": ["Cerveza Lager", "Cerveza Ale", "Cerveza IPA", "Cerveza Stout", "Cerveza Artesanal", "Pack Cervezas"],
    "PISCO": ["Pisco Reservado", "Pisco Transparente", "Pisco Envejecido", "Pisco Artesanal", "Pisco Doble Destilado"],
    "WHISKY": ["Whisky 12 Años", "Whisky Single Malt", "Whisky Blended", "Whisky Premium", "Whisky Irlandés"],
    "RON": ["Ron Añejo", "Ron Blanco", "Ron Especiado", "Ron Gran Reserva", "Ron Dorado"],
    "VODKA": ["Vodka Clásico", "Vodka Saborizado", "Vodka Premium", "Vodka Destilado", "Vodka Ruso"],
    "GIN": ["Gin London Dry", "Gin Botánico", "Gin Rosado", "Gin Premium", "Gin Cítrico"],
    "TEQUILA": ["Tequila Reposado", "Tequila Blanco", "Tequila Añejo", "Tequila Gold", "Tequila Artesanal"],
    "LICORES": ["Licor de Hierbas", "Crema de Whisky", "Licor de Café", "Amaretto", "Licor Frutal"],
    "BEBIDAS": ["Bebida Cola", "Bebida Naranja", "Bebida Limón", "Bebida Tónica", "Bebida Energética"],
    "AGUA": ["Agua Mineral Sin Gas", "Agua Mineral Con Gas", "Agua Saborizada", "Agua Purificada", "Agua Tónica"]
};

const sufijosNombre = [
    "Edición Limitada", "Familiar", "Importado", "Nacional", "Clásico", 
    "Premium", "Gold", "Reserva Especial", "Extra", "Suave", "Intenso"
];

// Generador de 500 productos
const catalogoProductos = [];

for (let i = 1; i <= 500; i++) {
    // Escoger categoría de forma equitativa
    const categoria = categoriasBase[i % categoriasBase.length];
    
    // Escoger prefijo y sufijo aleatorio
    const prefijos = prefijosNombre[categoria];
    const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
    const sufijo = sufijosNombre[Math.floor(Math.random() * sufijosNombre.length)];
    
    // Generar nombre
    const name = `${prefijo} ${sufijo} Vol. ${Math.floor(Math.random() * 100)}`;
    
    // Generar precio base según categoría
    let precioBase = 1000;
    if (["WHISKY", "GIN", "TEQUILA"].includes(categoria)) precioBase = 15000;
    if (["PISCO", "RON", "VODKA", "LICORES", "PACKS"].includes(categoria)) precioBase = 6000;
    if (["CERVEZA", "BEBIDAS", "AGUA"].includes(categoria)) precioBase = 1000;
    if (["PROMOCIONES"].includes(categoria)) precioBase = 3000;
    
    // Variación aleatoria de precio
    const variacion = Math.floor(Math.random() * 5000);
    const price = precioBase + variacion;
    
    // Asignar imagen rotativa
    const image = imagenesDisponibles[i % imagenesDisponibles.length];
    
    catalogoProductos.push({
        id: i,
        name: name,
        price: price,
        category: categoria,
        image: image
    });
}
