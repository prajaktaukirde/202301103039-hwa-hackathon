module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const orderNumber = 'SN-' + Math.random().toString(36).toUpperCase().slice(2, 10);

    return res.status(200).json({
      ok: true,
      orderNumber,
      order: {
        orderNumber,
        name: null,
        email: null,
        address: null,
        city: null,
        postal: null,
        items: null,
        total: null,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
