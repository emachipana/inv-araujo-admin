import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Expense from "../../../components/Expense";
import AlertError from "../../../components/AlertError";

function Expenses() {
  const { isLoading, setIsLoading, error, setError, matcher, loadExpenses, expenses } = useAdmin(); 

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.expenses) {
          setIsLoading(true);
          await loadExpenses();
          setIsLoading(false);
        }
      }catch(error) {
        console.error(error);
        setIsLoading(false);
        setError(error.message);
      }
    }

    fetch();
  }, [ loadExpenses, matcher.expenses, setError, setIsLoading ]);

  return (
    <>
      <Title>Gastos</Title>
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : expenses?.map((expense, index) => (
              <Expense 
                key={index}
                {...expense}
              />
            ))
        }
      </Section>
      {
        error
        &&
        <AlertError 
          error={error}
          setError={setError}
        />
      }
    </>
  );
}

export default Expenses;
