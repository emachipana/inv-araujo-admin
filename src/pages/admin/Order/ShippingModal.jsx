import { useState } from "react";
import Modal from "../../../components/Modal";
import { capitalizeAll } from "../../../helpers/capitalize";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Form, Text } from "../../../styles/layout";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";
import { Formik } from "formik";
import Button from "../../../components/Button";
import { FaEdit } from "react-icons/fa";
import { validateShipping } from "./validateShipping";
import { Group } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import Select from "../../../components/Input/Select";
import { departments, provinces } from "../../../data/places";
import { onDepChange } from "../../../components/VitroForm/handlers";
import { Spinner } from "reactstrap";
import { MdCancel } from "react-icons/md";
import apiFetch from "../../../services/apiFetch";
import toast from "react-hot-toast";
import { getCurrentDep } from "./handlers";
import { errorParser } from "../../../helpers/errorParser";

function ShippingModal({ isActive, setIsActive, order, setOrder, type = "order" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDep, setCurrentDep] = useState(getCurrentDep(order));
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const [pickupHours, setPickupHours] = useState([]);

  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  }
  
  const receiverValues = {
    fullName: capitalizeAll(order.receiverInfo?.fullName?.toLowerCase() || ""),
    document: order.receiverInfo?.document,
    phone: order.receiverInfo?.phone,
    city: order.city,
    department: order.department,
  }

  const pickupValues = {
    date: "",
    hour: "",
  }

  let optionsDep = {};
  let optionsProv = {};

  if(order.createdBy === "ADMINISTRADOR") {
    optionsDep = departments.map(department => ({id: department.id_ubigeo, content: department.nombre_ubigeo}));
    optionsProv = provinces[currentDep]?.map(prov => ({id: prov.id_ubigeo, content: prov.nombre_ubigeo}));

    if(order.shippingType === "ENVIO_AGENCIA") {
      receiverValues.department = getCurrentDep(order);
      receiverValues.city = provinces[currentDep].find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo;
    }
  }

  const getMinDate = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    
    if (currentHour > 17 || (currentHour === 17 && currentMinutes >= 30)) {
      today.setDate(today.getDate() + 1);
    }
    
    return today.toISOString().split('T')[0];
  };

  const formatTimeTo12h = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleDateChange = async (e, setFieldValue) => {
    const selectedDate = e.target.value;
    setFieldValue('date', selectedDate);
    setFieldValue('hour', '');
    
    try {
      setIsLoadingHours(true);
      const response = await apiFetch(`orders/availableHours?date=${selectedDate}`);
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      
      const today = now.toISOString().split('T')[0];
      const hours = selectedDate === today 
        ? response.data.hours.filter(hour => hour > currentTime)
        : response.data.hours;
      
      const formattedHours = hours.map(hour => ({
        id: hour,
        content: formatTimeTo12h(hour)
      }));
      
      setPickupHours(formattedHours);
    } catch (error) {
      console.error('Error fetching available hours:', error);
      toast.error('Error al cargar las horas disponibles');
      setPickupHours([]);
    } finally {
      setIsLoadingHours(false);
    }
  };

    const onSubmit = async (values) => {
      setIsLoading(true);
  
      try {
        if(order.shippingType === "ENVIO_AGENCIA") {
          const department = departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo;
          const city = provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo;
          const body = {
            fullName: values.fullName,
            document: values.document,
            phone: values.phone,
            department,
            city
          }
  
          const orderUpdated = await apiFetch(`${type === "order" ? "orders" : "vitroOrders"}/${order.id}/updateReceiverInfo`, { body, method: "PUT" });
          setOrder(orderUpdated.data);
          setIsLoading(false);
          setIsEditing(false);
        }else if(order.shippingType === "RECOJO_ALMACEN") {
          const body = {
            ...values
          }
  
          const orderUpdated = await apiFetch(`${type === "order" ? "orders" : "vitroOrders"}/${order.id}/updatePickupInfo`, { body, method: "PUT" });
          setOrder(orderUpdated.data);
          setIsLoading(false);
          setIsEditing(false);
        }
      }catch(e) {
        toast.error(errorParser(e.message));
        setIsLoading(false);
      }
    }

  return (
    <Modal
      align="center"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn>
        <Text
          weight={700}
          size={18}
        >
          { 
            order.shippingType === "ENVIO_AGENCIA"
            ? "Datos de envío"
            : "Datos de recojo"
          }
        </Text>
        <Variety>
          <Wrapper>
            {
              order.shippingType === "ENVIO_AGENCIA"
              ? isEditing
                ? <Formik
                    initialValues={receiverValues}
                    validate={(values) => validateShipping(values, "ENVIO_AGENCIA")}
                    onSubmit={onSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      setFieldValue,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                          <Input
                            fontSize="15px"
                            labelSize={15}
                            id="fullName"
                            label="Nombre completo"
                            placeholder="Ingresa el nombre completo"
                            value={values.fullName}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            error={errors.fullName}
                            touched={touched.fullName}
                          />
                          <Group>
                            <Input
                              fontSize="15px"
                              labelSize={15}
                              id="document"
                              label="DNI"
                              placeholder="Ingresa el DNI"
                              value={values.document}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              error={errors.document}
                              touched={touched.document}
                            />
                            <Input
                              fontSize="15px"
                              labelSize={15}
                              id="phone"
                              label="Teléfono"
                              placeholder="Ingresa el teléfono"
                              value={values.phone}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              error={errors.phone}
                              touched={touched.phone}
                            />
                          </Group>
                          <Group>
                            <Select
                              fontSize="15px"
                              labelSize={15}
                              id="department"
                              label="Departamento"
                              error={errors.department}
                              touched={touched.department}
                              value={values.department}
                              options={optionsDep}
                              handleBlur={handleBlur}
                              handleChange={(e) => onDepChange(e, setFieldValue, setCurrentDep)}
                            />
                            <Select
                              fontSize="15px"
                              labelSize={15}
                              disabled={!currentDep}
                              id="city"
                              label="Ciudad"
                              options={optionsProv}
                              error={errors.city}
                              touched={touched.city}
                              value={values.city}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Group>
                          <FlexRow
                            width="100%"
                            gap={1}
                            style={{marginTop: "0.5rem"}}
                          >
                            <Button
                              color="warning"
                              fontSize={14}
                              iconSize={15}
                              Icon={isLoading ? null : FaEdit}
                              style={{padding: "0.25rem 0.75rem"}}
                              type="submit"
                              disabled={!isValid || isLoading}
                            >
                              {
                                isLoading
                                ? <>
                                    <Spinner 
                                      size="sm"
                                    />
                                    Actualizando...
                                  </>
                                : "Actualizar"
                              }
                            </Button>
                            <Button
                              color="danger"
                              fontSize={14}
                              iconSize={16}
                              Icon={MdCancel}
                              style={{padding: "0.25rem 0.75rem"}}
                              type="button"
                              onClick={() => setIsEditing(false)}
                              disabled={isLoading}
                            >
                              Cancelar
                            </Button>
                          </FlexRow>
                        </Form>
                    )}
                  </Formik>
                : <>
                    <FlexColumn gap={0.1}>
                      <Text
                        weight={700}
                        size={15}
                      >
                        A nombre de
                      </Text>
                      <Text
                        weight={600}
                        size={14}
                        color={COLORS.dim}
                        align="start"
                      >
                        { capitalizeAll(order.receiverInfo?.fullName?.toLowerCase() || "") }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.1}>
                      <Text
                        weight={700}
                        size={15}
                      >
                        Documento
                      </Text>
                      <Text
                        weight={600}
                        size={14}
                        color={COLORS.dim}
                      >
                        { order.receiverInfo.document }
                      </Text>
                    </FlexColumn>
                  </>
              : isEditing
                ? <Formik
                    initialValues={pickupValues}
                    validate={(values) => validateShipping(values, "RECOJO_AGENCIA")}
                    onSubmit={onSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      handleChange,
                      handleSubmit,
                      handleBlur,
                      setFieldValue,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                          <Group>
                          <Input
                            fontSize="15px"
                            labelSize={15}
                            id="date"
                            label="Fecha"
                            error={errors.date}
                            touched={touched.date}
                            value={values.date}
                            type="date"
                            min={getMinDate()}
                            handleBlur={handleBlur}
                            handleChange={(e) => handleDateChange(e, setFieldValue)}
                          />
                          <Select
                            fontSize="15px"
                            labelSize={15}
                            disabled={isLoadingHours || !values.date}
                            id="hour"
                            label="Hora"
                            options={pickupHours}
                            error={errors.hour}
                            touched={touched.hour}
                            value={values.hour}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                          />
                          </Group>
                          <FlexRow
                            width="100%"
                            gap={1}
                            style={{marginTop: "0.5rem"}}
                          >
                            <Button
                              color="warning"
                              fontSize={14}
                              iconSize={15}
                              Icon={isLoading ? null : FaEdit}
                              style={{padding: "0.25rem 0.75rem"}}
                              type="submit"
                              disabled={!isValid || isLoading}
                            >
                              {
                                isLoading
                                ? <>
                                    <Spinner 
                                      size="sm"
                                    />
                                    Actualizando...
                                  </>
                                : "Actualizar"
                              }
                            </Button>
                            <Button
                              color="danger"
                              fontSize={14}
                              iconSize={16}
                              Icon={MdCancel}
                              style={{padding: "0.25rem 0.75rem"}}
                              type="button"
                              onClick={() => setIsEditing(false)}
                              disabled={isLoading}
                            >
                              Cancelar
                            </Button>
                          </FlexRow>
                        </Form>
                      )}
                  </Formik>
                : <>
                    <FlexColumn gap={0.1}>
                      <Text
                        weight={700}
                        size={15}
                      >
                        Fecha
                      </Text>
                      <Text
                        weight={600}
                        size={14}
                        color={COLORS.dim}
                      >
                        { new Date(`${order?.pickupInfo?.date}T${order?.pickupInfo?.hour}`).toLocaleDateString("es-ES", options) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.1}>
                      <Text
                        weight={700}
                        size={15}
                      >
                        Hora
                      </Text>
                      <Text
                        weight={600}
                        size={14}
                        color={COLORS.dim}
                      >
                        { (() => {
                            const [hours, minutes] = order?.pickupInfo?.hour?.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
                          })()}
                      </Text>
                    </FlexColumn>
                  </>
            }
          </Wrapper>
          {
            (order.shippingType === "ENVIO_AGENCIA" && !isEditing)
            &&
            <Wrapper>
              <FlexColumn gap={0.1}>
                <Text
                  weight={700}
                  size={15}
                >
                  Teléfono
                </Text>
                <Text
                  weight={600}
                  size={14}
                  color={COLORS.dim}
                >
                  { order.receiverInfo.phone }
                </Text>
              </FlexColumn>
              <FlexColumn gap={0.1}>
                <Text
                  weight={700}
                  size={15}
                >
                  Destino
                </Text>
                <Text
                  weight={600}
                  size={14}
                  color={COLORS.dim}
                >
                  { `${order.city}, ${order.department}` }
                </Text>
              </FlexColumn>
            </Wrapper>
          }
          {
            (order.createdBy === "ADMINISTRADOR" && order.location !== "AGENCIA" && !isEditing && order.status !== "ENTREGADO")
            &&
            <FlexRow
              width="100%"
            >
              <Button
                color="warning"
                fontSize={14}
                iconSize={15}
                Icon={FaEdit}
                style={{padding: "0.25rem 0.75rem"}}
                onClick={() => setIsEditing(true)}
              >
                {
                  order.shippingType === "ENVIO_AGENCIA"
                  ? "Editar datos de envío"
                  : "Editar datos de recojo"
                }
              </Button>
            </FlexRow>
          }
        </Variety>
      </FlexColumn>
    </Modal>
  );
}

export default ShippingModal;
