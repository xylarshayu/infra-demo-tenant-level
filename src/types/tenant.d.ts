export interface ITenant {
	id: string;
	tenantId: number;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
	isActive: boolean;
	__x_db_uri?: string;
}
