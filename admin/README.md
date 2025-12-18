# Admin Panel - Master Rad

Administratorski panel za upravljanje sistemom edukatorne platforme.

## 🚀 Pokretanje

### Instalacija zavisnosti

```bash
yarn install
```

### Development server

```bash
yarn dev
```

Aplikacija će biti dostupna na [http://localhost:3002](http://localhost:3002)

### Production build

```bash
yarn build
yarn start
```

## 📋 Funkcionalnosti

### 🔐 Autentifikacija
- Prijavljivanje za admin korisnike
- JWT autentifikacija
- Auto logout na nevalidnom tokenu

### 👥 Upravljanje Korisnicima
- Pregled svih korisnika
- Kreiranje novih korisnika
- Izmena korisničkih podataka
- Brisanje korisnika
- Dodela uloga (USER, MODERATOR, ADMIN)
- Pretraga i filtriranje

### 📁 Forum Kategorije
- CRUD operacije za kategorije
- Pregled broja postova po kategoriji
- Zaštita od brisanja kategorija sa postovima

### 💬 Moderacija Forum Postova
- Pregled svih forum postova
- Brisanje neprikladnih postova
- Postavljanje glavnih vesti
- Pretraga po naslovu i kategoriji
- Pregled autora i reakcija

### 📢 Upravljanje Obaveštenjima
- Kreiranje novih obaveštenja
- Izmena postojećih obaveštenja
- Dodavanje linkova i opisa
- Brisanje obaveštenja
- Paginacija

### 📚 Predmeti i Razredi
- Dodavanje predmeta i razreda
- Izmena postojećih
- Brisanje
- Pregled statistike

### 📊 Dashboard
- Pregled statistike sistema
- Broj korisnika, postova, planova
- Najnoviji korisnici
- Najnoviji forum postovi

## 🛠️ Tehnologije

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI komponente
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifikacije
- **Lucide React** - Ikone

## 🔧 Konfiguracija

### Environment variables

Kreirati `.env.local` fajl:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📝 Napomene

- Admin panel je dostupan samo korisnicima sa `ADMIN` ulogom
- Backend API mora biti pokrenut na portu 3001
- Svi zahtevi koriste JWT autentifikaciju

## 🔑 Default Admin Pristup

Potrebno je ručno kreirati admin korisnika kroz bazu ili seed script u backend-u.

Primer SQL query-ja:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## 📖 Struktura Projekata

```
admin/
├── app/
│   ├── dashboard/
│   │   ├── users/
│   │   ├── forum-categories/
│   │   ├── forum-posts/
│   │   ├── announcements/
│   │   └── subjects/
│   ├── login/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn komponente
│   └── dashboard-layout.tsx
└── lib/
    ├── api.ts
    └── auth-store.ts
```
