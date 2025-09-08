import { css } from "@emotion/react";
import { FONTS } from "./fonts";
import { COLORS } from "./colors";

export const RESET = css`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  p {
    margin: 0;
    padding: 0;
  }
  
  body {
    overflow-x: hidden;
    overflow-y: auto;
    font-family: ${FONTS.primary};
    color: ${COLORS.gray};
    font-size: 1rem;
  }

  // Estilos modernos para el scrollbar
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${COLORS.white};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${COLORS.taupe};
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${COLORS.taupe}80; /* Añade transparencia al hacer hover */
    transform: scale(1.1);
  }

  ::-webkit-scrollbar-thumb:active {
    cursor: grabbing;
    background-color: ${COLORS.taupe};
  }

  /* Para Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${COLORS.taupe} ${COLORS.white};
  }
`;
