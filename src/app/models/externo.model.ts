import { TipoDocumento } from "./tipoDocumento.model";
import { Usuario } from "./usuario.model";

export class Externo {
    idExterno?: number;
    nombres?: string;
    apellidos?: string;
    celular?:string;
    tipoDoc?: TipoDocumento;
    nroDoc?: string;
    motivo?: string;
    estado?: number;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario
}