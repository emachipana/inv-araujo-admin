export const errorParser = (message) => {
	if(message.includes("Failed to fetch")) return "Lo sentimos, el servidor no responde";
	if(message.includes("Bad credentials")) return "Credenciales incorrectas";
	if(message.includes("Duplicate entry")) return "Correo o documento de identidad en uso";
	if(message.includes("delete or update a parent row")) return "El registro tiene otros elementos asociados";
	if(message.includes("must be greater")) return "El descuento tiene que ser menor al precio del producto";
	if(message.includes("unidad de medida no puede ir vacía")) return "La unidad de medida no puede ir vacía";

	return message.replaceAll('"', "");
}
