import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Formik } from "formik";
import { advanceValidate } from "./validate";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FlexRow, Form } from "../../../styles/layout";
import { Group } from "../../../components/ProductForm/styles";
import { Spinner } from "reactstrap";
import { TiCancel } from "react-icons/ti";
import { formatDate } from "../../../components/VitroForm/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function AdvanceForm({
  initialValues = {
    date: "",
    amount: ""
  },
  isToCreate = true,
  setIsActive,
  id,
  setVitroOrder,
  vitroOrderId,
  total, 
  currentAdvance,
  setAdvances,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { addAdvance, editAdvance } = useAdmin();

  const onSubmit = async (values) => {
    try {
      const body = {
        ...values,
        vitroOrderId
      }

      setIsLoading(true);
      const {advance, updatedVitroOrder} = isToCreate ? await addAdvance(body) : await editAdvance(id, body, setAdvances);
      if(isToCreate) setAdvances((advances) => [advance, ...advances]);
      setVitroOrder(updatedVitroOrder);
      setIsActive(false);
      setIsLoading(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const today = new Date();
  today.setHours(12);

  return (
    <Formik
      validate={(values) => advanceValidate(values, total, currentAdvance)}
      initialValues={initialValues}
      onSubmit={onSubmit}
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
          <Group>
            <Input 
              id="date"
              label="Fecha"
              type="date"
              max={formatDate(today)}
              fontSize={15}
              labelSize={16}
              value={values.date}
              error={errors.date}
              touched={touched.date}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input 
              id="amount"
              label="Monto"
              placeholder="S/. 0.0"
              fontSize={15}
              labelSize={16}            
              value={values.amount}
              error={errors.amount}
              touched={touched.amount}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <FlexRow style={{marginTop: "0.4rem"}}>
            <Button
              style={{padding: "0.3rem 0.6rem"}}
              iconSize={18}
              fontSize={14}
              color="secondary"
              Icon={TiCancel}
              onClick={() => setIsActive(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              style={{padding: "0.3rem 0.6rem"}}
              iconSize={15}
              fontSize={14}
              Icon={isLoading ? null : FaMoneyBillTrendUp}
              disabled={isLoading || !isValid}
            >
              {
                isLoading
                ? <>
                    <Spinner size="sm" />
                    {
                      isToCreate
                      ? "Registrando..."
                      : "Editando..."
                    }
                  </>
                : (isToCreate ? "Registrar": "Editar")
              }
            </Button>
          </FlexRow>
        </Form>
      )}
    </Formik>
  );
}

export default AdvanceForm;
