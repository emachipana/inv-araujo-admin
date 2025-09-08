import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`
    );
    const data = await response.json();
    
    if (!data.address) throw new Error('No se pudo obtener la dirección');

    const { address } = data;
    
    return {
      address: data.display_name?.split(', ').slice(0, 3).join(', ') || '',
      district: address.city_district || address.suburb || address.city || address.town || address.village || '',
      province: address.region || address.state || '',
      department: address.state_district || address.state || ''
    };
  } catch (error) {
    console.error(error);
    toast.error(errorParser(error.message));
    return {
      address: '',
      district: '',
      province: '',
      department: ''
    };
  }
};
