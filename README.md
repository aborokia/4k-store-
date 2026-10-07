# Angel Store - Full Project Setup

مشروع متكامل لبناء متجر بيع ألعاب، حسابات، وأكواد شحن رقمية مشابه لمتجر **Angel Store**.

## 🛠️ المكونات والتقنيات
- **الخلفية (Backend):** Node.js + Express.js
- **قاعدة البيانات (Database):** PostgreSQL مع Prisma ORM
- **التوثيق والحماية (Auth):** JWT + Bcrypt
- **الواجهة الأمامية (Frontend):** HTML5, Tailwind CSS, JavaScript (موجودة في مجلد `public`)

## 🚀 طريقة التشغيل

1. **فك الضغط وتثبيت الحزم:**
   ```bash
   npm install
   ```

2. **إعداد قاعدة البيانات:**
   - قم بإنشاء قاعدة بيانات PostgreSQL.
   - قم بنسخ ملف `.env.example` إلى `.env` واكتب رابط قاعدة البيانات الخاص بك:
     ```env
     DATABASE_URL="postgresql://username:password@localhost:5432/angel_store?schema=public"
     JWT_SECRET="your_secret_key"
     ```

3. **تطبيق Migration لقاعدة البيانات:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **تشغيل السيرفر:**
   ```bash
   npm run dev
   ```

5. **عرض الموقع:**
   افتح المتصفح على: `http://localhost:5000/public/index.html` أو اسحب ملف `index.html` إلى المتصفح مباشر.
