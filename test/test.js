const test = require("tape");
const APIService = require("../lib/index");

// Fake localstorage
require("jsdom-global")("", { url: "http://localhost:3052" });

test("test request", async function (t) {
  try {
    APIService.config.API_URL = "http://localhost:3052";

    await APIService.signin({
      username: "admin",
      password: "12345678",
    });

    const ret = await APIService.ask("SKU", true);
    t.deepEqual(
      ret.logicform,
      { query: {}, schema: "product", schemaName: "产品" },
      "successfully get logicform"
    );
    const ret2 = await APIService.execLogicform({
      schema: "product",
      operator: "$count",
    });
    t.deepEqual(ret2.result, 6, "successfully get result");
    await APIService.createData({ _id: "product" }, [{ _id: "x", 名称: "x" }]);
    await APIService.updateDataByID({ _id: "product" }, "x", { 名称: "xx" });
    await APIService.removeDataByID({ _id: "product" }, "x");
  } catch (error) {
    t.fail("should not throw error");
    console.log(error);
  }
});
