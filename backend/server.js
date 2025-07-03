require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const IMAGE_DIR = path.join(__dirname, '..', 'frontend', 'public', 'meal-images');
const MEAL_CACHE_DIR = path.join(__dirname, 'meal-cache');
const SECRET_KEY = process.env.SECRET_KEY || 'kfKwZR$Q$hND%*%K';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use('/meal-images', express.static(IMAGE_DIR));

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
if (!fs.existsSync(MEAL_CACHE_DIR)) fs.mkdirSync(MEAL_CACHE_DIR, { recursive: true });

let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'mysql',
      database: 'smartpantry'
    });
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
  }
})();

// ——— Auth Middleware ———
function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = auth.slice(7);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ——— Register ———
app.post('/api/register', async (req, res) => {
  const {
    name,
    email,
    password,
    householdSize,
    numberOfKids,
    dietaryPreferences,
    flavorPreferences,
    allergies,
    cuisinePreferences
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      `INSERT INTO users (name, email, password, household_size, number_of_kids, dietary_preferences, flavor_preferences, allergies, cuisine_preferences)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        householdSize || null,
        numberOfKids || null,
        JSON.stringify(dietaryPreferences),
        JSON.stringify(flavorPreferences),
        JSON.stringify(allergies),
        JSON.stringify(cuisinePreferences)
      ]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ——— Login ———
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ——— Get Profile ———
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT name, email, dietary_preferences, flavor_preferences, allergies, cuisine_preferences
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const u = rows[0];
    const safeParse = (val) => {
      if (typeof val !== 'string') return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [val];
      }
    };

    res.json({
      name: u.name,
      email: u.email,
      dietaryPreferences: safeParse(u.dietary_preferences),
      flavorPreferences: safeParse(u.flavor_preferences),
      allergies: safeParse(u.allergies),
      cuisinePreferences: safeParse(u.cuisine_preferences)
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

app.post('/api/meal-suggestions', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { type = 'dinner' } = req.body;
  const sanitizedType = type.toLowerCase().replace(/[^a-z]/g, ''); // avoid unsafe filenames
  const cacheFile = path.join(MEAL_CACHE_DIR, `${userId}_${sanitizedType}.json`);

  // Return cached suggestions if under 24 hours old
  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    const ageMs = Date.now() - stats.mtimeMs;
    if (ageMs < 24 * 60 * 60 * 1000) {
      try {
        const cached = fs.readFileSync(cacheFile, 'utf-8');
        return res.json(JSON.parse(cached));
      } catch (err) {
        console.error('Error reading cache:', err);
      }
    }
  }

  try {
    // Fetch user preferences from DB
    const [rows] = await db.execute(
      `SELECT dietary_preferences, cuisine_preferences, flavor_preferences, allergies FROM users WHERE id = ?`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const userPrefsRaw = rows[0];

    const safeParse = (val) => {
      if (typeof val !== 'string') return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [val];
      }
    };

    const dietaryPreferences = safeParse(userPrefsRaw.dietary_preferences);
    const cuisinePreferences = safeParse(userPrefsRaw.cuisine_preferences);
    const flavorPreferences = safeParse(userPrefsRaw.flavor_preferences);
    const allergies = safeParse(userPrefsRaw.allergies);

    const prompt = `
You are a meal-planning assistant. Generate 7 ${sanitizedType} recipes for someone with:
- Dietary Preferences: ${dietaryPreferences.join(', ') || 'none'}
- Flavor Preferences: ${flavorPreferences.join(', ') || 'none'}
- Cuisine Preferences: ${cuisinePreferences.join(', ') || 'none'}
- Allergies to avoid: ${allergies.join(', ') || 'none'}

For each recipe, return a JSON object with:
1. name
2. recipe (a valid recipe URL)
3. neededIngredients (array)
4. method (step-by-step cooking instructions with full detail)

Return only a JSON array (no extra text). Like:

[
  {
    "name": "Recipe 1",
    "recipe": "https://...",
    "neededIngredients": ["ingredient 1", "ingredient 2"],
    "method": "Step 1: ...\\nStep 2: ..."
  },
  ...
]

Don't include an image.
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', 
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 800
    });

    const meals = JSON.parse(completion.choices[0].message.content.trim());

    const mealsWithImages = await Promise.all(
      meals.map(async (meal) => {
        try {
          const imageResp = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `a high-quality photo of ${meal.name}, plated, professional food photography`,
            n: 1,
            size: '1024x1024'
          });

          const imageUrl = imageResp.data[0].url;
          const filename = uuidv4() + '.png';
          const filepath = path.join(IMAGE_DIR, filename);

          const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
          const writer = fs.createWriteStream(filepath);
          imageStream.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          meal.image = `/meal-images/${filename}`;
        } catch (err) {
          console.error('Image generation failed for', meal.name, err);
          meal.image = null;
        }
        return meal;
      })
    );

    fs.writeFileSync(cacheFile, JSON.stringify(mealsWithImages, null, 2));
    res.json(mealsWithImages);
  } catch (err) {
    console.error('Meal generation failed:', err);
    res.status(500).json({ error: 'Failed to generate meal suggestions' });
  }
});
app.get('/api/collections/:area', authenticateToken, async (req, res) => {
  const slug = req.params.area;              // e.g. 'bbq', 'mocktails', etc.
  const page = parseInt(req.query.page) || 0;
  const limit = 7;
  const offset = page * limit;

  try {
    // 1) Lookup by slug → name: reverse slugification
    const lookupName = slug
      .replace(/-/g, ' ')                     // e.g. 'perfect-for-hot-days' → 'perfect for hot days'
      .toLowerCase();

   const [cols] = await db.query(
  `SELECT id, name, description, image_url
     FROM collections
    WHERE LOWER(name) = ?`,
  [lookupName]
);
if (!cols.length) return res.sendStatus(404);
const col = cols[0];

    // 2) Total count
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
         FROM collection_recipes
        WHERE collection_id = ?`,
      [col.id]
    );

    // 3) Paginated recipes
    const [recipes] = await db.query(
      `SELECT r.id, r.name, r.image_url
         FROM collection_recipes cr
         JOIN recipes r ON r.id = cr.recipe_id
        WHERE cr.collection_id = ?
        ORDER BY cr.added_at
        LIMIT ? OFFSET ?`,
      [col.id, limit, offset]
    );

    res.json({
      collection: { name: col.name, image_url: col.image_url, description: col.description },
      recipes,
      total,
      
    });
  } catch (err) {
    console.error('Error fetching collection:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Require authentication for viewing collections
app.get('/api/collections', authenticateToken, async (req, res) => {
  try {
    // Fetch all collections (admin‑created)
    const [rows] = await db.query(
      `SELECT id, name, image_url, created_at, description
         FROM collections
        ORDER BY created_at DESC`
    );

    // Derive slug from name
    const collections = rows.map(col => {
      const slug = col.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // strip punctuation
        .trim()
        .replace(/\s+/g, '-');      // spaces → dashes

      return {
        id: col.id,
        name: col.name,
        slug,
        image_url: col.image_url,
        created_at: col.created_at,
        description: col.description
      };
    });

    res.json(collections);
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// GET /api/recipes/:id
app.get('/api/recipes/:id', authenticateToken, async (req, res) => {
  const recipeId = req.params.id;
  const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [recipeId]);

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }
  console.log(recipe);
  res.json(recipe);
});

// ——— Start Server ———
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
