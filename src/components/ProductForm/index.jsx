import { Formik } from "formik";
import { useState } from "react";
import { validate } from "./validate";
import { Group, Title } from "./styles";
import Input from "../Input";
import TextArea from "../Input/TextArea";
import Button from "../Button";
import { Spinner } from "reactstrap";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useAdmin } from "../../context/admin";
import Select from "../Input/Select";
import { useNavigate } from "react-router-dom";
import { Form } from "../../styles/layout";

function ProductForm({ initialValues = {
  name: "",
  description: "",
  brand: "",
  categoryId: "",
  price: "",
  stock: "",
  isActive: true
}, isToCreate }) {
  const [isLoading, setIsLoading] = useState(false);
  const { categories, setError, addProduct } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const product = await addProduct(values);
      setIsLoading(false);
      navigate(`${product.id}`);
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

  let options = [];
  categories.forEach(category => {
    options.push(category);
    category.subCategories?.forEach(
      subCategory => (
        options.push({...subCategory, name: `(${category.name}) ${subCategory.name}`}))
    )
  });
  options = options.map(option => ({ id: option.id, content: option.name }));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleSubmit,
        handleChange,
        handleBlur
      }) => (
        <Form onSubmit={handleSubmit}>
          <Title>{ isToCreate ? "Nuevo producto" : "Editar producto" }</Title>
          <Input 
            id="name"
            label="Nombre"
            placeholder="Ingresa un nombre"
            error={errors.name}
            touched={touched.name}
            value={values.name}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <TextArea 
            id="description"
            label="Descripción"
            placeholder="Ingresa una descripción"
            error={errors.description}
            touched={touched.description}
            value={values.description}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Group>
            <Input 
              id="brand"
              label="Marca"
              placeholder="Ingresa una marca"
              error={errors.brand}
              touched={touched.brand}
              value={values.brand}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <Select
              id="categoryId"
              label="Categoría"
              error={errors.categoryId}
              touched={touched.categoryId}
              handleBlur={handleBlur}
              handleChange={handleChange}
              options={options}
              value={values.categoryId}
            />
          </Group>
          <Group>
            <Input 
              id="price"
              label="Precio"
              placeholder="S/. 0.0"
              error={errors.price}
              touched={touched.price}
              value={values.price}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <Input 
              id="stock"
              label="Cantidad"
              placeholder="Ingresa el stock"
              error={errors.stock}
              touched={touched.stock}
              value={values.stock}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Group>
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{marginTop: "0.7rem"}}
            disabled={!isValid || isLoading}
            Icon={isLoading ? null : IoMdAddCircleOutline}
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

export default ProductForm;
