import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import Modal from "../../../components/Modal";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../../styles/layout";
import { Group, Title } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import Button from "../../../components/Button";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import Select from "../../../components/Input/Select";

function ItemModal({ isActive, setIsActive, item, invoiceId, setInvoice, setItem, setItems}) {
  const [isLoading, setIsLoading] = useState(false);
  const { addInvoiceItem, editInvoiceItem } = useAdmin();

  let initialValues = {
    invoiceId,
    name: "",
    price: "",
    quantity: "",
    unit: "",
  };

  if(item) {
    initialValues = {
      ...initialValues,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit
    }
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const {updatedInvoice, invoiceItem} = item ? await editInvoiceItem(item.id, values, setItems) : await addInvoiceItem(values);
      setInvoice(updatedInvoice);
      if(!item) setItems((invoiceItems) => [invoiceItem.data, ...invoiceItems]);
      setIsLoading(false);
      onClose();
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const onClose = () => {
    if(item) setItem("");
    setIsActive(false);
  }

  const unitOptions = [
    {
      id: "NIU",
      content: "Unidad"
    },
    {
      id: "SA",
      content: "Saco"
    },
    {
      id: "KGM",
      content: "Kilogramo"
    },
    {
      id: "WG",
      content: "Galón"
    },
    {
      id: "BJ",
      content: "Balde"
    },
    {
      id: "BX",
      content: "Caja"
    },
  ];

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
      size="md"
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
            <Title>{ item ? "Editar item" : "Agregar item" }</Title>
            <Group>
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
              <Select
                id="unit"
                label="Unidad de medida"
                error={errors.unit}
                touched={touched.unit}
                handleBlur={handleBlur}
                handleChange={handleChange}
                options={unitOptions}
                value={values.unit}
              />
            </Group>
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
