import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Expense from "../../../components/Expense";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Expenses() {
  const { isLoading, setIsLoading, loadExpenses, expenses } = useAdmin(); 

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
    </>
  );
}

export default Expenses;
