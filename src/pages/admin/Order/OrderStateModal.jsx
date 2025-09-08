import { useState } from "react";
import Modal from "../../../components/Modal";
import { FlexColumn, FlexRow, Form, Image, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { LineProgress, State, StateAction, StateSection } from "./styles";
import { IoIosTime } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdCancel, MdOutlineWallet } from "react-icons/md";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import StateCard from "../../../components/StateCard";
import Button from "../../../components/Button";
import { Formik } from "formik";
import Select from "../../../components/Input/Select";
import validate from "./validate";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import apiFetch from "../../../services/apiFetch";
import { useAuth } from "../../../context/auth";
import { Spinner, Input as InputFile } from "reactstrap";
import Input from "../../../components/Input";
import { Group } from "../../../components/ProductForm/styles";
import { useAdmin } from "../../../context/admin";

function OrderStateModal({isActive, setIsActive, order, setOrder, products}) {
  const [currentAction, setCurrentAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { status, location, shippingType } = order;
  const orderStatus = status === "ENTREGADO" ? "ENTREGADO" : location === "AGENCIA" ? "AGENCIA" : status;
  const { user } = useAuth();
  const { orderAtAgency, orderDelivered } = useAdmin();

  const onInputFileChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    setFieldValue("file", file);

    const reader = new FileReader();

    reader.onloadend = () => setPreviewImage(reader.result);

    if(file) reader.readAsDataURL(file);
  }

  const initialValues = {
    paymentType: "",
    file: "",
    trackingCode: "",
    code: "",
  }

  const paymentOptions = [
    {
      id: "TRANSFERENCIA",
      content: "Transferencia bancaria"
    },
    {
      id: "YAPE",
      content: "Yape"
    }
  ];

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      if(currentAction === "register-payment") {
        if(products.length <= 0) {
          setIsLoading(false);
          return toast.error("Primero debes registrar productos");
        }

        const body = {
          status: "PAGADO",
          paymentType: values.paymentType,
          operatorId: user.employeeId
        }

        const updatedOrder = await apiFetch(`orders/${order.id}/status`, { body, method: "PUT" });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "agency") {
        const updatedOrder = await orderAtAgency(order.id, values);
        setOrder(updatedOrder);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "delivered-warehouse") {
        const updatedOrder = await orderDelivered(order.id, values);
        setOrder(updatedOrder);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "delivered") {
        const updatedOrder = await apiFetch(`orders/${order.id}/status`, { body: { status: "ENTREGADO" }, method: "PUT" });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
      }else if(currentAction === "cancel-order") {
        const updatedOrder = await apiFetch(`orders/${order.id}/status`, { body: { status: "CANCELADO" }, method: "PUT" });
        setOrder(updatedOrder.data);
        setIsLoading(false);
        setCurrentAction(null);
      }
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      toast.error(errorParser(error.message));
    }
  }

  const onClose = () => {
    setIsLoading(false);
    setCurrentAction(null);
    setPreviewImage(null);
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
      size="md"
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
                Pendiente
              </Text>
            </div>
            <div
              style={{position: "relative", zIndex: 5}}
            >
              <State
                color={COLORS.blue}
                isActive={orderStatus === "PAGADO"}
              >
                <MdOutlineWallet
                  size={24}
                  color={orderStatus === "PAGADO" ? COLORS.blue : COLORS.dim}
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
                Pagado
              </Text>
            </div>
            {
              shippingType === "ENVIO_AGENCIA"
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
                  En agencia
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
        />
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
                currentAction === "register-payment"
                ? "Registrar pago"
                : currentAction === "agency"
                ? "Marcar en agencia"
                : currentAction === "delivered"
                ? "Marcar como entregado"
                : currentAction === "delivered-warehouse"
                ? "Marcar como entregado"
                : "Cancelar pedido"
              }
            </Text>
            <Formik
              initialValues={initialValues}
              validate={(values) => validate(values, currentAction)}
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
                    currentAction === "register-payment"
                    &&
                    <> 
                      <Select
                        fontSize="15px"
                        labelSize={15}
                        id="paymentType"
                        label="Elige el método de pago"
                        options={paymentOptions}
                        value={values.paymentType}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        error={errors.paymentType}
                        touched={touched.paymentType}
                      />
                      <Button
                        size="full"
                        type="submit"
                        fontSize={15}
                        iconSize={18}
                        Icon={isLoading ? null : MdOutlineWallet}
                        style={{padding: "0.2rem", fontWeight: 600}}
                        color="blue"
                        onClick={() => setCurrentAction("register-payment")}
                        disabled={isLoading || !isValid}
                      >
                        {
                          isLoading
                          ? <>
                              <Spinner size="sm" />
                              {" "}
                              Registrando...
                            </>
                          : "Registrar pago"
                        }
                      </Button>
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
                  {
                    currentAction === "cancel-order"
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
                        ¿Está seguro de cancelar el pedido?
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
                Icon={MdOutlineWallet}
                style={{padding: "0.2rem", fontWeight: 600}}
                color="blue"
                onClick={() => setCurrentAction("register-payment")}
              >
                Registrar pago
              </Button>
            }
            {
              (orderStatus === "PAGADO" && shippingType === "ENVIO_AGENCIA")
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
              (orderStatus === "AGENCIA" || (shippingType === "RECOJO_ALMACEN" && orderStatus === "PAGADO"))
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
            {
              (orderStatus !== "ENTREGADO" && orderStatus !== "AGENCIA" && orderStatus !== "CANCELADO")
              &&
              <Button
                size="full"
                fontSize={15}
                iconSize={18}
                Icon={MdCancel}
                style={{padding: "0.2rem", fontWeight: 600}}
                onClick={() => setCurrentAction("cancel-order")}
                color="danger"
              >
                Cancelar pedido
              </Button>
            }
          </FlexColumn>
        }
      </FlexColumn>
    </Modal>
  );
}

export default OrderStateModal;
