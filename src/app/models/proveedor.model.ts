import { DataCatalogo } from "./dataCatalogo.model";
import { Usuario } from "./usuario.model";
import { Pais } from "./pais.model";

export class Proveedor {


    idEditorial?: number;
    razonSocial?:string;
    ruc?:string;
    direccion?:string;
    telefono?:string;
    celular?:string;
    contacto?:string;
    estado?: number;
    fechaRegistro?:Date;
    pais?:Pais;
    tipoProveedor?:DataCatalogo;
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}
