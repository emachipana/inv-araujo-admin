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
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/auth";
import Select from "../../../components/Input/Select";

function AdvanceForm({ setIsActive, setVitroOrder, vitroOrderId, total, setAdvances }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addAdvance } = useAdmin();
  const { user } = useAuth();

  const initialValues = {
    paymentType: ""
  }

  const onSubmit = async (values) => {
    try {
      const body = {
        ...values,
        vitroOrderId,
        amount: total / 2,
        employeeId: user.employeeId,
      }

      setIsLoading(true);
      const {advance, updatedVitroOrder} = await addAdvance(body);
      setAdvances((advances) => [advance, ...advances]);
      setVitroOrder(updatedVitroOrder);
      setIsActive(false);
      setIsLoading(false);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
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

  return (
    <Formik
      validate={advanceValidate}
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
              disabled={true}
              id="amount"
              label="Monto (50%)"
              placeholder="S/. 0.0"
              fontSize={15}
              labelSize={16}            
              value={total / 2}
              error={errors.amount}
              touched={touched.amount}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Select
              id="paymentType"
              label="Tipo de pago"
              fontSize={15}
              labelSize={16}
              value={values.paymentType}
              options={paymentOptions}
              error={errors.paymentType}
              touched={touched.paymentType}
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
                    Registrando...
                  </>
                : "Registrar"
              }
            </Button>
          </FlexRow>
        </Form>
      )}
    </Formik>
  );
}

export default AdvanceForm;
