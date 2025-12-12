import { useEffect } from 'react';
import { usePushNotifications } from './use-push-notifications';

export function useInsuranceUrgencyNotification() {
  const { sendNotification, isGranted } = usePushNotifications();

  useEffect(() => {
    // Pour la démo, on ne fait rien automatiquement
    // En production, on pourrait vérifier les dates d'échéance
  }, []);

  const notifyInsuranceExpiry = (daysLeft: number) => {
    if (!isGranted) return;
    
    if (daysLeft <= 7) {
      sendNotification('⚠️ Assurance bientôt expirée', {
        body: `Votre assurance expire dans ${daysLeft} jours. Pensez à la renouveler !`,
        tag: 'insurance-expiry',
        requireInteraction: true
      });
    }
  };

  return { notifyInsuranceExpiry };
}
