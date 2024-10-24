import { Rol } from "./rol.model";
import { Usuario } from "./usuario.model";

export class Acceso {
    idAcceso?: number;
    codigo?: string;
    fecha?: Date;
    estado?: number;
    rol?: Rol;
    usuarioRegistro?: Usuario;
}