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
    const body = req.body || {};
    const orderNumber = 'SN-' + Math.random().toString(36).toUpperCase().slice(2, 10);

    return res.status(200).json({
      ok: true,
      orderNumber,
      order: {
        orderNumber,
        name: body.name,
        email: body.email,
        address: body.address,
        city: body.city,
        postal: body.postal,
        items: body.items,
        total: body.total,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};
