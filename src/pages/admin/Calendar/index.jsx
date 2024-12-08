/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { Title } from "../styles";
import { Container, Day, Days, Info, Main, Mini, Wrapper } from "./styles";
import { capitalize } from "../../../helpers/capitalize";
import { COLORS } from "../../../styles/colors";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Event from "./Event";
import Badge from "../../../components/Badge";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";

function Calendar() {
	const ref = new Date();
  ref.setHours(12);
	const [curMonth, setCurMonth] = useState(ref.getMonth());
  const [data, setData] = useState([]);
	const firstDay = new Date(ref.getFullYear(), curMonth, 1);  
  const lastDay = new Date(ref.getFullYear(), curMonth + 1, 0);
  const days = new Array(firstDay.getDay()).fill(undefined);
  const monthName = firstDay.toLocaleDateString("es-ES", { month: "long", timeZone: "UTC" });
  const { orders, vitroOrders, isLoading, setIsLoading, matcher, loadOrders, loadVitroOrders } = useAdmin();

  for(let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
    days.push(i);
  }


  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        if(!matcher.orders) await loadOrders();
        if(!matcher.vitroOrders) await loadVitroOrders();
        setIsLoading(false);

        const filter = [
          ...orders.filter(order => {
            const date = new Date(order.maxShipDate);

            return order.status === "PENDIENTE" && date.getMonth() === curMonth;
          }),
          ...vitroOrders.filter(order => {
            if(!order.finishDate) return false;

            const date = new Date(order.finishDate);

            return order.status === "PENDIENTE" && date.getMonth() === curMonth;
          })
        ]

        setData(filter.map(order => ({
          ...order,
          date: order.maxShipDate || order.finishDate,
          type: order.maxShipDate ? "productos" : "invitro"
        })));
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadOrders, orders, vitroOrders, setIsLoading, matcher, loadVitroOrders, curMonth ]);

	const addMonth = () => setCurMonth(month => month + 1);
	const restMonth = () => setCurMonth(month => month - 1);

  const options = { 
    weekday: "long",
    day: "numeric", 
    month: "long", 
    year: "numeric",
    timeZone: "UTC"
  };

	return (
		<>
			<Title>Calendario</Title>
			<Container>
				<Info>
					<Mini>
						<FlexRow 
							width="100%"
							justify="space-between"
						>
							<Text
								weight={700}
								size={17}
							>
								{ capitalize(monthName) }
							</Text>
							<FlexRow>
								<FaAngleLeft
									onClick={restMonth}
									style={{cursor: "pointer"}}
								/>
								<FaAngleRight
									onClick={addMonth}
									style={{cursor: "pointer"}}
								/>
							</FlexRow>
						</FlexRow>
						<Days>
							<Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                D
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                L
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                M
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                M
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                J
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                V
              </Text>
              <Text
                weight={700}
                color={COLORS.taupe}
								size={15}
              >
                S
              </Text>
							{
                days.map((day, index) => (
                  <Day
                    key={index}
                    isActive={day === ref.getDate() && ref.getMonth() === firstDay.getMonth()}
                    day={day}
                  >
                    <Text
                      weight={600}
                    >
                      { day }
                    </Text>
                  </Day>
                ))
              }
						</Days>
					</Mini>
          <FlexColumn
            style={{alignSelf: isLoading ? "center" : "flex-start", padding: "2px"}}
            gap={1}
          >
            {
              isLoading
              ? <Spinner color="secondary" />
              : <>
                  <Text
                    size={18}
                    weight={700}
                  >
                    Próximas entregas
                  </Text>
                  {
                    data.map((order, index) => (
                      <Event
                        id={order.id}
                        key={index}
                        type={order.type}
                        date={order.date}
                      />
                    ))
                  }
                </>
            }
          </FlexColumn>
				</Info>
        <Main>
          <FlexRow
            width="100%"
            justify="space-between"
            style={{padding: "1rem"}}
          >
            <Text
              size={16.7}
              weight={700}
            >
              Hoy: { capitalize(ref.toLocaleDateString("es-ES", options)) }
            </Text>
            <FlexRow
              gap={0.2}
            >
              <FaAngleLeft
                size={24}
                style={{cursor: "pointer"}}
                onClick={restMonth}
              />
              <FaAngleRight 
                size={24}
                style={{cursor: "pointer"}}
                onClick={addMonth}
              />
            </FlexRow>
          </FlexRow>
          <Days gap="0 0">
            <Wrapper>
              <Text
                weight={700}
              >
                Domingo
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Lunes
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Martes
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Miércoles
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Jueves
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Viernes
              </Text>
            </Wrapper>
            <Wrapper>
              <Text
                weight={700}
              >
                Sábado
              </Text>
            </Wrapper>
            {
              days.map((day, index) => {
                const event = data.find(event => {
                  const date = new Date(event.date);
                  date.setUTCHours(12);

                  return date.getDate() === day;
                });

                return (
                  <Wrapper
                    bgColor="transparent"
                    key={index}
                    type="day"
                    current={day === ref.getDate() && ref.getMonth() === firstDay.getMonth()}
                    day={day}
                  >
                    <Text
                      weight={700}
                      size={24}
                    >
                      { day }
                    </Text>
                    {
                      day && event
                      &&
                      <Badge>
                        {
                          event.type === "invitro"
                          ? "invitro"
                          : "Productos"
                        }
                      </Badge>
                    }
                  </Wrapper>
                )
              })
            }
          </Days>
        </Main>
			</Container>
		</>
	);
}

export default Calendar;
