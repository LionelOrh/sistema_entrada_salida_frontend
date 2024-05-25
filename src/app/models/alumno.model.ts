import { DataCatalogo } from "./dataCatalogo.model";
import { Pais } from "./pais.model";
import { Usuario } from "./usuario.model";

export class Alumno {

    idAlumno?:number;
    nombres?: string;
    apellidos?: string;
    telefono?:string;
    celular?:string;
    dni?: string;
    correo?: string;
    tipoSangre?: string;
    fechaNacimiento?: Date;
    pais?: Pais;
    estado?: number;
    modalidad?: DataCatalogo;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario

}
