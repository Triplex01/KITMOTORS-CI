# 👨‍💻 Guide de Contribution

Merci de contribuer au Admin Dashboard Luxe Drive Hub!

## 🚀 Démarrage Développeur

### Prérequis
- Node.js 16+
- Git
- Un éditeur de code (VS Code recommandé)

### Setup Local

```bash
# Clone le repository
git clone https://github.com/yourusername/luxe-admin-dashboard.git
cd luxe-admin-dashboard

# Installez les dépendances
npm install

# Lancez le dev server
npm run dev

# Dans un autre terminal, lancez le linter
npm run lint

# Et le type-check en watch
npm run type-check
```

Accédez à `http://localhost:5173`.

## 📋 Avant de Committer

### 1. Vérifiez les Types TypeScript
```bash
npm run type-check
```

### 2. Vérifiez les Erreurs ESLint
```bash
npm run lint
```

### 3. Formatez le Code
```bash
npx prettier --write src/
```

### 4. Testez Localement
```bash
npm run build && npm run preview
```

## 🌳 Git Workflow

### Branch Naming
```
feature/nom-feature          # Nouvelles fonctionnalités
bugfix/nom-bug              # Corrections de bugs
docs/description            # Documentation
refactor/description        # Refactoring
```

### Commit Messages
Utilisez le format Conventional Commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement logique
- `refactor`: Refactoring code
- `perf`: Amélioration performance
- `test`: Ajouter/modifier tests
- `chore`: Dependencies, configuration

**Exemples**:
```
feat(notifications): ajouter filtrage par statut
fix(documents): corriger validation d'upload
docs: ajouter API documentation
refactor(pages): extraire composants réutilisables
```

## 📝 Conventions de Code

### Nommage

#### Components
```typescript
// ✅ PascalCase pour les composants
export const NotificationCard: React.FC<Props> = ({ ... }) => {
  return <div>...</div>
}

// ✅ Files: PascalCase.tsx
// NotificationCard.tsx
```

#### Variables/Functions
```typescript
// ✅ camelCase
const handleSubmit = () => { }
const isLoading = false
const userData = { }

// ✅ Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000'
const MAX_FILE_SIZE = 10 * 1024 * 1024
```

#### Interfaces/Types
```typescript
// ✅ PascalCase
interface User {
  id: string
  name: string
  email: string
}

type Status = 'pending' | 'approved' | 'rejected'
```

### Imports
```typescript
// ✅ Organisez par groupes (external, internal)
import React from 'react'
import { useNavigate } from 'react-router-dom'

import useAuthStore from '@/stores/authStore'
import { notificationService } from '@/services/api'
import Header from '@/components/Header'
```

### TypeScript Strict
```typescript
// ❌ Evitez any
const data: any = { }

// ✅ Utilisez des types explicites
interface MyData {
  id: string
  name: string
}
const data: MyData = { id: '1', name: 'John' }
```

### Components React
```typescript
import React, { useState, useCallback } from 'react'

interface MyComponentProps {
  title: string
  onSubmit?: (data: FormData) => void
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onSubmit,
}) => {
  const [state, setState] = useState<string>('')

  const handleClick = useCallback(() => {
    setState('clicked')
  }, [])

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default MyComponent
```

## 📂 Structure de Dossiers

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages principales (routed)
├── stores/             # Zustand stores
├── services/           # API, WebSocket
├── types/              # Définitions TypeScript
└── index.css           # Styles globaux
```

### Ajouter un Nouveau Composant
```
src/components/MyComponent/
├── MyComponent.tsx      # Le composant
├── MyComponent.types.ts # Types/interfaces (optionnel)
├── MyComponent.css      # Styles locaux (optionnel)
└── index.ts            # Export

// src/components/index.ts
export { MyComponent } from './MyComponent'
```

### Ajouter une Nouvelle Page
```
src/pages/MyPage.tsx    # Fichier unique pour les pages

// Dans App.tsx
import MyPage from './pages/MyPage'

<Route path="/my-path" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
```

### Ajouter un Store Zustand
```
src/stores/myStore.ts

