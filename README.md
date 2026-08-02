# Personal Book Library with JWT Authentication

เว็บแอปจัดการคลังหนังสือส่วนตัว แยกเป็น Next.js frontend และ Express backend พร้อม PostgreSQL, Prisma, JWT และ bcryptjs

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL + Prisma
- Authentication: JWT + bcryptjs

## การติดตั้ง

```bash
npm install
```

## Environment Variables

คัดลอกไฟล์ตัวอย่างของ Backend:

```bash
copy server\.env.example server\.env
```

ค่าเริ่มต้นใน `server/.env.example` ใช้กับ `docker-compose.yml` ได้ทันที

Frontend ใช้ `http://localhost:4000` เป็น API URL เริ่มต้น หากต้องการเปลี่ยน URL ให้คัดลอกไฟล์ตัวอย่าง:

```bash
copy client\.env.example client\.env.local
```

Environment variables ที่ใช้:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret สำหรับลงนามและตรวจสอบ JWT
- `JWT_EXPIRES_IN`: อายุของ JWT เช่น `1h`
- `PORT`: พอร์ตของ Backend
- `CLIENT_ORIGIN`: Origin ที่ CORS อนุญาต
- `NEXT_PUBLIC_API_URL`: URL ของ Backend ที่ Frontend เรียกใช้งาน

## รัน Database และเตรียมข้อมูล

```bash
docker compose up -d
npm run prisma:migrate --workspace server
npm run seed --workspace server
```

## รันโปรเจกต์

รัน backend และ frontend พร้อมกัน:

```bash
npm run dev
```

หรือแยก terminal:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Username/Password สำหรับทดสอบ

- Username: `admin`
- Password: `password123`

## API Endpoints

- `POST /api/login`
- `GET /api/books`
- `POST /api/books` ต้องส่ง `Authorization: Bearer <token>`
- `DELETE /api/books/:id` ต้องส่ง `Authorization: Bearer <token>`

ไฟล์ Bruno สำหรับทดสอบอยู่ใน `api-collection/`
