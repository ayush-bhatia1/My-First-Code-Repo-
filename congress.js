
const express = require("express");
const router = express.Router();
const { fetchCongressTrades } = require("../services/congressService");

router.get("/congress-trades", async (req, res) => {
  try {
    const { txDate, pageLimit } = req.query;
    const rows = await fetchCongressTrades({
      txDate: txDate || undefined,
      pageLimit: pageLimit ? Number(pageLimit) : undefined,
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

module.exports = router;