import { create } from 'zustand'

interface MyStore {
  count: number
  increment: () => void
  decrement: () => void
}

const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export default useMyStore
```

## 🎨 Styling Guidelines

### Tailwind CSS
```typescript
// ✅ Utilisez les classes Tailwind
<div className="bg-white rounded-xl shadow-luxury p-6">
  <h2 className="text-lg font-bold text-luxury-900">Title</h2>
</div>

// ❌ Evitez les styles inline
<div style={{ backgroundColor: 'white', padding: '24px' }}>
```

### Custom Utilities
Si besoin, ajoutez dans `src/index.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition;
  }
}
```

### Variables Tailwind
Modifiez dans `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      custom: '#FF5733',
    },
  },
}
```

## 🧪 Testing (À Implémenter)

### Ajouter Tests
```bash
npm install -D vitest @testing-library/react
```

**Test Structure**:
```typescript
// src/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

Run tests:
```bash
npm run test
```

## 🔄 Pull Request Workflow

1. **Créez une branche**
```bash
git checkout -b feature/mon-feature
```

2. **Committez vos changements**
```bash
git add .
git commit -m "feat(feature): description"
```

3. **Pushez vers votre fork**
```bash
git push origin feature/mon-feature
```

4. **Créez une Pull Request**
   - Titre clair et descriptif
   - Description détaillée des changements
   - Liez les issues si applicable
   - Assurez-vous que tous les tests passent

5. **Code Review**
   - Attendez la revue
   - Répondez aux commentaires
   - Faites les modifications demandées

6. **Merge**
   - Mainteneur merge la PR
   - Supprimez la branche

## 📚 Documentation

### Documenter le Code
```typescript
/**
 * Récupère les notifications filtrées
 * @param status - Statut des notifications (pending, sent, failed)
 * @param limit - Nombre max de résultats
 * @returns Promise<Notification[]>
 */
export const fetchNotifications = async (
  status?: string,
  limit?: number
): Promise<Notification[]> => {
  // ...
}
```

### Mettre à Jour README
Si vous ajoutez une feature majeure, mettez à jour:
- `README.md`
- `API_DOCUMENTATION.md`
- `PROJECT_STRUCTURE.md`

## 🐛 Reporting Bugs

Utilisez GitHub Issues avec template:

```
**Describe the bug**
Décrire le bug clairement

**Steps to reproduce**
1. Allez à...
2. Cliquez sur...
3. Le bug se produit

**Expected behavior**
Ce qui devrait se passer

**Screenshots**
Ajouter des screenshots si applicable

**Environment**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Node version: 18.x
```

## ✨ Feature Requests

Créez une issue:

```
**Is your feature request related to a problem?**
Décrire le problème

**Describe the solution**
Décrire la feature souhaitée

**Describe alternatives**
Autres solutions possibles

**Additional context**
Contexte supplémentaire
```

## 🔒 Security Guidelines

- ❌ Ne committez jamais secrets (tokens, clés, passwords)
- ✅ Utilisez `.env.example` pour templates
- ✅ Utilisez `localStorage` pour tokens (géré par Zustand)
- ✅ Validez les inputs utilisateur
- ✅ Utilisez HTTPS en production
- ✅ Configurez CORS correctement

## 📊 Performance Tips

1. **Code Splitting**
```typescript
const HomePage = lazy(() => import('./pages/HomePage'))
```

2. **Memoization**
```typescript
const MemoComponent = React.memo(MyComponent)
export const handler = useCallback(() => { }, [deps])
```

3. **Bundle Analysis**
```bash
npm install -D rollup-plugin-visualizer
```

4. **Lazy Load Images**
```html
<img loading="lazy" src="..." />
```

## 🤝 Community

- **Issues**: GitHub Issues pour bugs/features
- **Discussions**: Discussions GitHub pour questions
- **Email**: admin@luxedrive.com

## 📄 License

Contributeur = acceptation de la license du projet (©2025 Luxe Drive Hub)

---

**Merci de rendre ce projet meilleur! 🌟**

Pour aide supplémentaire: consultez README.md ou contactez l'équipe.
