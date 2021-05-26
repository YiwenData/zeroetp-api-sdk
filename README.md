# zeroetp-api-sdk

零熵的访问 SDK。只能用于前端。

## 安装

```
npm i zeroetp-api-sdk --save
```

## 使用

```javascript
import APIService from "zeroetp-api-sdk";

const ret = await APIService.ask("SKU", true);

const ret2 = await APIService.execLogicform({
  schema: "product",
  operator: "$count",
});

await APIService.createData({ _id: "product" }, [{ _id: "x", 名称: "x" }]);
await APIService.updateDataByID({ _id: "product" }, "x", { 名称: "xx" });
await APIService.removeDataByID({ _id: "product" }, "x");
```
