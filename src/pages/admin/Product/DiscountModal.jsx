import { useState } from "react";
import { Formik } from "formik";
import { FlexRow, Form } from "../../../styles/layout";
import { Title } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import { BiSolidOffer } from "react-icons/bi";
import { Spinner } from "reactstrap";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { validate } from "./validate";
import { FaTrashAlt } from "react-icons/fa";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/auth";

function DiscountModal({ product, isActive, setIsActive, setMainProduct, currentPrice }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setProduct } = useAdmin();
  const { user } = useAuth();

  const initialValues = {
    price: product.discount ? product.discount.price : ""
  }

  const onDiscount = async (values) => {
    try {
      setIsLoading(true);
      const body = {
        productId: product.id,
        price: values.price * 1,
        employeeId: user.employeeId
      }

      const url = product.discount ? `discounts/${product.discount.id}` : "discounts";
      const discount = await apiFetch(url, { body, method: product.discount ? "PUT" : "POST" });
      const updatedProduct = {...product, discount: discount.data};
      setProduct(product.id, updatedProduct);
      setMainProduct(updatedProduct);
      setIsLoading(false);
      setIsActive(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await apiFetch(`discounts/${product.discount.id}?employeeId=${user.employeeId}`, { method: "DELETE" });
      const updatedProduct = {...product, discount: null};
      setProduct(product.id, updatedProduct);
      setMainProduct(updatedProduct);
      setIsDeleting(false);
      setIsActive(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsDeleting(false);
    }
  }
  
  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <Formik
        initialValues={initialValues}
        validate={(values) => validate(values, currentPrice)}
        onSubmit={onDiscount}
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
          <Form onSubmit={handleSubmit}>
            <Title>{ product.discount ? "Editar descuento" : "Crear descuento" }</Title>
            <Input
              id="price"
              label="Precio"
              placeholder="S/. 0.0"
              value={values.price}
              error={errors.price}
              touched={touched.price}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <FlexRow
              width="100%"
              justify="space-between"
              gap={1}
              style={{marginTop: "0.7rem"}}
            >
              <Button
                type="submit"
                iconSize={18}
                fontSize={17}
                size="full"
                disabled={!isValid || isLoading}
                Icon={isLoading ? null : BiSolidOffer}
              >
                {
                  product.discount
                  ? (
                      isLoading
                      ? <>
                          <Spinner size="sm" />
                          Editando...
                        </>
                      : "Editar"
                    )
                  : (
                      isLoading
                      ? <>
                          <Spinner size="sm" />
                          Creando...
                        </>
                      : "Crear"
                    )
                }
              </Button>
              {
                product.discount
                &&
                <Button
                  iconSize={18}
                  fontSize={17}
                  size="full"
                  disabled={isDeleting || isLoading}
                  Icon={FaTrashAlt}
                  color="danger"
                  onClick={onDelete}
                >
                  {
                    isDeleting
                    ? <>
                        <Spinner size="sm" />
                        Eliminando...
                      </>
                    : "Eliminar"
                  }
                </Button>
              }
            </FlexRow>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default DiscountModal;
