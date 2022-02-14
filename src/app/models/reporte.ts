export interface Reporte {
    _id?: string;
	estado?: string;
	ubicacion: {
		longitud: number;
		latitud: number;
    }
	tipoProblema: string;
	fechaCreacion?: Date;
	fechaSolucion?: Date;
	credibilidad: number;
	urgenciaTiempo?: number;
	urgencia?: number,
	comentario?: string,
	vidaRiesgo?: number,
	asignado?: string,
	urgenciaOriginal?: number,
	cronico?: boolean,
	fantasma?: number,
	usuarios: [
        {
            _id?: string;
        }
    ]
    createdAt?: string;
    updatedAt?: string;
}