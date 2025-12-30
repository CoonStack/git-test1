const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { Pool } = require("pg");


const app = express();
const PORT = process.env.PORT || 3000;

// Render/Supabase/Neon 배포에서 환경변수로 주입할 값
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase/Neon은 보통 ssl 필요 (connection string에 sslmode=require가 포함되는 경우가 많음)
  ssl: { rejectUnauthorized: false },
});

app.use(cors({
  origin: process.env.CORS_ORIGIN, // GitHub Pages 주소만 허용(권장)
}));
app.use(express.json());


app.get("/health", (req, res) => res.json({ ok: true }));


/**
 * 1) 문의 등록
 * POST /api/contacts
 * body: { name, email, message }
 */
app.post("/api/contacts", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  // 최소 검증(연습용)
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, message는 필수입니다." });
  }


  const q = `
    insert into contacts (name, email, message)
    values ($1, $2, $3)
    returning id, name, email, message, created_at
  `;
  const values = [name.trim(), email.trim(), message.trim()];

  try {
    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "DB 저장 실패" });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const result = await pool.query(
      `select id, name, email, message, created_at from contacts order by id desc`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "DB 조회 실패" });
  }
});


app.listen(PORT, () => {
  console.log(`API: ${PORT}`);
});
