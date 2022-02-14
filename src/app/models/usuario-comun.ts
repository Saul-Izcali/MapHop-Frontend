export interface UsuarioComun {
	_id?: string;
    nombre: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correoElectronico: string;
	nombreUsuario: string;
	contrasena: string;
	reputacion?: number;
    createdAt?: string;
    updatedAt?: string;
}