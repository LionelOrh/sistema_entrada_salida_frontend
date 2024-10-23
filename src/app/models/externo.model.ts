import { TipoDocumento } from "./tipoDocumento.model";
import { Usuario } from "./usuario.model";

export class Externo {
    idExterno?: number; 
    nombres?: string;
    apellidos?: string;
    celular?:string;
    correo?:string;
    tipoDocumento?: TipoDocumento;
    num_doc?: string;
    motivo?: string;
    estado?: number;
    usuarioRegistro?: Usuario;
}