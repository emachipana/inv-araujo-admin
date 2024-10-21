export const validate = (values) => {
  const errors = {};

  let title = [];

  if(!values.title) {
    errors.title = "Este campo es obligatorio";
  }else if(values.title.length < 5) {
    errors.title = "El mínimo son 5 caracters";
  }else {
    title = values.title.split(" ");
  }

  if(!values.description) {
    errors.description = "Este campo es obligatorio";
  }else if(values.description.length < 10) {
    errors.description = "El mínimo son 10 caracters";
  }

  if(!values.markedWord) {
    errors.markedWord = "Este campo es obligatorio";
  }else if(!title.find(word => word.toLowerCase() === values.markedWord.toLowerCase())) {
    errors.markedWord = "No se encuentra la palabra";
  }

  return errors;
}