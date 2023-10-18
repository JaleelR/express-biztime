const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
    try {
        const resp = await db.query(`SELECT * FROM invoices`);
        return res.status(200).json({ invoices: resp.rows })
    } catch (e) {
        return next(e)
    }
})
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const resp = await db.query("SELECT * FROM invoices WHERE id = $1", [id]);
        if (resp.rows.length === 0) {
            throw new ExpressError(`Cannot find id of ${resp.id}`, 404)
        }
        return res.status(200).json({invoice : resp.rows[0]})
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const resp = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, paid_date`, [comp_code, amt]);
        return res.status(201).json({ company: resp.rows[0]});
    } catch (e) {
        return next(e);
    }
})
module.exports = router;


router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const resp = await db.query("UPDATE invoices SET amt = $2 WHERE id = $1 RETURNING  id, comp_code, amt, paid, paid_date", [id, amt]);
        if (resp.rows.length === 0) {
            throw new ExpressError(`Cannot find id of ${resp.id}`, 404)
        }
        return res.status(200).json({invoice : resp.rows[0]})
    } catch (e) {
        return next(e)
    }
})



router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const resp = await db.query("DELETE FROM invoices WHERE id = $1", [id]);
        return res.status(200).json({ msg: "deleted" })
    } catch (e) {
        return next(e)
    }
})

