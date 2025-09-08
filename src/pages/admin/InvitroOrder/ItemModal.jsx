import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { Form, Text } from "../../../styles/layout";
import { Formik } from "formik";
import { validate } from "./validate";
import { useAdmin } from "../../../context/admin";
import { Group, Title } from "../../../components/ProductForm/styles";
import Select from "../../../components/Input/Select";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import { COLORS } from "../../../styles/colors";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/auth";
import apiFetch from "../../../services/apiFetch";

function ItemModal({ isActive, setIsActive, item, vitroOrder, setVitroOrder, setItem, orderItems, setOrderItems }) {
  const [currentVariety, setCurrentVariety] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { tubers, addItem, editItem } = useAdmin();

  const dateOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }

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

  useEffect(() => {
    setCurrentVariety(item.variety);
  }, [ item ]);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const quantity = !item ? values.quantity : values.quantity - item.quantity;
      const checkAvailability = await apiFetch(`vitroOrders/availableByMonth?date=${vitroOrder.finishDate}&quantity=${quantity}`);
      if(!checkAvailability.data.isAvailable) {
        toast.error(checkAvailability.data.message);
        return setIsLoading(false);
      }

      values.employeeId = user.employeeId;
      const {orderVariety, newVitroOrder} = item ? await editItem(item.id, values, setOrderItems) : await addItem(values);
      if(!item) setOrderItems([orderVariety, ...orderItems]);
      setVitroOrder(newVitroOrder);
      setIsLoading(false);
      setIsActive(false);
      setItem("");
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const options = tubers.reduce((result, tuber) => {
    const varieties = tuber.varieties?.map(va => {
      const found = orderItems.find(v => v.variety.id === va.id);

      return {
        id: va.id,
        content: `(${tuber.name}) ${va.name}`,
        disabled: !!found
      }
    });

    if(varieties) result.push(...varieties);
    return result;
  }, []);

  const onClose = () => {
    if(item) setItem("");
    setIsActive(false);
  }

  const onVarietyChange = (e, setFieldValue) => {
    const value = e.target.value;
    const tuber = tubers.find(tuber => tuber.varieties.find(va => va.id === (value * 1)));
    const variety = tuber.varieties.find(va => va.id === (value * 1));
    setCurrentVariety(variety);
    setFieldValue("varietyId", value);
    setFieldValue("price", variety.price);
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <Formik
        initialValues={initialValues}
        validate={(values) => validate(values, currentVariety)}
        onSubmit={onSubmit}
      >
        {({
          values,
          isValid,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>{ item ? "Editar variedad" : "Agregar variedad" }</Title>
            {
              <Text
                size={15}
                weight={600}
                color={COLORS.dim}
                align="start"
                style={{alignSelf: "flex-start"}}
              >
                Fecha de entrega programada:
                {" "}
                <span style={{color: COLORS.blue}}>
                  { new Date(vitroOrder.finishDate).toLocaleDateString("es-PE", dateOptions) }
                </span>
              </Text>
            }
            <Select
              id="varietyId"
              label="Variedad"
              error={errors.varietyId}
              touched={touched.varietyId}
              handleBlur={handleBlur}
              handleChange={(e) => onVarietyChange(e, setFieldValue)}
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
