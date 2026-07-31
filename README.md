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

คัดลอกไฟล์ตัวอย่าง:

```bash
copy server\.env.example server\.env
```

ค่าเริ่มต้นใน `server/.env.example` ใช้กับ `docker-compose.yml` ได้ทันที

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

