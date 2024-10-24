import { useState } from "react";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import { Formik } from "formik";
import { validate } from "../Invoice/validate";
import { Form } from "../../../styles/layout";
import { Group, Title } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";

function ItemModal({ isActive, setIsActive, profitId, item, setExpense, setItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addExpenseItem, editExpenseItem } = useAdmin();

  let initialValues = {
    profitId,
    name: "",
    price: "",
    quantity: ""
  }

  if(item) initialValues = {
    ...initialValues,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const updatedExpense = item ? await editExpenseItem(item.id, values) : await addExpenseItem(values);
      setExpense(updatedExpense);
      setIsLoading(false);
      onClose();
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

  const onClose = () => {
    if(item) setItem("");
    setIsActive(false);
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({
          values,
          isValid,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>{ item ? "Editar gasto" : "Registrar gasto" }</Title>
            <Input
              id="name"
              label="Nombre"
              placeholder="Nombre del item"
              value={values.name}
              error={errors.name}
              touched={touched.name}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Group>
              <Input 
                id="price"
                label="Precio"
                placeholder="S/ 00.00"
                value={values.price}
                error={errors.price}
                touched={touched.price}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
              <Input 
                id="quantity"
                label="Cantidad"
                placeholder="ej. 2"
                value={values.quantity}
                error={errors.quantity}
                touched={touched.quantity}
                handleBlur={handleBlur}
                handleChange={handleChange}
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
                    {
                      !item ? "Registrando..." : "Editando..."
                    }
                  </>
                : !item ? "Registrar" : "Editar"
              }
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ItemModal;
