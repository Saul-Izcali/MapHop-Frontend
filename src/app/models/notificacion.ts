export interface Notificacion {
    _id?: string;
	fechaCreacion?: Date;
	tipoNotificacion: string
	folioReporte?: string;
	tipoProblema?: string;
	fechaReporte?: Date;
	usuarios: [
        {
            _id?: string;
        }
    ]
    createdAt?: string;
    updatedAt?: string;
}