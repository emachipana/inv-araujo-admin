import { Formik } from "formik";
import { Container, Form, Logo, Section } from "./styles"
import Input from "../../../components/Input";
import { MdAlternateEmail } from "react-icons/md";
import { useAuth } from "../../../context/auth";
import { RiLockPasswordFill } from "react-icons/ri";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { Alert, Spinner } from "reactstrap";
import Button from "../../../components/Button";
import { useState } from "react";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth();

  const credentials = {
    username: "",
    password: ""
  }

  const handleSubmit = async (values) => {
    try{
      setIsLoading(true);
      await login(values, "admin");
      setIsLoading(false);
      setError(null)
    }catch(error) {
      console.error(error);

      setError(error.message);
      setIsLoading(false);
    }
  }

  const validate = (values) => {
    const errors = {};

    if(!values.username) {
      errors.username = "Este campo es obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username.trim())) {
      errors.username = "El formato es incorrecto";
    }
  
    if(!values.password) {
      errors.password = "Este campo es obligatorio";
    }else if(values.password.length < 6) {
      errors.password = "El mínimo son 6 caracteres";
    }

    return errors;
  }

  return (
    <Container>
      <Section>
        <Logo 
          src="/img/logo.png"
          alt="logo-inversiones-araujo"
        />
        <Formik
          initialValues={credentials}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit
          }) => (
            <Form onSubmit={handleSubmit}>
              <Input 
                id="username"
                placeholder="Ingrese su correo"
                Icon={MdAlternateEmail}
                error={errors.username}
                touched={touched.username}
                value={values.username}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
              <Input 
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                Icon={RiLockPasswordFill}
                error={errors.password}
                touched={touched.password}
                value={values.password}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
              <Text
                isLink
                color={COLORS.blue}
                align="start"
              >
                Olvidé mi contraseña
              </Text>
              {
                error && 
                <Alert
                  color="danger"
                  style={{alignSelf: "center"}}
                >
                  { error }
                </Alert>
              }
              <Button
                style={{alignSelf: "center"}}
                type="submit"
                disabled={!isValid || isLoading}
              >
                {
                  isLoading
                  ? <>
                      <Spinner 
                        size="sm"
                      />
                      {" "}
                      Iniciando...
                    </>
                  : "Iniciar sesión"
                }
              </Button>
            </Form>
          )}
        </Formik>
      </Section>
      <Section isImage />
    </Container>
  );
}

export default Login;
