import { Formik } from "formik";
import { Form } from "./styles";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { Spinner } from "reactstrap";
import { validate } from "./validate";
import { onSubmit } from "./handlers";

function AddCategory({ setCurrentAction, to, addCategory }) {
  const [isLoading, setIsLoading] = useState(false);

  const values = {name: ""}

  return (
    <Formik
      initialValues={values}
      validate={validate}
      onSubmit={(values) => onSubmit(values, setIsLoading, addCategory, setCurrentAction, to)}
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
            label={to === "categories" ? "Categoría" : "Tubérculo"}
            labelSize={16}
            error={errors.name}
            id="name"
            placeholder="Ingresa el nombre"
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
