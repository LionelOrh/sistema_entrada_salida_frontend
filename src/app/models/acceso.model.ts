import { Rol } from "./rol.model";

export class Acceso {
    idAccesos?: number;
    codigo?: number;
    fechaAcceso?: string;
    estado?: number;
    rol?: Rol;
}