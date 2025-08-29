import { COLORS } from "../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../styles/layout";
import { Container } from "./styles";
import { Input } from "reactstrap";

function ShippingType({ shipType, setShipType, setFieldValue, withTitle = true }) {
	const handleClick = (val) => {
		setFieldValue("shippingType", val);

		setShipType(val);
	}

  return (
    <FlexColumn
      width="100%"
    >
			{
				withTitle
				&&
				<Text
					size={17}
					weight={700}
				>
					Tipo de entrega
				</Text>
			}
			<FlexRow
				width="100%"
				gap={1}
			>
				<Container
					isActive={shipType === "ENVIO_AGENCIA"}
					onClick={() => handleClick("ENVIO_AGENCIA")}
				>
					<Input 
						type="radio"
						id="ENVIO_AGENCIA"
						name="shippingType"
						defaultChecked={shipType === "ENVIO_AGENCIA"}
						checked={shipType === "ENVIO_AGENCIA"}
					/>
					<Text
						weight={600}
						color={COLORS.dim}
						style={{marginTop: "2px"}}
					>
						Envio por agencia
					</Text>
				</Container>
				<Container
					isActive={shipType === "RECOJO_ALMACEN"}
					onClick={() => handleClick("RECOJO_ALMACEN")}
				>
					<Input 
						type="radio"
						id="RECOJO_ALMACEN"
						name="shippingType"
						checked={shipType === "RECOJO_ALMACEN"}
						defaultChecked={shipType === "RECOJO_ALMACEN"}
					/>
					<Text
						weight={600}
						color={COLORS.dim}
						style={{marginTop: "2px"}}
					>
						Recojo en almacen
					</Text>
				</Container>
			</FlexRow>
    </FlexColumn>
  );
}

export default ShippingType;
