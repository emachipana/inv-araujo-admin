import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";

export const parsedTitle = (title, markedWord) => ({
  __html: title.replaceAll(new RegExp(markedWord, 'gi'), `<span class='marked'>${markedWord}</span>`)
});

export const handleChecked = async (e, checked, banner, setChecked, updateBanner) => {
  e.stopPropagation();

  try {
    if(!checked && banner.products.length <= 0) throw new Error("Primero elige productos");
    if(setChecked) setChecked(!banner.used);
    const body = {
      title: banner.title,
      description: banner.description,
      markedWord: banner.markedWord,
      used: !banner.used
    }

    await updateBanner(banner.id, body);
  }catch(error) {
    toast.error(errorParser(error.message));
  }
}
