// Catalogue des véhicules des concessionnaires partenaires KitMotors

export interface DealerVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'SUV' | 'Berline' | 'Crossover' | 'Pick-up' | 'Compact';
  image: string;
  price: string;
  specs: {
    engine: string;
    power: string;
    transmission: string;
    fuel: string;
  };
}

export interface Dealer {
  id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  vehicles: DealerVehicle[];
}

export const DEALERS: Dealer[] = [
  {
    id: 'mg-motors',
    name: 'MG Motors',
    logo: '🚗',
    description: 'Marque britannique historique, aujourd\'hui leader de l\'électrification',
    country: 'Royaume-Uni / Chine',
    vehicles: [
      {
        id: 'mg-hs',
        brand: 'MG',
        model: 'HS',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '15 900 000 FCFA',
        specs: { engine: '1.5L Turbo', power: '162 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'mg-zs',
        brand: 'MG',
        model: 'ZS',
        year: 2024,
        category: 'Crossover',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        price: '12 500 000 FCFA',
        specs: { engine: '1.5L', power: '106 ch', transmission: 'Manuelle 5V', fuel: 'Essence' }
      },
      {
        id: 'mg-zs-ev',
        brand: 'MG',
        model: 'ZS EV',
        year: 2024,
        category: 'Crossover',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400',
        price: '22 000 000 FCFA',
        specs: { engine: 'Électrique', power: '177 ch', transmission: 'Automatique', fuel: 'Électrique' }
      },
      {
        id: 'mg-5',
        brand: 'MG',
        model: 'MG5',
        year: 2024,
        category: 'Berline',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        price: '11 900 000 FCFA',
        specs: { engine: '1.5L', power: '120 ch', transmission: 'CVT', fuel: 'Essence' }
      },
      {
        id: 'mg-rx8',
        brand: 'MG',
        model: 'RX8',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
        price: '18 500 000 FCFA',
        specs: { engine: '2.0L Turbo', power: '224 ch', transmission: 'Automatique 6V', fuel: 'Essence' }
      }
    ]
  },
  {
    id: 'changan',
    name: 'CHANGAN',
    logo: '🏎️',
    description: 'Premier constructeur automobile chinois, qualité et innovation',
    country: 'Chine',
    vehicles: [
      {
        id: 'changan-cs75-plus',
        brand: 'CHANGAN',
        model: 'CS75 PLUS',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '17 500 000 FCFA',
        specs: { engine: '1.5L Turbo', power: '180 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'changan-cs55-plus',
        brand: 'CHANGAN',
        model: 'CS55 PLUS',
        year: 2024,
        category: 'Crossover',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        price: '14 900 000 FCFA',
        specs: { engine: '1.5L Turbo', power: '156 ch', transmission: 'Automatique CVT', fuel: 'Essence' }
      },
      {
        id: 'changan-cs35-plus',
        brand: 'CHANGAN',
        model: 'CS35 PLUS',
        year: 2024,
        category: 'Compact',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        price: '11 500 000 FCFA',
        specs: { engine: '1.4L', power: '116 ch', transmission: 'Automatique CVT', fuel: 'Essence' }
      },
      {
        id: 'changan-uni-t',
        brand: 'CHANGAN',
        model: 'UNI-T',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
        price: '19 900 000 FCFA',
        specs: { engine: '2.0L Turbo', power: '233 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'changan-uni-k',
        brand: 'CHANGAN',
        model: 'UNI-K',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '24 500 000 FCFA',
        specs: { engine: '2.0L Turbo', power: '233 ch', transmission: 'Automatique 8V', fuel: 'Essence' }
      },
      {
        id: 'changan-eado-plus',
        brand: 'CHANGAN',
        model: 'EADO Plus',
        year: 2024,
        category: 'Berline',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        price: '12 900 000 FCFA',
        specs: { engine: '1.4L Turbo', power: '158 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      }
    ]
  },
  {
    id: 'soueast',
    name: 'SOUEAST',
    logo: '🚙',
    description: 'Constructeur sino-japonais, design élégant et fiabilité',
    country: 'Chine',
    vehicles: [
      {
        id: 'soueast-dx7',
        brand: 'SOUEAST',
        model: 'DX7',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '16 500 000 FCFA',
        specs: { engine: '1.5L Turbo', power: '197 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'soueast-dx5',
        brand: 'SOUEAST',
        model: 'DX5',
        year: 2024,
        category: 'Crossover',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        price: '12 900 000 FCFA',
        specs: { engine: '1.5L', power: '120 ch', transmission: 'Automatique CVT', fuel: 'Essence' }
      },
      {
        id: 'soueast-dx3',
        brand: 'SOUEAST',
        model: 'DX3',
        year: 2024,
        category: 'Compact',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        price: '10 500 000 FCFA',
        specs: { engine: '1.5L', power: '120 ch', transmission: 'Manuelle 5V', fuel: 'Essence' }
      },
      {
        id: 'soueast-a5',
        brand: 'SOUEAST',
        model: 'A5',
        year: 2024,
        category: 'Berline',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        price: '11 900 000 FCFA',
        specs: { engine: '1.5L', power: '120 ch', transmission: 'Automatique CVT', fuel: 'Essence' }
      }
    ]
  },
  {
    id: 'jetour',
    name: 'JETOUR',
    logo: '🏁',
    description: 'Marque premium de Chery, spécialiste des SUV familiaux',
    country: 'Chine',
    vehicles: [
      {
        id: 'jetour-x70',
        brand: 'JETOUR',
        model: 'X70',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '15 500 000 FCFA',
        specs: { engine: '1.5L Turbo', power: '156 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'jetour-x70-plus',
        brand: 'JETOUR',
        model: 'X70 PLUS',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
        price: '17 900 000 FCFA',
        specs: { engine: '1.6L Turbo', power: '197 ch', transmission: 'Automatique DCT', fuel: 'Essence' }
      },
      {
        id: 'jetour-x90',
        brand: 'JETOUR',
        model: 'X90',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        price: '21 500 000 FCFA',
        specs: { engine: '2.0L Turbo', power: '254 ch', transmission: 'Automatique 7DCT', fuel: 'Essence' }
      },
      {
        id: 'jetour-x95',
        brand: 'JETOUR',
        model: 'X95',
        year: 2024,
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
        price: '24 900 000 FCFA',
        specs: { engine: '2.0L Turbo', power: '254 ch', transmission: 'Automatique 7DCT', fuel: 'Essence' }
      },
      {
        id: 'jetour-dashing',
        brand: 'JETOUR',
        model: 'Dashing',
        year: 2024,
        category: 'Crossover',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        price: '18 500 000 FCFA',
        specs: { engine: '1.6L Turbo', power: '197 ch', transmission: 'Automatique 7DCT', fuel: 'Essence' }
      }
    ]
  }
];

export function getDealerById(id: string): Dealer | undefined {
  return DEALERS.find(d => d.id === id);
}

export function getVehicleById(dealerId: string, vehicleId: string): DealerVehicle | undefined {
  const dealer = getDealerById(dealerId);
  return dealer?.vehicles.find(v => v.id === vehicleId);
}

export function getAllVehicles(): (DealerVehicle & { dealerId: string; dealerName: string })[] {
  return DEALERS.flatMap(dealer => 
    dealer.vehicles.map(vehicle => ({
      ...vehicle,
      dealerId: dealer.id,
      dealerName: dealer.name
    }))
  );
}
