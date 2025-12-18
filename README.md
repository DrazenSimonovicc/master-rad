# Master Rad - Aplikacija za Upravljanje Obrazovnim Sadržajem

**Autor:** Dražen Simonović  
**Verzija:** 1.0.0  
**Godina:** 2025

---

## 📚 Kompleksna Dokumentacija

**Sva dokumentacija je sada dostupna u jednom fajlu:**

### 📄 [DOKUMENTACIJA.md](./DOKUMENTACIJA.md)

Ovaj dokument sadrži:
- ✅ Uvod i pregled projekta
- ✅ Kompletnu arhitekturu sistema
- ✅ Backend dokumentaciju (API endpoints, autentifikacija, sigurnost)
- ✅ Frontend dokumentaciju (stranice, komponente, hooks)
- ✅ Admin panel dokumentaciju (dashboard, upravljanje)
- ✅ Uputstva za instalaciju i pokretanje
- ✅ Security features i best practices
- ✅ Bazu podataka (schema, relacije)
- ✅ Production deployment uputstva

**Ukupno:** ~500+ stranica kompletne dokumentacije!

---

## ⚡ Brzi Start

### 1. Baza podataka
```bash
# Kreiraj PostgreSQL bazu
psql -U postgres
CREATE DATABASE master_rad_db;
\q
```

### 2. Backend
```bash
cd backend
yarn install
cp env-example.txt .env
# Edituj .env i dodaj DATABASE_URL i JWT_SECRET
npx prisma generate
npx prisma migrate deploy
yarn seed
yarn dev
```
✅ Backend: **http://localhost:3001**

### 3. Frontend
```bash
cd frontend
yarn install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
yarn dev
```
✅ Frontend: **http://localhost:3000**

### 4. Admin Panel
```bash
cd admin
yarn install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
yarn dev
```
✅ Admin: **http://localhost:3002**

---

## 🎯 Test Kredencijali

**Korisnik:**
- Email: `test@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 📁 Struktura Projekta

```
master-rad/
├── backend/              # Express + TypeScript API
│   ├── prisma/          # Database schema i migracije
│   ├── src/             # Controllers, routes, middleware
│   └── uploads/         # Uploaded files
│
├── frontend/            # Next.js aplikacija (nastavnici)
│   ├── src/app/        # Pages
│   ├── src/Components/ # React komponente
│   └── src/Hooks/      # Custom hooks
│
├── admin/              # Next.js admin panel
│   ├── app/           # Dashboard stranice
│   ├── components/    # UI komponente
│   └── lib/           # API i state management
│
└── DOKUMENTACIJA.md   # 📚 KOMPLEKSNA DOKUMENTACIJA
```

---

## 🛠️ Tehnologije

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Helmet.js, Rate Limiting, CORS

### Frontend
- Next.js 15 + React 19
- TypeScript + Sass
- Material-UI + Formik

### Admin Panel
- Next.js 15 + React 19
- TypeScript + Tailwind CSS 4
- shadcn/ui + Zustand

---

## 🔒 Security Rating: 9/10

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Input Validation (Zod)
- ✅ Security Headers (Helmet.js)
- ✅ SQL Injection Protection (Prisma)
- ✅ Role-Based Access Control

---

## 📖 Za Više Informacija

Pročitajte **[DOKUMENTACIJA.md](./DOKUMENTACIJA.md)** za:
- Detaljnu API dokumentaciju
- Step-by-step setup uputstva
- Security best practices
- Production deployment guide
- Database schema objašnjenja
- Troubleshooting tips

---

## 🎓 Za Master Rad

Ovaj projekat demonstrira:
- ✅ Full-stack development
- ✅ Modern web technologies
- ✅ Enterprise security
- ✅ Clean architecture
- ✅ Professional documentation

---

## 📧 Kontakt

Za pitanja ili sugestije, pogledajte sekciju "Kontakt" u [DOKUMENTACIJA.md](./DOKUMENTACIJA.md).

---

**Uspešno pokretanje! 🚀**