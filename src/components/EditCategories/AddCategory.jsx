import { Formik } from "formik";
import { Form } from "./styles";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { Input as InputFile, Spinner } from "reactstrap";
import { validate } from "./validate";
import { onSubmit } from "./handlers";
import TextArea from "../Input/TextArea";
import { FlexColumn, Image, Text } from "../../styles/layout";

function AddCategory({ setCurrentAction, to, addCategory }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const values = {name: "", description: "", file: ""};

  const onInputFileChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    setFieldValue("file", file);

    const reader = new FileReader();

    reader.onloadend = () => setPreviewImage(reader.result);

    if(file) reader.readAsDataURL(file);
  }

  return (
    <Formik
      initialValues={values}
      validate={(values) => validate(values, "categories")}
      onSubmit={(values) => onSubmit(values, setIsLoading, addCategory, setCurrentAction, to)}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        setFieldValue,
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
          {
            to === "categories"
            &&
            <>
              <TextArea
                fontSize={15}
                labelSize={16}
                id="description"
                label="Descripción"
                placeholder="Ingresa una descripción"
                error={errors.description}
                touched={touched.description}
                value={values.description}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <FlexColumn>
                <Text weight="700">Imagen</Text>
                <InputFile
                  id="file"
                  type="file"
                  accept="image/*"
                  valid={touched.file && !errors.file}
                  invalid={errors.file && touched.file}
                  onBlur={handleBlur}
                  onChange={(e) => onInputFileChange(e, setFieldValue)}
                /> 
              </FlexColumn>
              {
                previewImage
                &&
                <Image
                  style={{alignSelf: "center"}}
                  width="250px"
                  src={previewImage}
                />
              }
            </>
          }
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
