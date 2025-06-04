import { api } from '../api';
import { GOOGLE_PLACES_ENDPOINTS } from '../endpoints';

export const getAutocomplete = (input: string) =>
  api.get(GOOGLE_PLACES_ENDPOINTS.GET_AUTOCOMPLETE, { params: { input } });

export const getPlaceDetails = (placeId: string) =>
  api.get(GOOGLE_PLACES_ENDPOINTS.GET_DETAIL, { params: { placeId } });
