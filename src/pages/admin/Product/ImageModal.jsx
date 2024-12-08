import { useState } from "react";
import Modal from "../../../components/Modal";
import { Formik } from "formik";
import { Form, Image } from "../../../styles/layout";
import { Title } from "../../../components/ProductForm/styles";
import { Input, Spinner } from "reactstrap";
import Button from "../../../components/Button";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { useAdmin } from "../../../context/admin";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function ImageModal({ product, isActive, setIsActive, setProduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { addProductImage } = useAdmin();

  const initialValues = { file: "" };

  const handleFileChange = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => setPreviewImage(reader.result);

    if(file) reader.readAsDataURL(file);

  }

  const handleChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("file", file);
    handleFileChange(file);
  }

  const validate = (values) => {
    const errors = {};

    if(!values.file) errors.file = "Este campo es obligatorio";

    return errors;
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const newProduct = await addProductImage(product, values.file);
      setProduct(newProduct);
      setIsLoading(false);
      setIsActive(false);
      setPreviewImage(null);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setPreviewImage(null);
    setIsActive();
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={handleClose}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({
          touched,
          errors,
          isValid,
          setFieldValue,
          handleBlur,
          handleSubmit
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>Agregar imagen</Title>
            <Input 
              id="file"
              type="file"
              accept="image/*"
              valid={touched.file && !errors.file}
              invalid={errors.file && touched.file}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e, setFieldValue)}
            />
            {
              previewImage
              &&
              <Image 
                width="250px"
                src={previewImage}
                alt={product.name}
              />
            }
            <Button
              type="submit"
              iconSize={18}
              disabled={!isValid || isLoading}
              fontSize={16}
              Icon={isLoading ? null: AiTwotoneFileAdd}
              size="full"
              style={{marginTop: "1rem"}}
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
    </Modal>
  );
}

export default ImageModal;
