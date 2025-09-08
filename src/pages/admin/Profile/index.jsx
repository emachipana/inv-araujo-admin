import { useState } from "react";
import { useAuth } from "../../../context/auth";
import { Container } from "../Product/styles";
import { Section } from "../InvitroOrder/styles";
import { Formik } from "formik";
import { validate } from "./validate";
import { FlexColumn, Form, Image, Text } from "../../../styles/layout";
import { Group, Title } from "../../../components/ProductForm/styles";
import Input from "../../../components/Input";
import { FaEdit } from "react-icons/fa";
import { Spinner } from "reactstrap";
import Button from "../../../components/Button";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const initialValues = {
    ...user,
    newPassword: "",
    confirmPassword: "",
    imageId: user.image?.id
  }

  const handleSubmit = async (values, resetForm) => {
    try {
      setIsLoading(true);
      const body = {
        newPassword: values.newPassword,
        imageId: user.image ? user.image.id : null
      }

      await updateUser(user.id, body);
      resetForm();
      setIsLoading(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  return (
    <>
      <Section>
        <Container notAuto>
          <FlexColumn gap={1}>
            <Text
              size={17}
              weight={700}
            >
              Foto actual
            </Text>
            <Image
              width="200px"
              alt="user-profile"
              src={user.image ? user.image.url : "/img/user_default.jpg"}
            />
          </FlexColumn>
        </Container>
        <Container notAuto>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleBlur,
              handleChange,
              handleSubmit
            }) => (
              <Form onSubmit={handleSubmit}>
                <Title>Editar usuario</Title>
                <Group>
                  <Input
                    label="Nombre"
                    disabled
                    id="name"
                    value={initialValues.name}
                  />
                  <Input
                    disabled
                    label="Apellidos"
                    id="lastName"
                    value={initialValues.lastName}
                  />
                </Group>
                <Input
                  disabled
                  id="username"
                  label="Correo"
                  value={initialValues.username}
                />
                <Group>
                  <Input
                    id="newPassword"
                    value={values.newPassword}
                    error={errors.newPassword}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Nueva contraseña"
                    type="password"
                    placeholder="**********"
                    touched={touched.newPassword}
                  />
                  <Input
                    id="confirmPassword"
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="**********"
                    touched={touched.confirmPassword}
                  />
                </Group>
                <Button
                  type="submit"
                  iconSize={18}
                  fontSize={17}
                  size="full"
                  style={{marginTop: "0.7rem"}}
                  disabled={!isValid || isLoading}
                  Icon={isLoading ? null : FaEdit}
                >
                  {
                    isLoading
                    ? <>
                        <Spinner size="sm" />
                        Editando...
                      </>
                    : "Editar"
                  }
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </Section>
    </>
  );
}

export default Profile;
