import { DOCS_TOKEN, DOCS_URI } from "../config";

export const getDoc = async (type, doc) => {
  try {
    const url = `${DOCS_URI}/${type.toLowerCase()}/${doc}?token=${DOCS_TOKEN}`;
    const response = await fetch(url);
    return await response.json(); 
  }catch(error) {
    console.error(error);
  }
}
