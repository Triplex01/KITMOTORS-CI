# 📚 Documentation API

Guide complet de l'intégration API pour le Admin Dashboard.

## 🔌 Configuration

### Base URL
```
http://localhost:3000/api
```

### Headers Requis
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

## 🔐 Authentification

### POST /auth/login
Connexion administrateur

**Request:**
```json
{
  "email": "admin@luxedrive.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@luxedrive.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### POST /auth/logout
Déconnexion

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

### GET /auth/profile
Récupérer le profil actuel

**Response (200):**
```json
{
  "id": "1",
  "email": "admin@luxedrive.com",
  "name": "Admin User",
  "role": "admin"
}
```

---

## 🔔 Notifications

### GET /notifications
Lister toutes les notifications

**Query Parameters:**
- `status` (optional): draft, scheduled, sent, failed
- `limit` (optional): nombre max de résultats
- `offset` (optional): pagination

**Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "title": "Maintenance Required",
      "message": "Your vehicle is due for maintenance",
      "imageUrl": "https://...",
      "userId": null,
      "targetGroup": "all",
      "status": "sent",
      "createdAt": "2024-11-28T10:30:00Z",
      "sentAt": "2024-11-28T10:35:00Z",
      "readCount": 245,
      "totalCount": 500
    }
  ],
  "total": 1,
  "page": 1
}
```

### POST /notifications
Créer une nouvelle notification

**Request:**
```json
{
  "title": "Important Update",
  "message": "Please check your vehicle status",
  "imageUrl": "https://...",
  "targetGroup": "all",
  "status": "draft"
}
```

**Response (201):**
```json
{
  "id": "2",
  "title": "Important Update",
  "message": "Please check your vehicle status",
  "imageUrl": "https://...",
  "targetGroup": "all",
  "status": "draft",
  "createdAt": "2024-11-28T10:40:00Z",
  "readCount": 0,
  "totalCount": 0
}
```

### PUT /notifications/:id
Mettre à jour une notification

**Request:**
```json
{
  "title": "Updated Title",
  "message": "Updated message",
  "status": "scheduled"
}
```

**Response (200):** Notification mise à jour

### DELETE /notifications/:id
Supprimer une notification

**Response (204):** No content

### POST /notifications/:id/send
Envoyer une notification

**Request:**
```json
{
  "recipientIds": ["user1", "user2"],
  "scheduledAt": "2024-11-28T15:00:00Z"
}
```

**Response (200):**
```json
{
  "message": "Notification sent to 2 users",
  "sentCount": 2,
  "failedCount": 0
}
```

---

## 📄 Documents

### GET /documents
Lister tous les documents

**Query Parameters:**
- `status`: pending, approved, rejected
- `type`: insurance, registration, inspection, maintenance, other
- `vehicleId`: filtrer par véhicule
- `ownerId`: filtrer par propriétaire

**Response (200):**
```json
{
  "data": [
    {
      "id": "doc1",
      "vehicleId": "v1",
      "ownerId": "u1",
      "type": "insurance",
      "fileName": "insurance_2024.pdf",
      "fileUrl": "https://...",
      "uploadDate": "2024-11-28T10:00:00Z",
      "expiryDate": "2025-11-28T23:59:59Z",
      "status": "pending",
      "notes": null
    }
  ],
  "total": 1
}
```

### GET /documents/vehicle/:vehicleId
Lister documents d'un véhicule

**Response (200):** Array de documents

### POST /documents
Upload un document

**Content-Type:** multipart/form-data

**Form Data:**
- `file`: File (PDF)
- `vehicleId`: string
- `type`: string (insurance, registration, inspection, maintenance, other)
- `expiryDate` (optional): ISO date string

**Response (201):**
```json
{
  "id": "doc2",
  "vehicleId": "v1",
  "type": "insurance",
  "fileName": "insurance_2024.pdf",
  "fileUrl": "https://...",
  "uploadDate": "2024-11-28T10:30:00Z",
  "status": "pending"
}
```

### POST /documents/:id/approve
Approuver un document

**Request:**
```json
{
  "notes": "Document verified successfully"
}
```

**Response (200):**
```json
{
  "id": "doc1",
  "status": "approved",
  "notes": "Document verified successfully"
}
```

### POST /documents/:id/reject
Rejeter un document

**Request:**
```json
{
  "reason": "Document is blurry and unreadable"
}
```

**Response (200):**
```json
{
  "id": "doc1",
  "status": "rejected",
  "notes": "Document is blurry and unreadable"
}
```

---

## 🚗 Véhicules

### GET /vehicles
Lister tous les véhicules

**Query Parameters:**
- `status`: active, inactive, pending_review
- `ownerId`: filtrer par propriétaire

