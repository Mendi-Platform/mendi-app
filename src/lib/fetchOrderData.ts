import {
  getGarments,
  getRepairTypes,
  getPricing,
  getSiteSettings,
  getStoreLocations,
  getPostenOptions,
  getDeliveryOptions,
} from '@/sanity/lib/queries';
import { SECTION_DATA_CONFIG } from './orderSectionConfig';

export async function fetchDataForSection(slug: string) {
  const config = SECTION_DATA_CONFIG[slug];

  if (!config) {
    return {};
  }

  const data: Record<string, unknown> = {};

  // Fetch all required data in parallel
  const queries = config.queries;
  const promises = queries.map(async (queryName) => {
    switch (queryName) {
      case 'garments':
        data.garments = await getGarments();
        break;
      case 'repairTypes':
        data.repairTypes = await getRepairTypes();
        break;
      case 'pricing':
        data.pricing = await getPricing();
        break;
      case 'siteSettings':
        data.siteSettings = await getSiteSettings();
        break;
      case 'storeLocations':
        data.storeLocations = await getStoreLocations();
        break;
      case 'postenOptions':
        data.postenOptions = await getPostenOptions();
        break;
      case 'deliveryOptions':
        data.deliveryOptions = await getDeliveryOptions();
        break;
    }
  });

  await Promise.all(promises);

  return data;
}
