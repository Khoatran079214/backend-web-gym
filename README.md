# Gym Manager Backend

Backend cho hệ thống quản lý phòng tập gym sử dụng **Express.js** + **Bun** + **MongoDB**.

## Cài đặt

### Yêu cầu
- **Bun** >= 1.0 ([cài đặt](https://bun.sh))
- **MongoDB** (Cloud hoặc Local)

### Bước 1: Cài đặt dependencies
```bash
bun install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Bước 3: Chạy server
```bash
# Development mode (auto-reload)
bun run dev

# Production mode
bun run start
```

Server sẽ chạy tại `http://127.0.0.1:3000`

## API Endpoints

### Users CRUD

#### 1. Tạo user mới
```
POST /users
Content-Type: application/json

{
  "username": "admin",
  "password_hash": "hashed_password",
  "role": "admin",
  "linked_trainer": null,
  "linked_member": null
}
```

#### 2. Lấy user theo ID
```
GET /users/:id
```

#### 3. Lấy tất cả users
```
GET /users
```

#### 4. Cập nhật user
```
PUT /users/:id
Content-Type: application/json

{
  "role": "trainer",
  "last_login_at": "2024-10-19T12:00:00Z"
}
```

#### 5. Xóa user
```
DELETE /users/:id
```

#### 6. Tìm user theo username
```
GET /users/search/:username
```

## Cấu trúc Project

```
backend/
├── src/
│   ├── models/          # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Member.ts
│   │   └── Trainer.ts
│   ├── routes/          # API routes
│   │   └── users.ts
│   ├── db/              # Database config
│   │   └── database.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── index.ts         # Entry point
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Công nghệ sử dụng

- **Express.js**: Web framework
- **Bun**: JavaScript runtime
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **TypeScript**: Type safety
- **bcryptjs**: Password hashing

## Database Models

### 1. **User** - Tài khoản
```typescript
{
  username: string (unique)
  password_hash: string
  role: "admin" | "staff" | "trainer"
  linked_trainer?: ObjectId
  linked_member?: ObjectId
  last_login_at?: Date
  created_at: Date
  updated_at: Date
}
```

### 2. **Member** - Hội viên
```typescript
{
  full_name: string
  phone?: string
  email?: string (unique)
  date_of_birth?: Date
  gender?: "male" | "female" | "other"
  address?: string
  status: "active" | "inactive"
  created_at: Date
  updated_at: Date
}
```

### 3. **Trainer** - Huấn luyện viên
```typescript
{
  full_name: string
  phone?: string
  email?: string (unique)
  specialty?: string
  image_id?: ObjectId (ref: Image)
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### 4. **Image** - Hình ảnh
```typescript
{
  filename: string
  file_path: string
  file_size?: number
  mime_type?: string
  uploaded_by?: ObjectId (ref: User)
  created_at: Date
  updated_at: Date
}
```

### 5. **Class** - Loại lớp
```typescript
{
  name: string
  description?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### 6. **MembershipPlan** - Gói tập
```typescript
{
  name: string
  description?: string
  duration_days?: number
  session_count?: number
  price_cents: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### 7. **Subscription** - Đăng ký gói
```typescript
{
  member_id: ObjectId (ref: Member)
  plan_id: ObjectId (ref: MembershipPlan)
  start_date: Date
  end_date?: Date
  remaining_sessions?: number
  status: "active" | "expired" | "paused" | "cancelled"
  created_at: Date
  updated_at: Date
}
```

### 8. **Checkin** - Điểm danh
```typescript
{
  member_id: ObjectId (ref: Member)
  checked_in_at: Date
  note?: string
  created_at: Date
  updated_at: Date
}
```

### 9. **ClassSession** - Ca lớp cụ thể
```typescript
{
  class_id: ObjectId (ref: Class)
  trainer_id?: ObjectId (ref: Trainer)
  starts_at: Date
  ends_at: Date
  capacity: number
  location?: string
  created_at: Date
  updated_at: Date
}
```

### 10. **ClassEnrollment** - Đăng ký ca lớp
```typescript
{
  session_id: ObjectId (ref: ClassSession)
  member_id: ObjectId (ref: Member)
  enrolled_at: Date
  status: "enrolled" | "cancelled" | "attended" | "missed"
  created_at: Date
  updated_at: Date
}
```

### 11. **Payment** - Thanh toán
```typescript
{
  member_id: ObjectId (ref: Member)
  subscription_id?: ObjectId (ref: Subscription)
  amount_cents: number
  currency: string
  method?: string
  paid_at: Date
  note?: string
  created_at: Date
  updated_at: Date
}
```

## Cấu trúc Project

```
backend/
├── src/
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Member.ts
│   │   ├── Trainer.ts
│   │   ├── Image.ts
│   │   ├── Class.ts
│   │   ├── MembershipPlan.ts
│   │   ├── Subscription.ts
│   │   ├── Checkin.ts
│   │   ├── ClassSession.ts
│   │   ├── ClassEnrollment.ts
│   │   ├── Payment.ts
│   │   └── index.ts
│   ├── routes/              # API routes
│   │   └── users.ts
│   ├── db/                  # Database config
│   │   └── database.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── index.ts             # Entry point
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Users
- `POST /users` - Tạo user mới
- `GET /users` - Lấy tất cả users
- `GET /users/:id` - Lấy user theo ID
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user
- `GET /users/search/:username` - Tìm user theo username

### Members (Sắp tới)
- `POST /members` - Tạo hội viên
- `GET /members` - Lấy tất cả hội viên
- `GET /members/:id` - Lấy hội viên theo ID
- `PUT /members/:id` - Cập nhật hội viên
- `DELETE /members/:id` - Xóa hội viên

### Trainers (Sắp tới)
- `POST /trainers` - Tạo huấn luyện viên
- `GET /trainers` - Lấy tất cả huấn luyện viên
- `GET /trainers/:id` - Lấy huấn luyện viên theo ID
- `PUT /trainers/:id` - Cập nhật huấn luyện viên
- `DELETE /trainers/:id` - Xóa huấn luyện viên

### Classes (Sắp tới)
- `POST /classes` - Tạo lớp
- `GET /classes` - Lấy tất cả lớp
- `GET /classes/:id` - Lấy lớp theo ID
- `PUT /classes/:id` - Cập nhật lớp
- `DELETE /classes/:id` - Xóa lớp

## Phát triển tiếp theo

- [ ] Tạo routes CRUD cho Members, Trainers, Classes
- [ ] Tạo routes CRUD cho Subscriptions, Payments
- [ ] Thêm authentication (JWT)
- [ ] Thêm validation middleware (Zod/Joi)
- [ ] Thêm error handling middleware
- [ ] Thêm logging (Winston/Pino)
- [ ] Thêm unit tests
- [ ] Thêm API documentation (Swagger/OpenAPI)
- [ ] Thêm rate limiting
- [ ] Thêm CORS configuration
