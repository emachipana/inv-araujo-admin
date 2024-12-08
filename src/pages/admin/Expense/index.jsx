import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { months } from "../../../data/months";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Item from "./Item";
import { AiFillProduct } from "react-icons/ai";
import ItemModal from "./ItemModal";
import Button from "../../../components/Button";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Expense() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemModal, setItemModal] = useState(false);
  const [item, setItem] = useState("");
  const { id } = useParams();
  const [expense, setExpense] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const expense = await apiFetch(`profits/${id}`);
        setExpense(expense.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  const handleEdit = (item) => {
    setItemModal(true);
    setItem(item);
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !expense.month
          ? <Title>El registro de gastos no existe</Title>
          : <>
              <Title capitalize>{ months[expense.month].toLowerCase() }</Title>
              <Section>
                <Card position="first">
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text 
                        weight={700}
                        color={COLORS.orange}
                      >
                        Gastos
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { expense.totalExpenses.toFixed(1) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text 
                        weight={700}
                        color={COLORS.emerald}
                      >
                        Ingresos
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { expense.income.toFixed(1) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text 
                        weight={700}
                        color={COLORS.blue}
                      >
                        Ganancia
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { expense.profit.toFixed(1) }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                    <Text
                      weight={700}
                      size={18}
                    >
                      Gastos
                    </Text>
                    <FlexColumn
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        expense.expenses?.map((item, index) => (
                          <Item 
                            key={index}
                            handleEdit={() => handleEdit(item)}
                            item={item}
                            profitId={expense.id}
                            setExpense={setExpense}
                          />
                        ))
                      }
                      <Button
                        style={{marginTop: "1rem"}}
                        fontSize={16}
                        iconSize={18}
                        Icon={AiFillProduct}
                        onClick={() => setItemModal(!itemModal)}
                      >
                        Registrar gasto
                      </Button>
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
              <ItemModal 
                isActive={itemModal}
                item={item}
                setIsActive={setItemModal}
                profitId={expense.id}
                setExpense={setExpense}
                setItem={setItem}
              />
            </>
        }
      </>
  );
}

export default Expense;
