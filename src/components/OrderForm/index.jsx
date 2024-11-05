import { useEffect, useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { FlexRow, Form, Text } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import Input from "../Input";
import { formatDate, onDepChange, onDocChange, onDocTypeChange, onSearchChange } from "../VitroForm/handlers";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import Category from "../Category";
import Client from "../VitroForm/Client";
import { List, Products } from "../../pages/admin/Order/styles";
import { BiSearch } from "react-icons/bi";
import { COLORS } from "../../styles/colors";
import { validate } from "../VitroForm/validate";

function OrderForm({ initialValues = {
  documentType: "",
  document: "",
  rsocial: "",
  email: "",
  phone: "",
  department: "",
  city: "",
  initDate: "",
  status: ""
}, isToCreate, orderId, initialDocType = "", initialDep = "", clientId = "", invoice = null }) {
  const [currentAction, setCurrentAction] = useState("Nuevo cliente");
  const [currentDep, setCurrentDep] = useState(initialDep);
  const [docType, setDocType] = useState(initialDocType);
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchClients, setSearchClients] = useState([]);
  const [clientSelected, setClientSelected] = useState(clientId);
  const { setError, addOrder, updateOrder, departments, 
    provinces, matcher, loadDepartments,
    loadClients, addClient, clientsBackup } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.departments) await loadDepartments();

        if(!matcher.clients) {
          setIsLoading(true);
          await loadClients();
          setIsLoading(false);
        }

        setSearchClients(clientsBackup);
      }catch(error) {
        setError(error.message);
        console.error(error);
      }
    }
    
    fetch();
  }, [ loadDepartments, matcher, setError, loadClients, clientsBackup ]);

  const onSubmit = async (values) => {
    try {
      if(currentAction === "Cliente registrado" && !clientSelected) return;

      let orderBody = {
        clientId: clientSelected,
        department: departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo,
        city: provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo,
        date: values.initDate
      }

      setIsLoading(true);
      if(currentAction === "Nuevo cliente" && isToCreate) {
        const now = new Date();

        const clientBody = {
          ...values,
          department: departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo,
          city: provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo,
          documentType: (values.documentType * 1) === 1 ? "DNI" : "RUC",
          email: values.email ? values.email : `${now.getTime()}@inversiones.com`
        }

        const newCliet = await addClient(clientBody);
        orderBody = {
          ...orderBody,
          clientId: newCliet.id
        }
      }

      if(!isToCreate) orderBody = {...orderBody, status: initialValues.status, invoiceId: invoice ? invoice.id : null};

      const order = isToCreate ? await addOrder(orderBody) : await updateOrder(orderId, orderBody);
      setIsLoading(false);
      navigate(`/admin/pedidos/${order.id}`);
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

  const optionsDep = departments.map(department => ({id: department.id_ubigeo, content: department.nombre_ubigeo}));
  const optionsProv = provinces[currentDep]?.map(prov => ({id: prov.id_ubigeo, content: prov.nombre_ubigeo}));
  const today = new Date();
  today.setHours(12);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validate(values, docType, currentAction)}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit}>
          <Title>{ isToCreate ? "Generar pedido" : "Editar pedido" }</Title>
          {
            isToCreate
            &&
            <FlexRow gap={1}>
              <Category
                currentCategory={currentAction}
                name="Nuevo cliente"
                setCurrentCategory={setCurrentAction}
              />
              <Category
                currentCategory={currentAction}
                name="Cliente registrado"
                setCurrentCategory={setCurrentAction}
              />
            </FlexRow>
          }
          <Text
            align="start"
            style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
            size={18.5}
            weight={700}
            color={COLORS.dim}
          >
            Cliente
          </Text>
          {
            currentAction === "Nuevo cliente"
            ? <>
                <Group>
                  <Select
                    disabled={!isToCreate}
                    id="documentType"
                    labelSize={17}
                    label="Tipo de documento"
                    error={errors.documentType}
                    touched={touched.documentType}
                    value={values.documentType}
                    handleBlur={handleBlur}
                    handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "documentType")}
                    options={[
                      {
                        id: 1,
                        content: "DNI"
                      },
                      {
                        id: 2,
                        content: "RUC"
                      }
                    ]}
                  />
                  <Input
                    disabled={!docType || !isToCreate}
                    labelSize={17}
                    id="document"
                    label="Documento"
                    placeholder={docType || "Documento"}
                    error={errors.document}
                    touched={touched.document}
                    value={values.document}
                    handleBlur={handleBlur}
                    handleChange={(e) => onDocChange(e, setFieldValue, setError, docType)}
                  />
                </Group>
                <Input
                  labelSize={17}
                  disabled={!isToCreate}
                  id="rsocial"
                  label="Razón Social"
                  placeholder="ej. Araujo Estrada Yurfa"
                  error={errors.rsocial}
                  touched={touched.rsocial}
                  value={values.rsocial}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
                <Group>
                  <Input
                    labelSize={17}
                    id="email"
                    label="Correo"
                    placeholder="@gmail.com"
                    error={errors.email}
                    touched={touched.email}
                    value={values.email}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    disabled={!isToCreate}
                  />
                  <Input
                    disabled={!isToCreate}
                    labelSize={17}
                    id="phone"
                    label="Teléfono"
                    placeholder="ej. 990849369"
                    error={errors.phone}
                    touched={touched.phone}
                    value={values.phone}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                  />
                </Group>
                {
                  isToCreate
                  &&
                  <Group>
                    <Select
                      labelSize={17}
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
                      labelSize={17}
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
                }
              </>
            : <>
                <Products>
									<Input
										id="search"
										placeholder="Buscar cliente..."
										Icon={BiSearch}
										value={search}
										style={{width: "60%"}}
                    handleChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setSearchClients, setError, clientsBackup)}
									/>
									<List
                    height="150px"
                    gap="1rem"
                  >
										{
											isGetting
											? <Spinner color="secondary" />
											: searchClients.map((client, index) => (
													<Client
                            id={client.id}
                            rsocial={client.rsocial}
                            document={client.document}
                            department={client.department}
                            city={client.city}
														clientSelected={clientSelected}
														setClientSelected={setClientSelected}
														key={index}
                            setFieldValue={setFieldValue}
													/>
												))
										}
									</List>
								</Products>
              </>
          }
          <Text
            align="start"
            style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
            size={18.5}
            weight={700}
            color={COLORS.dim}
          >
            Pedido
          </Text>
          {
            ((currentAction === "Cliente registrado") || !isToCreate)
            &&
            <Group>
              <Select
                disabled={!clientSelected}
                labelSize={17}
                id="department"
                label="Departamento"
                error={errors.department}
                touched={touched.department}
                value={values.department || clientSelected.department}
                options={optionsDep}
                handleBlur={handleBlur}
                handleChange={(e) => onDepChange(e, setFieldValue, setCurrentDep)}
              />
              <Select
                labelSize={17}
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
          }
          <Group width={isToCreate ? 48 : ""}>
            <Input 
              id="initDate"
              label="Fecha pedido"
              type="date"
              max={formatDate(today)}
              error={errors.initDate}
              touched={touched.initDate}
              value={values.initDate}
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
                    isToCreate ? "Agregando..." : "Editando..."
                  }
                </>
              : isToCreate ? "Agregar" : "Editar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default OrderForm;
