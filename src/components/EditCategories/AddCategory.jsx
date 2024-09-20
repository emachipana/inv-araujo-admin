import { Formik } from "formik";
import { Form } from "./styles";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { Spinner } from "reactstrap";
import { useAdmin } from "../../context/admin";

function AddCategory({ setCurrentAction }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addCategory, setError } = useAdmin();

  const values = {
    name: ""
  }

  const validate = (values) => {
    const errors = {};

    if(!values.name) {
      errors.name = "Este campo es obligatorio";
    }else if(values.name.length < 3) {
      errors.name = "El mínimo son 3 caracteres"
    }

    return errors;
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      await addCategory(values);
      setIsLoading(false);
      setCurrentAction("categories");
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Formik
      initialValues={values}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        handleSubmit
      }) => (
        <Form onSubmit={handleSubmit}>
          <Input
            fontSize={15}
            label="Categoría"
            labelSize={16}
            error={errors.name}
            id="name"
            placeholder="Ingresa una categoría"
            value={values.name}
            handleBlur={handleBlur}
            handleChange={handleChange}
            touched={touched.name}
          />
          <Button
            fontSize={16}
            size="full"
            type="submit"
            disabled={isLoading || !isValid}
          >
            {
              isLoading
              ? <>
                  <Spinner size="sm" />
                  Agregando...
                </>
              : "Agregar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default AddCategory;