**Response (200):**
```json
{
  "data": [
    {
      "id": "v1",
      "ownerId": "u1",
      "make": "BMW",
      "model": "750i",
      "year": 2023,
      "color": "Noir",
      "licensePlate": "AB-123-CD",
      "vin": "WBADH7C50DE123456",
      "status": "active",
      "mileage": 5250,
      "lastMaintenance": "2024-10-15",
      "createdAt": "2024-01-15",
      "updatedAt": "2024-11-28"
    }
  ],
  "total": 1
}
```

### GET /vehicles/:id
Détails d'un véhicule

**Response (200):** Objet véhicule avec documents

### POST /vehicles
Créer un véhicule (admin)

**Request:**
```json
{
  "ownerId": "u1",
  "make": "Mercedes",
  "model": "S-Class",
  "year": 2024,
  "color": "Blanc",
  "licensePlate": "EF-456-GH",
  "vin": "WDDZF3CB3JD123456",
  "mileage": 0
}
```

**Response (201):** Objet véhicule créé

### PUT /vehicles/:id
Mettre à jour un véhicule

**Request:**
```json
{
  "mileage": 5500,
  "color": "Gris",
  "status": "active"
}
```

**Response (200):** Véhicule mis à jour

---

## 🔄 Mises à Jour Véhicules

### GET /updates
Lister toutes les demandes de mise à jour

**Query Parameters:**
- `status`: pending, approved, rejected
- `vehicleId`: filtrer par véhicule

**Response (200):**
```json
{
  "data": [
    {
      "id": "u1",
      "vehicleId": "v1",
      "field": "mileage",
      "oldValue": 5000,
      "newValue": 5250,
      "status": "pending",
      "requestedAt": "2024-11-28T10:00:00Z",
      "reviewedAt": null,
      "reviewedBy": null,
      "notes": null
    }
  ],
  "total": 1
}
```

### GET /updates?status=pending
Lister les mises à jour en attente

**Response (200):** Array de mises à jour

### POST /updates/:id/approve
Approuver une mise à jour

**Request:**
```json
{
  "notes": "Mileage verified through inspection"
}
```

**Response (200):**
```json
{
  "id": "u1",
  "status": "approved",
  "reviewedAt": "2024-11-28T10:30:00Z",
  "reviewedBy": "admin1",
  "notes": "Mileage verified through inspection"
}
```

### POST /updates/:id/reject
Rejeter une mise à jour

**Request:**
```json
{
  "reason": "Mileage value seems incorrect"
}
```

**Response (200):**
```json
{
  "id": "u1",
  "status": "rejected",
  "reviewedAt": "2024-11-28T10:30:00Z",
  "reviewedBy": "admin1",
  "notes": "Mileage value seems incorrect"
}
```

---

## 📊 Dashboard / Stats

### GET /dashboard/stats
Récupérer les statistiques du dashboard

**Response (200):**
```json
{
  "totalUsers": 1250,
  "totalVehicles": 950,
  "pendingDocuments": 43,
  "pendingUpdates": 12,
  "notificationsSent": 487,
  "activeNotifications": 8,
  "lastUpdated": "2024-11-28T10:30:00Z"
}
```

### GET /activity/recent
Récupérer les activités récentes

**Query Parameters:**
- `limit`: nombre max d'activités (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "a1",
      "type": "document_upload",
      "description": "Insurance document uploaded",
      "timestamp": "2024-11-28T10:30:00Z",
      "userId": "u1",
      "vehicleId": "v1"
    }
  ],
  "total": 1
}
```

---

## 🔒 Codes d'Erreur

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Succès |
| 201 | Created | Ressource créée |
| 204 | No Content | Succès (pas de contenu) |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token invalide/expiré |
| 403 | Forbidden | Permission refusée |
| 404 | Not Found | Ressource non trouvée |
| 422 | Validation Error | Erreur de validation |
| 500 | Internal Error | Erreur serveur |

**Format erreur:**
```json
{
  "error": "Bad Request",
  "message": "Email already exists",
  "code": 400
}
```

---

## 🧪 Exemples avec cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@luxedrive.com","password":"password123"}'
```

### Créer une notification
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title":"Maintenance Due",
    "message":"Your vehicle needs maintenance",
    "targetGroup":"all",
    "status":"draft"
  }'
```

### Upload un document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@insurance.pdf" \
  -F "vehicleId=v1" \
  -F "type=insurance"
```

---

## 🔗 WebSocket Events

### Connexion
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'JWT_TOKEN' }
})
```

### Events à écouter
```javascript
socket.on('dashboard:update', (data) => {
  console.log('Dashboard stats updated', data)
})

socket.on('notification:sent', (data) => {
  console.log('Notification was sent', data)
})

socket.on('document:status-changed', (data) => {
  console.log('Document status changed', data)
})

socket.on('vehicle:update-request', (data) => {
  console.log('New vehicle update request', data)
})
```

---

Pour plus de détails ou questions, consultez le README.md.
