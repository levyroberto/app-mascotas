import { Router } from "express";
import axios from "axios";

const router = Router();


router.get("/animals", async (req, res) => {
  try {
    const url = `${process.env.MOCKAPI_BASE_URL}/animals`;
    const apiRes = await axios.get(url);
    res.json(apiRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/raza", async (req, res) => {
    try {
      const { typeId } = req.query;
      const url = `${process.env.MOCKAPI_BASE_URL}/raza`;
      const apiRes = await axios.get(url, {
        params: { typeId }
      });
  
      res.json(apiRes.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

export default router;
