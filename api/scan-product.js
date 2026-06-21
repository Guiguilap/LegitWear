export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { images, description } = req.body;

  if (!images || !images.length) {
    return res.status(400).json({ error: 'Images manquantes' });
  }

  const imgBlocks = images.map(img => ({
    type: "image",
    source: { type: "base64", media_type: img.type, data: img.data }
  }));

  const textPrompt = "Tu es un expert en authentification de vetements streetwear et luxe. "
    + "Analyse ces photos. Description utilisateur: " + (description || "Non fournie") + ". "
    + "Reponds UNIQUEMENT en JSON valide, sans texte avant ou apres, sans markdown. "
    + "Structure exacte: "
    + '{"verdict":"authentic","score":85,"brand":"Nike","product_type":"Sneakers",'
    + '"summary":"Texte ici.","issues":[{"type":"ok","zone":"Logo","description":"Detail"}],'
    + '"advice":"Conseil ici."}'
    + " Le verdict doit etre: authentic, fake, ou uncertain. Score entre 0 et 100. Analyse 5 zones minimum.";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: [...imgBlocks, { type: "text", text: textPrompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erreur API Anthropic' });
    }

    const raw = (data.content || []).map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);

    res.status(200).json(result);
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: err.message });
  }
}
