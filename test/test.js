const test = require("tape");
const APIService = require("../lib/index");

// Fake localstorage
require("jsdom-global")("", { url: "http://localhost:3052" });

// 1. 修改token，打开测试/
// 2. 在request.ts里面要把URL变一下
// test("test request", async function (t) {
//   window.localStorage.token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFjOGIxMjRkOGUzNmIxY2RiOTI5ZmMiLCJpYXQiOjE2MjE5MzU4MDAsImV4cCI6MTYyMjU0MDYwMH0.W0cjS9h7xbhP15KW9_LHrafhzN65JXY7SjPL5471auI";

//   try {
//     const ret = await APIService.ask("SKU", true);
//     t.deepEqual(
//       ret.logicform,
//       { query: {}, schema: "product", schemaName: "产品" },
//       "successfully get logicform"
//     );
//     const ret2 = await APIService.execLogicform({
//       schema: "product",
//       operator: "$count",
//     });
//     t.deepEqual(ret2.result, 6, "successfully get result");
//     await APIService.createData({ _id: "product" }, [{ _id: "x", 名称: "x" }]);
//     await APIService.updateDataByID({ _id: "product" }, "x", { 名称: "xx" });
//     await APIService.removeDataByID({ _id: "product" }, "x");
//   } catch (error) {
//     t.fail("should not throw error");
//     console.log(error);
//   }
// });
