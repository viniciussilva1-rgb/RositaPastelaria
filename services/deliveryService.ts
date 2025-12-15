// Serviço de cálculo de distância e taxa de entrega

// Localização da Rosita Pastelaria - Santa Bárbara, Lourinhã
const STORE_LOCATION = {
  lat: 39.2416,
  lng: -9.3131,
  address: 'Rua de São Sebastião 111, Santa Bárbara, Lourinhã'
};

// Configuração de taxas de entrega
const DELIVERY_CONFIG = {
  freeDeliveryRadius: 9, // km - entrega grátis até 9km
  maxDeliveryRadius: 30, // km - máximo 30km
  extraKmRate: 1.20, // € por km extra após os 9km grátis
};

export interface DeliveryCalculation {
  distance: number; // em km
  deliveryFee: number; // em €
  isDeliveryAvailable: boolean;
  message: string;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  success: boolean;
  error?: string;
}

// Fórmula Haversine para calcular distância entre dois pontos
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Geocodificação usando OpenStreetMap Nominatim (gratuito)
export async function geocodeAddress(postalCode: string, street: string): Promise<GeocodingResult> {
  try {
    // Formatar código postal para padrão português (XXXX-XXX)
    const formattedPostalCode = postalCode.replace(/\s/g, '').replace(/(\d{4})-?(\d{3})/, '$1-$2');
    
    // Tentar múltiplas queries para melhor precisão
    const queries = [
      `${street}, ${formattedPostalCode}, Portugal`,
      `${street}, Lourinhã, Portugal`,
      `${formattedPostalCode}, Portugal`
    ];

    for (const queryStr of queries) {
      const query = encodeURIComponent(queryStr);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=pt`,
          {
            headers: {
              'Accept-Language': 'pt-PT',
              'User-Agent': 'RositaPastelaria/1.0'
            }
          }
        );

        if (!response.ok) {
          continue;
        }

        const data = await response.json();

        if (data.length > 0) {
          console.log('Geocoding encontrado:', data[0].display_name);
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name,
            success: true
          };
        }
      } catch (e) {
        console.log('Tentativa de geocoding falhou:', queryStr);
      }
      
      // Pequena pausa para respeitar rate limit do Nominatim
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Se nenhuma query funcionou, tentar busca estruturada por código postal
    try {
      const structuredResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(formattedPostalCode)}&country=Portugal&format=json&limit=1`,
        {
          headers: {
            'Accept-Language': 'pt-PT',
            'User-Agent': 'RositaPastelaria/1.0'
          }
        }
      );

      if (structuredResponse.ok) {
        const structuredData = await structuredResponse.json();
        if (structuredData.length > 0) {
          console.log('Geocoding por código postal:', structuredData[0].display_name);
          return {
            lat: parseFloat(structuredData[0].lat),
            lng: parseFloat(structuredData[0].lon),
            displayName: structuredData[0].display_name,
            success: true
          };
        }
      }
    } catch (e) {
      console.log('Busca estruturada falhou');
    }

    return {
      lat: 0,
      lng: 0,
      displayName: '',
      success: false,
      error: 'Não foi possível encontrar a morada. Verifique o código postal e a rua.'
    };
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return {
      lat: 0,
      lng: 0,
      displayName: '',
      success: false,
      error: 'Erro ao verificar morada. Tente novamente.'
    };
  }
}

// Calcular taxa de entrega baseada na distância
export function calculateDeliveryFee(distanceKm: number): DeliveryCalculation {
  // Arredondar para 1 casa decimal
  const distance = Math.round(distanceKm * 10) / 10;

  // Verificar se está dentro do raio máximo
  if (distance > DELIVERY_CONFIG.maxDeliveryRadius) {
    return {
      distance,
      deliveryFee: 0,
      isDeliveryAvailable: false,
      message: `Lamentamos, mas não fazemos entregas para distâncias superiores a ${DELIVERY_CONFIG.maxDeliveryRadius}km. A sua localização está a ${distance}km.`
    };
  }

  // Entrega grátis até 9km
  if (distance <= DELIVERY_CONFIG.freeDeliveryRadius) {
    return {
      distance,
      deliveryFee: 0,
      isDeliveryAvailable: true,
      message: `Entrega grátis! (${distance}km)`
    };
  }

  // Calcular taxa para distância extra
  const extraKm = distance - DELIVERY_CONFIG.freeDeliveryRadius;
  const deliveryFee = Math.round(extraKm * DELIVERY_CONFIG.extraKmRate * 100) / 100;

  return {
    distance,
    deliveryFee,
    isDeliveryAvailable: true,
    message: `Taxa de entrega: €${deliveryFee.toFixed(2)} (${distance}km - ${extraKm.toFixed(1)}km extra)`
  };
}

// Função principal para calcular entrega
export async function calculateDelivery(postalCode: string, street: string): Promise<DeliveryCalculation & { geocoding: GeocodingResult }> {
  const geocoding = await geocodeAddress(postalCode, street);

  if (!geocoding.success) {
    return {
      distance: 0,
      deliveryFee: 0,
      isDeliveryAvailable: false,
      message: geocoding.error || 'Não foi possível verificar a morada.',
      geocoding
    };
  }

  // Calcular distância entre a loja e o cliente
  const distance = haversineDistance(
    STORE_LOCATION.lat,
    STORE_LOCATION.lng,
    geocoding.lat,
    geocoding.lng
  );

  console.log(`Distância calculada: ${distance.toFixed(2)}km`);
  console.log(`Loja: ${STORE_LOCATION.lat}, ${STORE_LOCATION.lng}`);
  console.log(`Cliente: ${geocoding.lat}, ${geocoding.lng}`);

  const calculation = calculateDeliveryFee(distance);

  return {
    ...calculation,
    geocoding
  };
}

// Atualizar localização da loja (pode ser chamado do admin)
export function updateStoreLocation(lat: number, lng: number, address: string): void {
  STORE_LOCATION.lat = lat;
  STORE_LOCATION.lng = lng;
  STORE_LOCATION.address = address;
}

export function getStoreLocation() {
  return { ...STORE_LOCATION };
}

export function getDeliveryConfig() {
  return { ...DELIVERY_CONFIG };
}
