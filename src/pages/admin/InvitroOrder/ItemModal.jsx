import { useState } from "react";
import Modal from "../../../components/Modal";
import { Form } from "../../../styles/layout";
import { Formik } from "formik";
import { validate } from "./validate";
import { useAdmin } from "../../../context/admin";
import { Group, Title } from "../../../components/ProductForm/styles";
import Select from "../../../components/Input/Select";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";

function ItemModal({ isActive, setIsActive, item, vitroOrder, setVitroOrder, setItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setError, tubers, addItem, editItem } = useAdmin();

  let initialValues = {
    vitroOrderId: vitroOrder.id,
    varietyId: "",
    price: "",
    quantity: ""
  };

  if(item) {
    initialValues = {
      ...initialValues,
      varietyId: item.variety.id,
      price: item.price,
      quantity: item.quantity
    }
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const newVitroOrder = item ? await editItem(item.id, values) : await addItem(values);
      setVitroOrder(newVitroOrder);
      setIsLoading(false);
      setIsActive(false);
      setItem("");
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

  const options = tubers.reduce((result, tuber) => {
    const varieties = tuber.varieties?.map(va => {
      const found = vitroOrder.items?.find(v => v.variety.id === va.id);

      return {
        id: va.id,
        content: `(${tuber.name}) ${va.name}`,
        disabled: !!found
      }
    });

    if(varieties) result.push(...varieties);
    return result;
  }, []);

  const onClose = (isActive) => {
    if(item) setItem("");
    setIsActive(isActive);
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
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>{ item ? "Editar variedad" : "Agregar variedad" }</Title>
            <Select 
              id="varietyId"
              label="Variedad"
              error={errors.varietyId}
              touched={touched.varietyId}
              handleBlur={handleBlur}
              handleChange={handleChange}
              options={options}
              value={values.varietyId}
              disabled={item}
            />
            <Group>
              <Input
                id="price"
                label="Precio"
                placeholder="S/. 0.0"
                value={values.price}
                error={errors.price}
                touched={touched.price}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
              <Input
                id="quantity"
                label="Cantidad"
                placeholder="ej. 2000"
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
                      !item ? "Agregando..." : "Editando..."
                    }
                  </>
                : !item ? "Agregar" : "Editar"
              }
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ItemModal;
