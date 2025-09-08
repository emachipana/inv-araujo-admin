import { useState } from "react";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../../styles/layout";
import { Group, Title } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import Select from "../../../components/Input/Select";

function ItemModal({ isActive, setIsActive, profitId, item, setExpense, setItem, setExpenses }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState("");
  const { addExpenseItem, editExpenseItem } = useAdmin();

  let initialValues = {
    profitId,
    name: "",
    price: "",
    quantity: "",
    type: "",
  }

  if(item) initialValues = {
    ...initialValues,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    type: item.type
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const {expense, updatedProfit} = item ? await editExpenseItem(item.id, values, setExpenses) : await addExpenseItem(values);
      if(!item) setExpenses((expenses) => [expense, ...expenses]);
      setExpense(updatedProfit);
      setIsLoading(false);
      onClose();
      setItem("");
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const onClose = () => {
    if(item) setItem("");
    setIsActive(false);
  }

  const onChangeType = (e, setFieldValue) => {
    const value = e.target.value;

    setCurrentType(value);
    setFieldValue("type", value);

    if(value === "BIEN") {
      setFieldValue("quantity", "");
    }else if(value === "SERVICIO") {
      setFieldValue("quantity", 1);
    }
  }

  const options = [
    {
      id: "BIEN",
      content: "BIEN"
    },
    {
      id: "SERVICIO",
      content: "SERVICIO"
    }
  ]

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
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>{ item ? "Editar gasto" : "Registrar gasto" }</Title>
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
                id="type"
                label="Tipo"
                value={values.type}
                options={options}
                error={errors.type}
                touched={touched.type}
                handleBlur={handleBlur}
                handleChange={(e) => onChangeType(e, setFieldValue)}
              />
            </Group>
            <Group>
              <Input 
                id="price"
                label={(currentType === "SERVICIO" || initialValues.type === "SERVICIO") ? "Monto" : "Precio"}
                placeholder="S/ 00.00"
                value={values.price}
                error={errors.price}
                touched={touched.price}
                handleBlur={handleBlur}
                handleChange={handleChange}
                style={{
                  width: (currentType === "SERVICIO" || initialValues.type === "SERVICIO") ? "calc(50% - 0.5rem)" : "100%"
                }}
              />
              {
                (currentType !== "SERVICIO" && initialValues.type !== "SERVICIO")
                &&
                <Input 
                  id="quantity"
                  label="Cantidad"
                  disabled={!currentType && !initialValues.type}
                  placeholder="ej. 2"
                  value={values.quantity}
                  error={errors.quantity}
                  touched={touched.quantity}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              }
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
