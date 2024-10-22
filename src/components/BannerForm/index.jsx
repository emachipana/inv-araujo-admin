import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Title } from "../ProductForm/styles";
import Input from "../Input";
import TextArea from "../Input/TextArea";
import Button from "../Button";
import { Spinner } from "reactstrap";
import { IoMdAddCircleOutline } from "react-icons/io";

function BannerForm({ initialValues = {
  title: "",
  description: "",
  markedWord: "",
  used: false
}, isToCreate, bannerId, width }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addBanner, updateBanner } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const banner = isToCreate ? await addBanner(values) : await updateBanner(bannerId, values);
      setIsLoading(false);
      navigate(`/admin/banners/${banner.id}`);
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

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
        handleChange,
        handleBlur,
        handleSubmit
      }) => (
        <Form 
          onSubmit={handleSubmit}
          width={width}
        >
          <Title>{ isToCreate ? "Nuevo banner" : "Editar banner" }</Title>
          <Input 
            id="title"
            label="Título"
            placeholder="Título del banner"
            error={errors.title}
            touched={touched.title}
            value={values.title}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Input 
            id="markedWord"
            label="Palabra resaltada"
            placeholder="Escriba la palabra a resaltar"
            error={errors.markedWord}
            touched={touched.markedWord}
            value={values.markedWord}
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
                  {
                    isToCreate ? "Creando..." : "Editando..."
                  }
                </>
              : isToCreate ? "Crear" : "Editar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default BannerForm;
