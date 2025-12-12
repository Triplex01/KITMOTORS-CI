// Script pour créer le compte démo dans Firestore
// À exécuter une seule fois

import { createUser, getUserByEmail } from './firestore';

export async function createDemoAccount() {
  const demoEmail = 'demo@kitmotors.com';
  
  // Vérifier si le compte existe déjà
  const existingUser = await getUserByEmail(demoEmail);
  
  if (existingUser) {
    console.log('Le compte démo existe déjà:', existingUser);
    return existingUser;
  }
  
  // Créer le compte démo
  const demoUser = await createUser({
    email: demoEmail,
    password: 'demo123',
    firstName: 'Utilisateur',
    lastName: 'Demo',
    phone: '+225 00 00 00 00',
    role: 'client',
    status: 'active'
  });
  
  console.log('Compte démo créé avec succès:', demoUser);
  return demoUser;
}

// Pour l'exécuter manuellement, appeler createDemoAccount()
