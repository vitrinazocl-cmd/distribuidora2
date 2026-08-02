const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const REF_FILE = path.join(__dirname, 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'Catalogo_Eleodoro_Hojas_Escritas.xlsx');

// Definición de todos los productos y sabores de las 8 hojas
const sheetsData = [
    // Hoja 1
    {
        baseCode: 'AND400',
        price: 5040,
        flavors: ['DURAZNO', 'NARANJA', 'FRUTILLA']
    },
    {
        baseCode: 'SX',
        price: 17880,
        flavors: ['SURTIDO']
    },
    {
        baseCode: 'SXF',
        price: 7900,
        flavors: ['TROPICAL BLUE', 'FRUTILLA']
    },
    {
        baseCode: 'ARROZ',
        price: 6950,
        flavors: ['2GRADO']
    },
    {
        baseCode: 'MASC',
        price: 10516,
        flavors: ['UVA SIN GAS', 'MANZANA SIN GAS', 'PERA SIN GAS', 'GRANADA SIN GAS', 'CITRUS']
    },
    {
        baseCode: 'MASP',
        price: 7521,
        flavors: ['UVA SIN GAS', 'MANZANA SIN GAS', 'PERA SIN GAS', 'GRANADA SIN GAS', 'MANGO MARACUYA', 'CITRUS CON GAS', 'FRUTOS DEL BOSQUE CON GAS', 'LIMONADA FRAMBUESA']
    },
    {
        baseCode: 'WB300',
        price: 19920,
        flavors: ['DURAZNO', 'NARANJA', 'PIÑA', 'TUTIFRUTILLA']
    },
    
    // Hoja 2
    {
        baseCode: 'MINIC',
        price: 3330,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE']
    },
    {
        baseCode: 'LATAC',
        price: 4428,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE']
    },
    {
        baseCode: 'LATAK6',
        price: 3780,
        flavors: ['KEM', 'BILZ', 'PAP', 'LIMON', 'PEPSI', 'PEPSI ZERO', 'GINGER', 'CRUSH', 'SEVEN UP', 'KEM EXTREME']
    },
    {
        baseCode: 'BIGCOLA473',
        price: 3180,
        flavors: ['COLA'],
        isNew: true,
        newDetails: {
            brand: 'Big Cola',
            category: 'Bebidas Gaseosas',
            namePattern: 'BIG COLA LATA 473ML x 6 unidades'
        }
    },
    {
        baseCode: 'BIGUVA17',
        price: 5250,
        flavors: ['UVA'],
        isNew: true,
        newDetails: {
            brand: 'Big Cola',
            category: 'Bebidas Gaseosas',
            namePattern: 'BIG UVA 1.7L x 6 unidades'
        }
    },
    {
        baseCode: 'ALOEO',
        price: 17952,
        flavors: ['ORIGINAL', 'COCO', 'GRANADA', 'PIÑA', 'FRUTILLA', 'ARANDANO']
    },
    {
        baseCode: 'ALOE15',
        price: 20280,
        flavors: ['ORIGINAL', 'PIÑA', 'FRUTILLA'],
        isNew: true,
        newDetails: {
            brand: 'Aloe Vera',
            category: 'Bebidas Gaseosas',
            namePattern: 'ALOE VERA 1.5L x 12 unidades'
        }
    },
    
    // Hoja 3
    {
        baseCode: 'FR2',
        price: 3490,
        flavors: ['COLA', 'PIÑA', 'PAPAYA', 'NARANJA', 'LIMON SODA', 'FRUTAL', 'GINGER ALE']
    },
    {
        baseCode: 'FR500',
        price: 3590,
        flavors: ['COLA', 'PIÑA', 'PAPAYA', 'NARANJA', 'LIMON SODA', 'FRUTAL', 'GINGER ALE']
    },
    {
        baseCode: 'SOPA',
        price: 9000,
        flavors: ['POLLO', 'CARNE', 'CARNE PICANTE', 'CAMARON']
    },
    {
        baseCode: 'JUMEXM',
        price: 15650,
        flavors: ['PIÑA', 'PIÑA COCO', 'MANGO', 'DURAZNO', 'PERA', 'MANZANA']
    },
    {
        baseCode: 'JC2',
        price: 4250,
        flavors: ['PIÑA', 'NARANJA', 'FRUTILLA', 'DURAZNO']
    },
    {
        baseCode: 'KAPOF',
        price: 5800,
        flavors: ['FRAMBUESA', 'PIÑA', 'NARANJA', 'MANZANA']
    },
    {
        baseCode: 'BOMB200',
        price: 6480,
        flavors: ['DURAZNO', 'PIÑA', 'MANZANA', 'NARANJA']
    },
    
    // Hoja 4
    {
        baseCode: 'SCOREG',
        price: 19680,
        flavors: ['GORILA', 'ORIGINAL', 'GORILA ZERO', 'BUBBLE GUM', 'MANGO', 'FRUIT PUNCH', 'MOJITO', 'BLUE']
    },
    {
        baseCode: 'SCOREW473',
        price: 18000,
        flavors: ['ALOE VERA', 'SIN GAS', 'CON GAS'],
        isNew: true,
        newDetails: {
            brand: 'Score',
            category: 'Energéticas',
            namePattern: 'SCORE WATER 473ML x 24 unidades'
        }
    },
    {
        baseCode: 'MONSO6',
        price: 8238,
        flavors: ['ORIGINAL', 'ULTRA ZERO', 'WHITE ZERO', 'PARADIZE ZERO', 'MANGO LOCO', 'PIPELINE PUNCH', 'ORIGINAL ZERO', 'RIPPER']
    },
    {
        baseCode: 'RB473',
        price: 25920,
        flavors: ['ORIGINAL']
    },
    {
        baseCode: 'RB355',
        price: 20760,
        flavors: ['ORIGINAL']
    },
    {
        baseCode: 'RB250',
        price: 15200,
        flavors: ['ORIGINAL']
    },
    {
        baseCode: 'ZOOM12',
        price: 7800,
        flavors: ['WHITE', 'PURPLE'],
        isNew: true,
        newDetails: {
            brand: 'Zoom',
            category: 'Energéticas',
            namePattern: 'ENERGY ZOOM 473ML x 12 unidades'
        }
    },
    {
        baseCode: 'RSTAR',
        price: 11160,
        flavors: ['MANGO POWER', 'ORIGINAL', 'SANDIA']
    },
    
    // Hoja 5
    {
        baseCode: 'WATTSD',
        price: 9120,
        flavors: [
            'DURAZNO', 'DURAZNO ZERO', 
            'NARANJA', 'NARANJA ZERO', 
            'TUTIFRUTILLA ORIGINAL', 'TUTIFRUTILLA ZERO', 
            'PIÑA', 'PIÑA ZERO', 
            'TUTIKIWI', 'DAMASCO', 'NARANJA PLATANO', 
            'MANZANA', 'MANZANA ZERO', 
            'MANGO ZERO', 'MARACUYA ZERO'
        ]
    },
    {
        baseCode: 'ANDVA15',
        price: 6540,
        flavors: ['DURAZNO', 'TUTIFRUTILLA', 'NARANJA', 'PIÑA', 'DAMASCO']
    },
    
    // Hoja 6
    {
        baseCode: 'AND125',
        price: 10250,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE', 'INCA COLA']
    },
    {
        baseCode: 'AND2',
        price: 11880,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE', 'SPRITE ZERO', 'INCA COLA']
    },
    {
        baseCode: 'AND3',
        price: 12642,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE']
    },
    {
        baseCode: 'L125',
        price: 12990,
        flavors: ['PEPSI', 'PEPSI ZERO', 'KEM', 'BILZ', 'LIMON', 'PAP']
    },
    {
        baseCode: 'L2',
        price: 13545,
        flavors: ['PEPSI', 'PEPSI ZERO', 'KEM', 'BILZ', 'LIMON', 'PAP']
    },
    {
        baseCode: 'L25',
        price: 9498,
        flavors: ['PEPSI', 'PEPSI ZERO', 'GINGER', 'CRUSH', 'BILZ', 'KEM', 'PAP', 'LIMON']
    },
    {
        baseCode: 'EXPRESS24',
        price: 10104,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE'],
        isNew: true,
        newDetails: {
            brand: 'Coca Cola',
            category: 'Bebidas Gaseosas',
            namePattern: 'COCA COLA EXPRESS 250ML x 24 unidades'
        }
    },
    {
        baseCode: 'EXPRB',
        price: 11200,
        flavors: ['KEM', 'BILZ', 'PEPSI', 'PEPSI ZERO', 'LIMON', 'PAP']
    },
    {
        baseCode: 'BEN5',
        price: 4680,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'BEN3',
        price: 6900,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'CATUNSG5',
        price: 4000,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'CATUNSG16',
        price: 5520,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'CATUNSG25',
        price: 6540,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'LIFE3',
        price: 3590,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'VITSG600',
        price: 5940,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'VITSG16',
        price: 4866,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'VIT330',
        price: 8280,
        flavors: ['CON GAS', 'SIN GAS']
    },
    {
        baseCode: 'VITP',
        price: 8280,
        flavors: ['SIN GAS']
    },
    
    // Hoja 7
    {
        baseCode: 'CCU600',
        price: 10200,
        flavors: ['KEM', 'BILZ', 'LIMON', 'PAP', 'PEPSI', 'PEPSI ZERO']
    },
    {
        baseCode: 'AND591',
        price: 5760,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE']
    },
    {
        baseCode: 'GATO1A',
        price: 7260,
        flavors: ['AZUL', 'ROJO', 'NARANJA']
    },
    {
        baseCode: 'GATO750',
        price: 5280,
        flavors: ['AZUL', 'ROJO', 'NARANJA']
    },
    {
        baseCode: 'POWA1',
        price: 7550,
        flavors: ['AZUL', 'ROJO', 'NARANJA']
    },
    {
        baseCode: 'POWA850',
        price: 5850,
        flavors: ['AZUL', 'ROJO'],
        isNew: true,
        newDetails: {
            brand: 'Powerade',
            category: 'Bebidas Gaseosas',
            namePattern: 'POWERADE 850ML x 6 unidades'
        }
    },
    {
        baseCode: 'MINI250',
        price: 6200,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE'],
        isNew: true,
        newDetails: {
            brand: 'Coca Cola',
            category: 'Bebidas Gaseosas',
            namePattern: 'COCA COLA MINI 250ML x 6 unidades'
        }
    },
    
    // Hoja 8
    {
        baseCode: 'AND3DES',
        price: 14850,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE', 'INCA COLA']
    },
    {
        baseCode: 'L3',
        price: 12080,
        flavors: ['KEM', 'BILZ', 'PAP', 'LIMON', 'PEPSI', 'PEPSI ZERO', 'CRUSH', 'GINGER', 'SEVEN UP']
    },
    {
        baseCode: 'AND15DES',
        price: 9888,
        flavors: ['COCA COLA', 'COCA COLA ZERO', 'FANTA', 'SPRITE', 'INCA COLA']
    },
    {
        baseCode: 'CCU125DES',
        price: 5760,
        flavors: ['KEM', 'BILZ', 'PAP', 'LIMON', 'PEPSI', 'PEPSI ZERO']
    }
];

