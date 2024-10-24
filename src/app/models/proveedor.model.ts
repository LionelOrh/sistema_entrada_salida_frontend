import { TipoDocumento } from "./tipoDocumento.model";
import { Usuario } from "./usuario.model";

export class Proveedor {
    idProveedor?: number; 
    razonSocial?: string;
    ruc?: string;
    desProd?:string;
    nombres?: string;
    apellidos?: string;
    cargoRes?:string;
    tipoDocumento?: TipoDocumento;
    nroDoc?: string;
    estado?: number;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario
}