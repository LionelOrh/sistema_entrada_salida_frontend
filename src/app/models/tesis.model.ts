import { DataCatalogo } from "./dataCatalogo.model";
import { Usuario } from "./usuario.model";

export class Tesis {
    idTesis?:number;
    titulo?:string;
    fechaCreacion?:Date;
    tema?:DataCatalogo;
    idioma?:DataCatalogo;
    centroEstudios?:DataCatalogo;
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}


