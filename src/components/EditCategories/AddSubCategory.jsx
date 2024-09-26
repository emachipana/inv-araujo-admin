import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "./styles";
import Select from "../Input/Select";
import Input from "../Input";
import Button from "../Button";
import { Spinner } from "reactstrap";
import { onSubmit } from "./handlers";

function AddSubCategory({ setCurrentAction }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addSubCategory, setError, categories } = useAdmin();

  const values = {
    name: "",
    categoryId: ""
  }

  const options = categories.map(category => ({ id: category.id, content: category.name }));

  return (
    <Formik
      initialValues={values}
      validate={(values) => validate(values, "subCategory")}
      onSubmit={(values) => onSubmit(values, setIsLoading, addSubCategory, setCurrentAction, setError, "categories")}
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
          <Select
            fontSize={15}
            labelSize={16}
            error={errors.categoryId}
            id="categoryId"
            label="Elige una categoría"
            handleBlur={handleBlur}
            handleChange={handleChange}
            touched={touched.categoryId}
            options={options}
          />
          <Input
            fontSize={15}
            labelSize={16}
            id="name"
            label="Subcategoría"
            handleBlur={handleBlur}
            handleChange={handleChange}
            error={errors.name}
            value={values.name}
            touched={touched.name}
            placeholder="Ingresa el nombre"
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

export default AddSubCategory;
