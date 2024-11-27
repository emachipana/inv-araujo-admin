import { useState } from "react";
import { Container, Form, Logo, Section } from "../Login/styles";
import { useAuth } from "../../../context/auth";
import apiFetch from "../../../services/apiFetch";
import { Formik } from "formik";
import { validate } from "./validate";
import Input from "../../../components/Input";
import { MdAlternateEmail } from "react-icons/md";
import Button from "../../../components/Button";
import { Spinner } from "reactstrap";
import AlertError from "../../../components/AlertError";
import { FlexColumn, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { useNavigate } from "react-router-dom";
import { MdKey } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";

function Recovery() {
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [data, setData] = useState({
    resetId: null,
    userId: null,
    code: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState("sendCode");
  const { error, setError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const initialValues = {
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  }

  const handleSubmit = async (values, resetForm) => {
    try {
      setIsLoading(true);
      
      if(currentAction === "sendCode") {
        const body = { email: values.email };
        const resetData = await apiFetch("auth/sendCode", { body });
        setData(data => ({...data, resetId: resetData.data.id}));
        setCurrentAction("validCode");
        resetForm();
        return setIsLoading(false);
      }

      if(currentAction === "validCode") {
        if(!isCodeValid || !data.userId) return;
        
        const body = { resetId: data.resetId, code: data.code, newPassword: values.newPassword };
        await apiFetch(`auth/changePassword/${data.userId}`, { body, method: "PUT" });
        setIsSuccess(true);
        setIsLoading(false);
        resetForm();
      }
    }catch(error) {
      console.error(error);
      setError(error.message);
      setIsLoading(false);
    }
  }

  const validCode = async () => {
    try {
      if(!data.code) return;
      setIsValidating(true);

      const body = { resetId: data.resetId, code: data.code };
      const validData = await apiFetch("auth/validCode", { body });
      if(!validData.data.isValid) throw new Error("El código no es válido");
      setData(data => ({...data, userId: validData.data.userId}));
      setIsCodeValid(validData.data.isValid);
      setIsValidating(false);
    }catch(error) {
      console.error(error);
      setError(error.message);
      setIsValidating(false);
    }
  }

  const handleCodeChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("code", value);
    console.log(data, value);
    if(value.length === 6) setData(data => ({...data, code: value}));
  }

  return (
    <Container>
      <Section>
        <Logo 
          src="/img/logo.png"
          alt="logo-inversiones-araujo"
        />
        <Formik
          initialValues={initialValues}
          validate={(values) => validate(values, currentAction)}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue
          }) => (
            <Form onSubmit={handleSubmit}>
              {
                isSuccess
                ? <FlexColumn
                    width="100%"
                    gap={0.1}
                    align="center"
                  >
                    <CiCircleCheck 
                      size={80}
                      color={COLORS.persian}
                    />
                    <Text
                      size={18}
                      weight={700}
                      color={COLORS.persian}
                    >
                      La contraseña se actualizo con éxito
                    </Text>
                  </FlexColumn>
                : currentAction === "sendCode"
                    ? <>
                        <Input 
                          id="email"
                          placeholder="Ingrese su correo registrado"
                          Icon={MdAlternateEmail}
                          error={errors.email}
                          touched={touched.email}
                          value={values.email}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                        />
                        <Text
                          isLink
                          color={COLORS.blue}
                          align="start"
                          onClick={() => navigate("/login")}
                        >
                          Iniciar sesión
                        </Text>
                      </>
                    : <>
                        <Input 
                          id="code"
                          disabled={isCodeValid}
                          placeholder="Ingrese el código"
                          Icon={MdKey}
                          value={values.code}
                          error={errors.code}
                          touched={touched.code}
                          handleBlur={handleBlur}
                          handleChange={(e) => handleCodeChange(e, setFieldValue)}
                        />
                        <Button
                          style={{alignSelf: "center"}}
                          disabled={isCodeValid || isValidating}
                          onClick={validCode}
                          type="button"
                          fontSize={15}
                        >
                          {
                            isCodeValid
                            ? "Validado"
                            : isValidating
                                ? <>
                                    <Spinner size="sm" />
                                    Validando...
                                  </>
                                : "Validar código"
                          }
                        </Button>
                        <Input 
                          id="newPassword"
                          placeholder="Ingrese la nueva contraseña"
                          Icon={FaLock}
                          type="password"
                          disabled={!isCodeValid}
                          error={errors.newPassword}
                          touched={touched.newPassword}
                          value={values.newPassword}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                        />
                        <Input 
                          id="confirmPassword"
                          placeholder="Confirme la contraseña"
                          Icon={FaLock}
                          type="password"
                          disabled={!isCodeValid}
                          error={errors.confirmPassword}
                          touched={touched.confirmPassword}
                          value={values.confirmPassword}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                        />
                      </>
              }
              {
                isSuccess
                ? <Button
                    type="button"
                    onClick={() => navigate("/login")}
                    color="secondary"
                    fontSize={17}
                    style={{alignSelf: "center"}}
                  >
                    Iniciar sesión
                  </Button>
                : <Button 
                    style={{alignSelf: "center"}}
                    type="submit"
                    disabled={!isValid || isLoading}
                    fontSize={17}
                    color={isSuccess ? "secondary" : "primary"}
                  >
                    {
                      isLoading
                      ? <>
                          <Spinner size="sm" />
                          { currentAction === "sendCode" ? "Enviando..." : "Actualizando..." }
                        </>
                      : currentAction === "sendCode" ? "Enviar código" : "Actualizar"
                    }
                  </Button>
              }
            </Form>
          )}
        </Formik>
      </Section>
      <Section isImage />
      {
        error
        &&
        <AlertError 
          error={error}
          setError={setError}
        />
      }
    </Container>
  );
}

export default Recovery;
