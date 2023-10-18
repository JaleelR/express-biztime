const express = require("express");

const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");


router.get("/", async (req, res, next) => {
    try {
        const resp = await db.query(`SELECT * FROM companies`);
        return res.status(200).json({ companies: resp.rows })
    } catch (e) {
        return  next(e)
    } 
})

/*
describe("GET /companies", () => {
    test("Getting a list of companies", async () => {
    const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: [testC]})
    })
})
*/


router.get("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const resp = await db.query(`SELECT * FROM companies INNER JOIN invoices ON companies.code = invoices.comp_code WHERE companies.code = $1`, [code]);
        if (resp.rows.length === 0) {
            throw new ExpressError(`Can't find comapny with code id of ${code}`, 404)
        }
        return res.status(200).json({ company: resp.rows});

    } catch (e) {
        return next(e);
    }
})

/*
describe("GET /companies/:code", () => {
    test("Test to get specific company", async () => {
    const res = await request(app).get(`/companies/${testC.code}`);
        expect(res.statusCode).toBe(200);
        expect(resBody).toEqual({company: [testC]})
    })
})
*/



//results make sure you give something back
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const resp = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({ company: resp.rows[0]});
    } catch(e) {
    return next(e);    
     } 
})
/*
describe("POST /companies", () => {
    test("Making a new company", async () => {
    const res = await request(app).post(`/companies`).json({
    code "ZZ",
    name: "Zen Zone",
    description: "Life Changing"
    });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ company: {
        code: expect.any(String), 
        name: "Zen Zone"
        description: "Life Changing"
        }})
    })
})
*/




//update is more useful for updating rows in tables 
router.put("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const resp = await db.query(`UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);
        if (resp.rows.length === 0) {
            throw new ExpressError(`Can't find comapny with code id of ${code}`, 404)
        }
        return res.status(200).json({ company: resp.rows[0] });

    } catch (e) {
        return next(e);
    }
});
/*
describe("", () => {
    test("", async () => {
        expect(). 
        exprect().
    })
})
*/





router.delete("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const resp = await db.query(`DELETE FROM companies WHERE code = $1`, [code]);
        return res.status(200).json({ status: "deleted" });
    } catch (e) {
        return next(e);
    }
});
/*
describe("", () => {
    test("", async () => {
        expect(). 
        exprect().
    })
})
*/





module.exports = router;