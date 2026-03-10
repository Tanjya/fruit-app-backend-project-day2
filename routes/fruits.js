const express = require("express");
const router = express.Router();
const fruits = require("../controllers/fruits")

router.get('/', fruits.index)

router.get("/:name", fruits.show);

router.post("/", fruits.create);

router.patch("/:name", fruits.update);

router.delete("/:name", fruits.destroy);

module.exports = router
