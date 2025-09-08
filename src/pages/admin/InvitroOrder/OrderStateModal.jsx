import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { FlexColumn, FlexRow, Form, Image, Text } from "../../../styles/layout";
import { MdCancel } from "react-icons/md";
import { LineProgress, State, StateAction, StateSection } from "../Order/styles";
import { COLORS } from "../../../styles/colors";
import { IoIosTime } from "react-icons/io";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import StateCard from "../../../components/StateCard";
import { IoClose } from "react-icons/io5";
import { Formik } from "formik";
import { Spinner, Input as InputFile } from "reactstrap";
import { useState } from "react";
import { Group } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import { PiPlantFill } from "react-icons/pi";
import apiFetch from "../../../services/apiFetch";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import SelectShipping from "./SelectShipping";
import { orderStateValidate } from "./validate";
import { departments, provinces } from "../../../data/places";
import { useAdmin } from "../../../context/admin";

function OrderStateModal({ isActive, setIsActive, order, setOrder }) {
  const [currentAction, setCurrentAction] = useState(null);
  const [shipSelected, setShipSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { vitroOrderAtAgency, vitroOrderDelivered } = useAdmin();
  const { status, location, shippingType } = order;
  const orderStatus = 
    status === "ENTREGADO" 
    ? "ENTREGADO" 
    : (order.isReady && location !== "AGENCIA") ? "TERMINADO" : location === "AGENCIA" 
      ? "AGENCIA" 
      : status;

  const onClose = () => {
    setIsLoading(false);
    setCurrentAction(null);
    setPreviewImage(null);
    setShipSelected("");
  }

  const onInputFileChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    setFieldValue("file", file);

    const reader = new FileReader();

    reader.onloadend = () => setPreviewImage(reader.result);

    if(file) reader.readAsDataURL(file);
  }

  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      if(currentAction === "order-ended") {
        const updatedOrder = await apiFetch(`vitroOrders/${order.id}/ended`, { method: "PUT" });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "select-shipping") {
        let receiverInfo;
        let pickupInfo;

        if(shipSelected === "ENVIO_AGENCIA") {
          receiverInfo = {
            fullName: values.fullName,
            document: values.document,
            phone: values.phone
          }
        }else if(shipSelected === "RECOJO_ALMACEN") {
          pickupInfo = {
            date: values.date,
            hour: values.hour
          }
        }

        const body = {
          shippingType: shipSelected,
          department: shipSelected === "RECOJO_ALMACEN" ? "Junin" : departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo,
          city: shipSelected === "RECOJO_ALMACEN" ? "Huancayo" : provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo,
          receiverInfo,
          pickupInfo,
        }

        const updatedOrder = await apiFetch(`vitroOrders/${order.id}/addShippingType`, { method: "PUT", body });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "agency") {
        const updatedOrder = await vitroOrderAtAgency(order.id, values);
        setOrder(updatedOrder);
        setIsLoading(false);
        setCurrentAction(null);
        setShipSelected("");
      }else if(currentAction === "delivered-warehouse") {
        const updatedOrder = await vitroOrderDelivered(order.id, values);
        setOrder(updatedOrder);
        setIsLoading(false);
        setCurrentAction(null);
        setShipSelected("");
      }else if(currentAction === "delivered") {
        const updatedOrder = await apiFetch(`vitroOrders/${order.id}/status`, { body: { status: "ENTREGADO" }, method: "PUT" });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
        setShipSelected("");
      }
    }catch(e) {
      setIsLoading(false);
      console.error(e);
      toast.error(errorParser(e.message));
    }
  }

  const initialValues = {
    shippingType: "",
    // agencia
    city: "",
    department: "",
    fullName: "",
    document: "",
    phone: "",
    // recojo
    date: "",
    hour: "",
    // deliv
    file: "",
    trackingCode: "",
    code: ""
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
      size="md"
      align={shipSelected === "ENVIO_AGENCIA" ? "flex-start" : "center"}
    >
      <FlexColumn
        width="100%"
        align="flex-start"
        gap={1}
      >
        <Text
          size={20}
          weight={700}
        >
          Estado del pedido
        </Text>
        {
          order.status !== "CANCELADO"
          &&
          <StateSection>
            <div
              style={{position: "relative", zIndex: 5}}
            >
              <State
                color={COLORS.yellow_hover}
                isActive={orderStatus === "PENDIENTE"}
              >
                <IoIosTime
                  size={24}
                  color={orderStatus === "PENDIENTE" ? COLORS.yellow_hover : COLORS.dim}
                />
              </State>
              <Text
                weight={600}
                color={COLORS.dim}
                style={{position: "absolute", left: "50%", bottom: "-1.5rem", transform: "translateX(-50%)"}}
              >
                Producción
              </Text>
            </div>
            <div
              style={{position: "relative", zIndex: 5}}
            >
              <State
                color={COLORS.blue}
                isActive={orderStatus === "TERMINADO"}
              >
                <PiPlantFill
                  size={24}
                  color={orderStatus === "TERMINADO" ? COLORS.blue : COLORS.dim}
                />
              </State>
              <Text
                weight={600}
                color={COLORS.dim}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-1.5rem",
                  transform: "translateX(-50%)"
                }}
              >
                Terminado
              </Text>
            </div>
            {
              (!shippingType || shippingType === "ENVIO_AGENCIA")
              &&
              <div
                style={{position: "relative", zIndex: 5}}
              >
                <State
                  color={COLORS.purple}
                  isActive={orderStatus === "AGENCIA"}
                >
                  <FaShippingFast
                    size={24}
                    color={orderStatus === "AGENCIA" ? COLORS.purple : COLORS.dim}
                  />
                </State>
                <Text
                  weight={600}
                  color={COLORS.dim}
                  style={{
                    position: "absolute",
                    left: "50%", 
                    bottom: "-1.5rem", 
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {
                    !shippingType
                    ? "Entrega"
                    : "En agencia"
                  }
                </Text>
              </div>
            }
            <div
              style={{position: "relative", zIndex: 5}}
            >
              <State
                color={COLORS.persian}
                isActive={orderStatus === "ENTREGADO"}
              >
                <FaCheckCircle
                  size={24}
                  color={orderStatus === "ENTREGADO" ? COLORS.persian : COLORS.dim}
                />
              </State>
              <Text
                weight={600}
                color={COLORS.dim}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-1.5rem",
                  transform: "translateX(-50%)"
                }}
              >
                Entregado
              </Text>
            </div>
            <LineProgress />
          </StateSection>
        }
        <StateCard
          status={orderStatus}
          isVitro
        />
        {
          (order.isReady && (status !== "ENTREGADO" || status !== "AGENCIA") && order.total > order.totalAdvance)
          &&
          <Text
            size={14}
            color={COLORS.red}
          >
            *Para continuar con la entrega se debe completar el monto pendiente S/. { order.pending.toFixed(2) }
          </Text>
        }
        {
          currentAction !== null
          &&
          <StateAction>
            <IoClose
              size={24}
              color={COLORS.dim}
              style={{
                position: "absolute",
                right: "0.5rem", 
                top: "0.5rem", 
                cursor: "pointer"
              }}
              onClick={onClose}
            />
            <Text
              size={17}
              weight={700}
              color={COLORS.persian}
            >
              {
                currentAction === "order-ended"
                ? "Marcar como terminado"
                : currentAction === "agency"
                ? "Marcar en agencia"
                : currentAction === "delivered"
                ? "Marcar como entregado"
                : currentAction === "delivered-warehouse"
                ? "Marcar como entregado"
                : "Elegir tipo de entrega"
              }
            </Text>
            <Formik
              initialValues={initialValues}
              validate={(values) => orderStateValidate(values, currentAction, shipSelected)}
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
                <Form
                  onSubmit={handleSubmit}
                  gap={1.2}
                >
                  {
                    currentAction === "select-shipping"
                    &&
                    <>
                      <SelectShipping 
                        setFieldValue={setFieldValue}
                        shipType={shipSelected}
                        setShipType={setShipSelected}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                      />
                      <Button
                        type="submit"
                        size="full"
                        fontSize={15}
                        iconSize={18}
                        Icon={isLoading ? null : FaShippingFast}
                        style={{padding: "0.2rem", fontWeight: 600}}
                        color="purple"
                        disabled={isLoading || !isValid}
                      >
                        {
                          isLoading
                          ? <>
                              <Spinner size="sm" />
                              {" "}
                              Guardando...
                            </>
                          : "Guardar tipo de entrega"
                        }
                      </Button>
                    </>
                  }
                  {
                    currentAction === "order-ended"
                    &&
                    <> 
                      <FlexColumn
                        width="100%"
                        align="center"
                      >
                        <Text
                          size={17}
                          weight={600}
                          color={COLORS.dim}
                        >
                          ¿Está seguro de marcar el pedido como terminado?
                        </Text>
                        <FlexRow
                          width="100%"
                          gap={1}
                        >
                          <Button
                            type="submit"
                            fontSize={15}
                            iconSize={18}
                            Icon={isLoading ? null : FaCheckCircle}
                            style={{padding: "0.2rem 0.5rem", fontWeight: 600}}
                            disabled={isLoading}
                          >
                            {
                              isLoading
                              ? <>
                                  <Spinner size="sm" />
                                  {" "}
                                  Actualizando...
                                </>
                              : "Confirmar"
                            }
                          </Button>
                          <Button
                            fontSize={15}
                            iconSize={18}
                            Icon={MdCancel}
                            style={{padding: "0.2rem 0.5rem", fontWeight: 600}}
                            onClick={onClose}
                            type="button"
                            color="danger"
                            disabled={isLoading}
                          >
                            Cancelar
                          </Button>
                        </FlexRow>
                      </FlexColumn>
                    </>
                  }
                  {
                    currentAction === "agency"
                    &&
                    <>
                      <FlexColumn
                        width="100%"
                      >
                        <Text 
                          weight={700}
                          size={15}
                        >
                          Evidencia de la entrega
                        </Text>
                        <InputFile
                          id="file"
                          type="file"
                          accept="image/*"
                          valid={touched.file && !errors.file}
                          invalid={errors.file && touched.file}
                          onBlur={handleBlur}
                          style={{fontSize: "15px"}}
                          onChange={(e) => onInputFileChange(e, setFieldValue)}
                        />
                        {
                          previewImage
                          &&
                          <Image
                            style={{alignSelf: "center"}}
                            width="250px"
                            src={previewImage}
                          />
                        }
                      </FlexColumn>
                      <Group>
                        <Input
                          fontSize="15px"
                          labelSize={15}
                          id="trackingCode"
                          label="Código de seguimiento"
                          placeholder="Ingresa el código de seguimiento"
                          value={values.trackingCode}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          error={errors.trackingCode}
                          touched={touched.trackingCode}
                        />
                        <Input
                          fontSize="15px"
                          labelSize={15}
                          id="code"
                          label="Código de recojo"
                          placeholder="Ingresa el código de recojo"
                          value={values.code}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          error={errors.code}
                          touched={touched.code}
                        />
                      </Group>
                      <Button
                        type="submit"
                        size="full"
                        fontSize={15}
                        iconSize={18}
                        Icon={isLoading ? null : FaShippingFast}
                        style={{padding: "0.2rem", fontWeight: 600}}
                        color="purple"
                        onClick={() => setCurrentAction("agency")}
                        disabled={isLoading || !isValid}
                      >
                        {
                          isLoading
                          ? <>
                              <Spinner size="sm" />
                              {" "}
                              Actualizando...
                            </>
                          : "Marcar en agencia"
                        }
                      </Button>
                    </>
                  }
                  {
                    currentAction === "delivered-warehouse"
                    &&
                    <>
                      <FlexColumn
                        width="100%"
                      >
                        <Text 
                          weight={700}
                          size={15}
                        >
                          Evidencia de la entrega
                        </Text>
                        <InputFile
                          id="file"
                          type="file"
                          accept="image/*"
                          valid={touched.file && !errors.file}
                          invalid={errors.file && touched.file}
                          onBlur={handleBlur}
                          style={{fontSize: "15px"}}
                          onChange={(e) => onInputFileChange(e, setFieldValue)}
                        />
                        {
                          previewImage
                          &&
                          <Image
                            style={{alignSelf: "center"}}
                            width="250px"
                            src={previewImage}
                          />
                        }
                      </FlexColumn>
                      <Button
                        type="submit"
                        size="full"
                        fontSize={15}
                        iconSize={18}
                        Icon={isLoading ? null : FaCheckCircle}
                        style={{padding: "0.2rem", fontWeight: 600}}
                        onClick={() => setCurrentAction(shippingType === "RECOJO_ALMACEN" ? "delivered-warehouse": "delivered")}
                        disabled={isLoading || !isValid}
                      >
                        {
                          isLoading
                          ? <>
                              <Spinner size="sm" />
                              {" "}
                              Actualizando...
                            </>
                          : "Marcar como entregado"
                        }
                      </Button>
                    </>
                  }
                  {
                    currentAction === "delivered"
                    &&
                    <FlexColumn
                      width="100%"
                      align="center"
                    >
                      <Text
                        size={17}
                        weight={600}
                        color={COLORS.dim}
                      >
                        ¿Está seguro de marcar el pedido como entregado?
                      </Text>
                      <FlexRow
                        width="100%"
                        gap={1}
                      >
                        <Button
                          type="submit"
                          fontSize={15}
                          iconSize={18}
                          Icon={isLoading ? null : FaCheckCircle}
                          style={{padding: "0.2rem 0.5rem", fontWeight: 600}}
                          disabled={isLoading}
                        >
                          {
                            isLoading
                            ? <>
                                <Spinner size="sm" />
                                {" "}
                                Actualizando...
                              </>
                            : "Confirmar"
                          }
                        </Button>
                        <Button
                          fontSize={15}
                          iconSize={18}
                          Icon={MdCancel}
                          style={{padding: "0.2rem 0.5rem", fontWeight: 600}}
                          onClick={onClose}
                          type="button"
                          color="danger"
                          disabled={isLoading}
                        >
                          Cancelar
                        </Button>
                      </FlexRow>
                    </FlexColumn>
                  }
                </Form>
              )}
            </Formik>
          </StateAction>
        }
        {
          orderStatus !== "ENTREGADO" && currentAction === null
          &&
          <FlexColumn
            width="100%"
          >
            {
              orderStatus === "PENDIENTE"
              &&
              <Button
                size="full"
                fontSize={15}
                iconSize={18}
                Icon={PiPlantFill}
                style={{padding: "0.2rem", fontWeight: 600}}
                color="blue"
                onClick={() => setCurrentAction("order-ended")}
              >
                Marcar como terminado
              </Button>
            }
            {
              (order.isReady && shippingType === "ENVIO_AGENCIA" && order.totalAdvance === order.total && orderStatus !== "AGENCIA")
              &&
              <Button
                size="full"
                fontSize={15}
                iconSize={18}
                Icon={FaShippingFast}
                style={{padding: "0.2rem", fontWeight: 600}}
                color="purple"
                onClick={() => setCurrentAction("agency")}
              >
                Marcar en agencia
              </Button>
            }
            {
              (order.isReady && order.totalAdvance >= order.total && !order.shippingType)
              &&
              <Button
                size="full"
                fontSize={15}
                iconSize={18}
                Icon={FaShippingFast}
                style={{padding: "0.2rem", fontWeight: 600}}
                color="purple"
                onClick={() => setCurrentAction("select-shipping")}
                disabled={order.createdBy !== "ADMINISTRADOR"}
              >
                {
                  order.createdBy === "ADMINISTRADOR"
                  ? "Elegir tipo de entrega"
                  : "Esperando la elección del tipo de entrega..."
                }
              </Button>
            }
            {
              (orderStatus === "AGENCIA" || (shippingType === "RECOJO_ALMACEN" && order.isReady))
              &&
              <Button
                size="full"
                fontSize={15}
                iconSize={18}
                Icon={FaCheckCircle}
                style={{padding: "0.2rem", fontWeight: 600}}
                onClick={() => setCurrentAction(shippingType === "RECOJO_ALMACEN" ? "delivered-warehouse": "delivered")}
              >
                Marcar como entregado
              </Button>
            }
          </FlexColumn>
        }
      </FlexColumn>
    </Modal>
  );
}

export default OrderStateModal;
