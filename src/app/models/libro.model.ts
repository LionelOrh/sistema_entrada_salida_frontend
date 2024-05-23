import { Usuario } from "./usuario.model";
import { Editorial } from "./editorial.model";
import { DataCatalogo } from "./dataCatalogo.model";

export class Libro {
        idLibro?: number;
        titulo?: string;
        anio?: number;
        serie?: string;
        categoriaLibro?: DataCatalogo; // Inicialización del objeto categoria
        estadoPrestamo?: DataCatalogo;
        tipoLibro?: DataCatalogo;
        editorial?: Editorial;
        usuarioRegistro?: Usuario;
        usuarioActualiza?: Usuario;
        estado?: number;
    }
    

