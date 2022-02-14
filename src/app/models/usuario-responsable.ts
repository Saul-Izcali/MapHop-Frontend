export interface UsuarioResponsable {
    _id?: string;
    nombreUsuario: string;
    contrasena?: string;
    usuarioResponsable?:{
        institucion?: string;
        reporteAsignado?: {
            folio?: string;
            tipoProblema?: string;
            urgencia?: Number;
            fechaCreacion?: Date;
            estado?: string;
            ubicacion?: {
                longitud?: Number;
                latitud?: Number;
            }
        }
    }
    createdAt?: string;
    updatedAt?: string;
}
