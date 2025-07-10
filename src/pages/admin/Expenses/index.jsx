import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Expense from "../../../components/Expense";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { FlexColumn, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { useAuth } from "../../../context/auth";

function Expenses() {
  const { isLoading, setIsLoading, loadExpenses, expenses } = useAdmin(); 
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadExpenses();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadExpenses, setIsLoading ]);

  return (
    <>
      <FlexColumn gap={0.1}>
        <Title>Gastos</Title>
        <Text
          style={{marginTop: "-0.5rem"}}
          color={COLORS.dim}
        >
          Administra todos los gastos de tu tienda
        </Text>
      </FlexColumn>
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : expenses?.map((expense, index) => (
              <Expense 
                key={index}
                ableToWatch={user.role.permissions.includes("EXPENSES_WATCH")}
                {...expense}
              />
            ))
        }
      </Section>
    </>
  );
}

export default Expenses;
