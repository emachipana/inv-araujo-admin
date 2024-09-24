export const handleChange = (event, setCategory) => {
  const value = event.target.value;
  let error;
  if(value.length < 3) error = "El mínimo son 3 caracteres";

  setCategory(category => ({...category, value, error}));
}

export const handleBlur = (setCategory) => setCategory(category => ({...category, touched: true}));

export const setupEdit = (value, setIsToEdit, setCategory) => {
  setIsToEdit(isToEdit => !isToEdit);
  setCategory(category => ({...category, value}))
}

export const closeEdit = (setIsToEdit, setCategory) => {
  setIsToEdit(isToEdit => !isToEdit);
  setCategory({ value: "", error: "", touched: false });
}

export const onSave = async (category, id, body, setIsToEdit, setCategory, updateCategory, setIsLoading) => {
  if(category.error) return;
  try {
    setIsLoading(true);
    await updateCategory(id, body);
    closeEdit(setIsToEdit, setCategory);
    setIsLoading(false);
  }catch(error) {
    console.error(error);
    setIsLoading(false);
  }
}

export const onSubmit = async (values, setIsLoading, addCategory, setCurrentAction, setError, to) => {
  try {
    setIsLoading(true);
    await addCategory(values);
    setIsLoading(false);
    setCurrentAction(to);
  }catch(error) {
    setIsLoading(false);
    console.error(error);
    setError(error.message);
  }
}
