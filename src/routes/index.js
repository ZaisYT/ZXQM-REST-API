const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    const data = {
        "title": "ZXQM REST API",
        "version": 1.0
    }
    res.json(data);
});

module.exports = router;
