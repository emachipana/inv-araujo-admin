import { Formik } from "formik";
import { useAdmin } from "../../context/admin";
import { validate } from "./validate";
import { onSubmit } from "../EditCategories/handlers";
import { useState } from "react";
import { Form } from "../EditCategories/styles";
import Select from "../Input/Select";
import Input from "../Input";
import Button from "../Button";
import { Spinner } from "reactstrap";

function AddVariety({ setCurrentAction, id, tuberId, setEdit }) {
  const [isLoading, setIsLoading] = useState(false);
  const { tubers, setError, updateVariety, addVariety } = useAdmin();

  const handleUpdateVariety = async (body) => {
    await updateVariety(body);
    setEdit({ isActive: false, id: "", tuberId: "" });
  }

  let initialValues = {
    id,
    tuberId,
    name: "",
    price: "",
    minPrice: ""
  }

  if(id) {
    const tuber = tubers.find(tuber => tuber.id === tuberId);
    const variety = tuber.varieties.find(variety => variety.id === id);
    initialValues = {
      ...initialValues,
      name: variety.name,
      price: variety.price,
      minPrice: variety.minPrice
    }
  }

  const options = tubers.map(tuber => ({ id: tuber.id, content: tuber.name }));

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values) => onSubmit(values, setIsLoading, (id ? handleUpdateVariety : addVariety), setCurrentAction, setError, "tubers")}
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
            disabled={id}
            fontSize={15}
            labelSize={16}
            value={values.tuberId}
            error={errors.tuberId}
            id="tuberId"
            label="Elige un tubérculo"
            handleBlur={handleBlur}
            handleChange={handleChange}
            touched={touched.tuberId}
            options={options}
          />
          <Input
            fontSize={15}
            labelSize={16}
            id="name"
            label="Variedad"
            handleBlur={handleBlur}
            handleChange={handleChange}
            error={errors.name}
            value={values.name}
            touched={touched.name}
            placeholder="Ingresa el nombre"
          />
          <Input 
            fontSize={15}
            labelSize={16}
            id="price"
            label="Precio público"
            handleBlur={handleBlur}
            handleChange={handleChange}
            error={errors.price}
            value={values.price}
            touched={touched.price}
            placeholder="S/. 0.0"
          />
          <Input 
            fontSize={15}
            labelSize={16}
            id="minPrice"
            label="Precio mínimo"
            handleBlur={handleBlur}
            handleChange={handleChange}
            error={errors.minPrice}
            value={values.minPrice}
            touched={touched.minPrice}
            placeholder="S/. 0.0"
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
                  {
                    id ? "Editando..." : "Agregando..."
                  }
                </>
              : id ? "Editar" : "Agregar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );

}

export default AddVariety;
