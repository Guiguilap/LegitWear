export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { email, subject, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: "Champs manquants" });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LegitWear <onboarding@resend.dev>",
        to: "legitwear.contact1@gmail.com",
        reply_to: email,
        subject: `[Contact LegitWear] ${subject || "Nouveau message"}`,
        text: `Email : ${email}\nSujet : ${subject || "Non précisé"}\n\nMessage :\n${message}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: errorData.message || "Erreur envoi email" });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