try {
    console.log("Cargando catálogo de referencia...");
    if (!fs.existsSync(REF_FILE)) {
        console.error("Error: Catálogo de referencia no existe.");
        process.exit(1);
    }
    const workbookRef = xlsx.readFile(REF_FILE);
    const refRows = xlsx.utils.sheet_to_json(workbookRef.Sheets[workbookRef.SheetNames[0]]);
    
    // Agrupar filas de referencia por Código base
    const refByBase = {};
    refRows.forEach(row => {
        const code = String(row['Código Producto']);
        // Extraer código base (quitando el sufijo -XX)
        const base = code.includes('-') ? code.split('-')[0] : code;
        if (!refByBase[base]) {
            refByBase[base] = [];
        }
        refByBase[base].push(row);
    });

    const newRows = [];
    let idCounter = 1;

    sheetsData.forEach((item, index) => {
        const base = item.baseCode;
        const price = item.price;
        const flavors = item.flavors;
        const refList = refByBase[base] || [];

        // Encontrar una plantilla de referencia para copiar datos estáticos
        const refTemplate = refList.length > 0 ? refList[0] : null;

        flavors.forEach((flavor, fIndex) => {
            // Generar código
            const flavorNum = flavors.length > 1 ? String(fIndex + 1).padStart(2, '0') : null;
            const newCode = flavorNum ? `${base}-${flavorNum}` : base;
            const newSku = `SKU-${newCode}`;

            // Nombre Comercial
            let namePattern = '';
            if (item.isNew) {
                namePattern = item.newDetails.namePattern;
            } else if (refTemplate) {
                // Limpiar el nombre comercial original quitando cualquier sufijo anterior " - flavor"
                const origName = String(refTemplate['Nombre Comercial']);
                namePattern = origName.includes(' - ') ? origName.split(' - ')[0] : origName;
            } else {
                namePattern = `${base} x ${flavors.length} unidades`;
            }
            const newName = flavorNum ? `${namePattern} - ${flavor}` : namePattern;

            // Buscar si ya existe una referencia con el mismo sabor para heredar el código de barra original
            let barcode = '';
            if (refTemplate) {
                // Buscamos coincidencia de sabor en la lista de referencia
                const matchedRef = refList.find(r => String(r['Nombre Comercial']).toUpperCase().includes(flavor.toUpperCase()));
                barcode = matchedRef ? matchedRef['Código Barras'] : refTemplate['Código Barras'];
            } else {
                // Si es un producto totalmente nuevo, le asignamos un barcode ficticio
                barcode = `78000000${(99000 + idCounter).toString()}`;
            }

            // Datos estáticos
            const category = item.isNew ? item.newDetails.category : (refTemplate ? refTemplate['Categoría'] : 'Bebidas Gaseosas');
            const brand = item.isNew ? item.newDetails.brand : (refTemplate ? refTemplate['Marca'] : 'Otros');
            const provider = refTemplate ? refTemplate['Proveedor'] : 'Proveedor Importaciones Eleodoro';
            const margin = refTemplate ? parseFloat(refTemplate['Margen Comercial (%)']) : 35;
            
            // Precio Venta
            const newPrice = price;
            // Calcular costo según margen
            const costPrice = Math.round(newPrice / (1 + (margin / 100)));

            // Stock
            let stock = 100;
            if (!item.isNew && refTemplate) {
                // Si el producto original existe, podemos intentar heredar su stock original de referencia
                // (Sumamos todos los stocks originales del producto base y los dividimos)
                const totalRefStock = refList.reduce((acc, curr) => acc + (parseFloat(curr['Stock Actual']) || 0), 0);
                if (totalRefStock > 0) {
                    stock = Math.round(totalRefStock / flavors.length);
                }
            } else {
                // Si es nuevo, repartimos 100 de forma equitativa
                stock = Math.round(100 / flavors.length);
            }

            const imgRoute = item.isNew ? `/catalogo/${base}.jpeg` : (refTemplate ? refTemplate['Ruta Imagen'] : `/catalogo/${base}.jpeg`);
            const desc = `Producto importado de www.eleodoroelgrande.cl. Sabor/Variación: ${flavor}.`;

            const newRow = {
                'ID Interno': idCounter++,
                'Código Producto': newCode,
                'SKU': newSku,
                'Código Barras': barcode,
                'Nombre Comercial': newName,
                'Marca': brand,
                'Categoría': category,
                'Proveedor': provider,
                'Precio Costo ($)': costPrice,
                'Precio Venta ($)': newPrice,
                'Margen Comercial (%)': margin,
                'Stock Actual': stock,
                'Stock Mínimo Alerta': 10,
                'Ruta Imagen': imgRoute,
                'Descripción Detallada': desc
            };

            newRows.push(newRow);
        });
    });

    console.log(`Guardando nuevo catálogo compilado en: ${OUTPUT_FILE}`);
    console.log(`Total de filas nuevas generadas: ${newRows.length}`);

    const newWorkbook = xlsx.utils.book_new();
    const newWorksheet = xlsx.utils.json_to_sheet(newRows);
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Catalogo_Hojas_Escritas');
    xlsx.writeFile(newWorkbook, OUTPUT_FILE);

    console.log("¡Operación completada con éxito!");

} catch (error) {
    console.error("Error al procesar:", error);
}
