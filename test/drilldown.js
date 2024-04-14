import tape from 'tape';
import { drilldownLogicform } from '../lib/index.esm.js';

tape('drilldown by category', async (t) => {
  const logicform = {
    query: {
      日期: {
        $gte: '2023-01-01 00:00:00',
        $lte: '2023-12-31 23:59:59',
        $options: {
          $offset: {
            year: 0,
          },
        },
      },
      店铺: {
        schema: 'store',
        query: {
          地理位置: {
            query: {
              名称: {
                $in: ['上海市', '江苏省'],
              },
            },
            schema: 'geo',
            entity_level: '省市',
          },
        },
      },
    },
    schema: 'sales',
    preds: [
      {
        pred: '销售额',
        operator: '$sum',
        name: '总销售额',
      },
    ],
    groupby: [
      {
        _id: '店铺_地理位置',
        level: '省市',
        name: '店铺_地理位置(省市)',
      },
    ],
    sort: {
      总销售额: -1,
    },
  };

  const schema = {
    _id: 'sales',
    name: '销售流水',
    syno: ['订单', '卖', '购买', '售', '销售'],
    type: 'event',
    properties: [
      {
        name: '日期',
        syon: ['时间', '日子'],
        type: 'timestamp',
        constraints: {
          required: true,
          enum: null,
        },
        _sid: 'LaUwkttWJYYuMI1fYDHhI',
        _id: 'timestamp',
        is_comparable: true,
        ui: {},
        primal_type: 'date',
        stats: {},
        schemaID: 'sales',
      },
      {
        name: '用户',
        type: 'object',
        ref: 'user',
        constraints: {
          enum: null,
        },
        _sid: 'PIuYKct8P6YhtYqCOa1Cs',
        _id: 'user',
        is_comparable: false,
        ui: {},
        is_categorical: false,
        primal_type: 'object',
        stats: {},
        schema: {
          _id: 'user',
          name: '用户',
          syno: ['买家', '消费者', '人', 'user'],
          type: 'entity',
          properties: [
            {
              name: '手机',
              type: 'ID',
              constraints: {
                unique: true,
                required: true,
                enum: null,
              },
              _sid: '54Zl_JH7KWHrmCZwO9k7o',
              _id: 'id',
              is_comparable: false,
              ui: {
                is_name: true,
              },
              syno: ['ID'],
              primal_type: 'string',
              stats: {},
            },
            {
              name: '性别',
              type: 'category',
              constraints: {
                enum: [
                  ['男性', '男'],
                  ['女性', '女'],
                ],
              },
              _sid: 'SnbxhwZSZ8k_CGUQCvMYm',
              _id: 'gender',
              is_comparable: false,
              is_categorical: true,
              is_name: false,
              ui: {},
              primal_type: 'string',
              stats: {
                distincts: ['男性', '女性'],
              },
            },
          ],
        },
        schemaID: 'sales',
      },
      {
        name: '产品',
        type: 'object',
        ref: 'product',
        constraints: {
          enum: null,
        },
        _sid: 'z1_VkKZzR8CXOToEb90sN',
        _id: 'product',
        is_comparable: false,
        ui: {},
        is_categorical: false,
        primal_type: 'object',
        stats: {},
        schema: {
          _id: 'product',
          name: '产品',
          syno: ['SKU', '商品', 'product'],
          type: 'entity',
          properties: [
            {
              name: '名称',
              syno: ['name'],
              type: 'name',
              constraints: {
                required: true,
                enum: null,
              },
              _sid: 'rWhm_XqrLlR-f1jkwOnzo',
              _id: 'name',
              is_comparable: false,
              is_name: true,
              is_categorical: false,
              ui: {},
              primal_type: 'string',
              auto_syno: true,
              stats: {},
            },
            {
              name: '编号',
              type: 'ID',
              constraints: {
                unique: true,
                required: true,
                enum: null,
              },
              _sid: 'ShLwI9lLbFLDZfk7uScZz',
              _id: 'id',
              is_comparable: false,
              ui: {},
              primal_type: 'string',
              is_name: true,
              stats: {},
              is_categorical: false,
            },
            {
              name: '品类',
              type: 'category',
              syno: ['category', '类目'],
              constraints: {
                enum: ['男装', '女装', '童装'],
              },
              hierarchy: {
                down: '子品类',
              },
              _sid: 'Dx981X8tSFT92O8Vqdk95',
              _id: 'category',
              is_comparable: false,
              is_categorical: true,
              is_name: false,
              ui: {},
              primal_type: 'string',
              stats: {
                distincts: ['男装', '女装', '童装'],
              },
            },
            {
              name: '子品类',
              type: 'category',
              syno: ['subcategory', '子类目'],
              constraints: {
                enum: null,
              },
              hierarchy: {
                up: '品类',
                down: '_id',
              },
              _sid: 'PeX8EODCFE40gMwvBGBMR',
              _id: 'subcategory',
              is_comparable: false,
              is_categorical: true,
              is_name: false,
              ui: {},
              primal_type: 'string',
              stats: {
                distincts: ['长袖', '牛仔裤', '连帽衫', '羊绒衫', '衬衫'],
              },
            },
            {
              name: '图片',
              type: 'image',
              constraints: {
                enum: null,
              },
              _sid: 'f2Q_ZFy12xejmkiUGdZEW',
              _id: 'picture',
              is_comparable: false,
              ui: {},
              syno: ['picture'],
              primal_type: 'image',
              stats: {},
            },
            {
              name: '价格',
              type: 'currency',
              config: 'CNY',
              syno: ['price'],
              constraints: {
                enum: null,
              },
              _sid: 'RHCSg6s2XZWOtCGIZX9BO',
              _id: 'price',
              is_comparable: true,
              is_additive: true,
              ui: {},
              primal_type: 'number',
              stats: {},
            },
            {
              name: '成本',
              type: 'currency',
              config: 'CNY',
              constraints: {
                enum: null,
              },
              _sid: 'cPF8t3SSCvLDanP4DDSpw',
              _id: 'cost',
              is_comparable: true,
              is_additive: true,
              ui: {},
              syno: ['cost'],
              primal_type: 'number',
              stats: {},
            },
            {
              name: '单件利润',
              type: 'currency',
              udf: {
                function: 'async (self) => self.价格 - self.成本',
                dependencies: ['价格', '成本'],
              },
              constraints: {
                enum: null,
              },
              _sid: 'ITJlXhj8OKBOjto9vc0lM',
              _id: 'profit',
              is_comparable: true,
              is_additive: true,
              ui: {},
              primal_type: 'number',
              stats: {},
            },
            {
              name: '子商品',
              isArray: true,
              type: 'object',
              ref: 'product',
              constraints: {
                enum: null,
              },
              _sid: 'j_dqzTyyBDUrj1NC-nnRy',
              _id: 'subproduct',
              is_comparable: false,
              ui: {},
              is_categorical: false,
              primal_type: 'object',
              stats: {},
              schema: {
                _id: 'product',
                name: '产品',
                syno: ['SKU', '商品', 'product'],
                type: 'entity',
                properties: [
                  {
                    name: '名称',
                    syno: ['name'],
                    type: 'name',
                    constraints: {
                      required: true,
                      enum: null,
                    },
                    _sid: 'rWhm_XqrLlR-f1jkwOnzo',
                    _id: 'name',
                    is_comparable: false,
                    is_name: true,
                    is_categorical: false,
                    ui: {},
                    primal_type: 'string',
                    auto_syno: true,
                    stats: {},
                  },
                  {
                    name: '编号',
                    type: 'ID',
                    constraints: {
                      unique: true,
                      required: true,
                      enum: null,
                    },
                    _sid: 'ShLwI9lLbFLDZfk7uScZz',
                    _id: 'id',
                    is_comparable: false,
                    ui: {},
                    primal_type: 'string',
                    is_name: true,
                    stats: {},
                    is_categorical: false,
                  },
                  {
                    name: '品类',
                    type: 'category',
                    syno: ['category', '类目'],
                    constraints: {
                      enum: ['男装', '女装', '童装'],
                    },
                    hierarchy: {
                      down: '子品类',
                    },
                    _sid: 'Dx981X8tSFT92O8Vqdk95',
                    _id: 'category',
                    is_comparable: false,
                    is_categorical: true,
                    is_name: false,
                    ui: {},
                    primal_type: 'string',
                    stats: {
                      distincts: ['男装', '女装', '童装'],
                    },
                  },
                  {
                    name: '子品类',
                    type: 'category',
                    syno: ['subcategory', '子类目'],
                    constraints: {
                      enum: null,
                    },
                    hierarchy: {
                      up: '品类',
                      down: '_id',
                    },
                    _sid: 'PeX8EODCFE40gMwvBGBMR',
                    _id: 'subcategory',
                    is_comparable: false,
                    is_categorical: true,
                    is_name: false,
                    ui: {},
                    primal_type: 'string',
                    stats: {
                      distincts: ['长袖', '牛仔裤', '连帽衫', '羊绒衫', '衬衫'],
                    },
                  },
                  {
                    name: '图片',
                    type: 'image',
                    constraints: {
                      enum: null,
                    },
                    _sid: 'f2Q_ZFy12xejmkiUGdZEW',
                    _id: 'picture',
                    is_comparable: false,
                    ui: {},
                    syno: ['picture'],
                    primal_type: 'image',
                    stats: {},
                  },
                  {
                    name: '价格',
                    type: 'currency',
                    config: 'CNY',
                    syno: ['price'],
                    constraints: {
                      enum: null,
                    },
                    _sid: 'RHCSg6s2XZWOtCGIZX9BO',
                    _id: 'price',
                    is_comparable: true,
                    is_additive: true,
                    ui: {},
                    primal_type: 'number',
                    stats: {},
                  },
                  {
                    name: '成本',
                    type: 'currency',
                    config: 'CNY',
                    constraints: {
                      enum: null,
                    },
                    _sid: 'cPF8t3SSCvLDanP4DDSpw',
                    _id: 'cost',
                    is_comparable: true,
                    is_additive: true,
                    ui: {},
                    syno: ['cost'],
                    primal_type: 'number',
                    stats: {},
                  },
                  {
                    name: '单件利润',
                    type: 'currency',
                    udf: {
                      function: 'async (self) => self.价格 - self.成本',
                      dependencies: ['价格', '成本'],
                    },
                    constraints: {
                      enum: null,
                    },
                    _sid: 'ITJlXhj8OKBOjto9vc0lM',
                    _id: 'profit',
                    is_comparable: true,
                    is_additive: true,
                    ui: {},
                    primal_type: 'number',
                    stats: {},
                  },
                  {
                    name: '子商品',
                    isArray: true,
                    type: 'object',
                    ref: 'product',
                    constraints: {
                      enum: null,
                    },
                    _sid: 'j_dqzTyyBDUrj1NC-nnRy',
                    _id: 'subproduct',
                    is_comparable: false,
                    ui: {},
                    is_categorical: false,
                    primal_type: 'object',
                    stats: {},
                  },
                  {
                    name: '分类',
                    type: 'category',
                    constraints: {
                      enum: ['单品', '组合'],
                    },
                    udf: {
                      sql: "if(length(`subproduct`) <= 0, '单品', '组合')",
                      dependencies: [],
                    },
                    _sid: 'R6-ntAmbE3T95Jr4VUrYl',
                    _id: 'type',
                    is_comparable: false,
                    is_name: false,
                    is_categorical: true,
                    is_dynamic: true,
                    ui: {},
                    primal_type: 'string',
                    stats: {
                      distincts: ['单品', '组合'],
                    },
                    syno: ['类型'],
                  },
                  {
                    name: '链接',
                    type: 'url',
                    constraints: {
                      enum: null,
                    },
                    _sid: 'tWyxQRuQ2NPAUd8LCK8kd',
                    _id: 'url',
                    is_comparable: false,
                    ui: {},
                    primal_type: 'string',
                    stats: {},
                  },
                ],
              },
            },
            {
              name: '分类',
              type: 'category',
              constraints: {
                enum: ['单品', '组合'],
              },
              udf: {
                sql: "if(length(`subproduct`) <= 0, '单品', '组合')",
                dependencies: [],
              },
              _sid: 'R6-ntAmbE3T95Jr4VUrYl',
              _id: 'type',
              is_comparable: false,
              is_name: false,
              is_categorical: true,
              is_dynamic: true,
              ui: {},
              primal_type: 'string',
              stats: {
                distincts: ['单品', '组合'],
              },
              syno: ['类型'],
            },
            {
              name: '链接',
              type: 'url',
              constraints: {
                enum: null,
              },
              _sid: 'tWyxQRuQ2NPAUd8LCK8kd',
              _id: 'url',
              is_comparable: false,
              ui: {},
              primal_type: 'string',
              stats: {},
            },
          ],
        },
        schemaID: 'sales',
      },
      {
        name: '店铺',
        type: 'object',
        ref: 'store',
        constraints: {
          enum: null,
        },
        _sid: 'O__jq9ypb87MKFIESw5rI',
        _id: 'store',
        is_comparable: false,
        ui: {},
        is_categorical: false,
        primal_type: 'object',
        stats: {},
        schema: {
          _id: 'store',
          name: '店铺',
          syno: ['门店', '店', 'store'],
          type: 'entity',
          description: '',
          properties: [
            {
              name: 'ID',
              type: 'ID',
              constraints: {
                unique: true,
                required: true,
                enum: null,
              },
              _sid: 'AsasG_y2TNUo3_puhGM_F',
              _id: 'id',
              is_comparable: false,
              ui: {},
              primal_type: 'string',
              stats: {},
              schemaID: 'store',
            },
            {
              name: '名称',
              syno: ['name'],
              type: 'name',
              constraints: {
                unique: true,
                required: true,
                enum: null,
              },
              _sid: 'Gbh4SaXW8L61P50dBtrPX',
              _id: 'name',
              is_comparable: false,
              is_name: true,
              is_categorical: false,
              ui: {},
              primal_type: 'string',
              stats: {},
              schemaID: 'store',
            },
            {
              name: '地理位置',
              type: 'object',
              ref: 'geo',
              constraints: {
                enum: null,
              },
              _sid: 'fnBApOk3BL6aqmmpCPXRR',
              _id: 'geo',
              is_comparable: false,
              is_categorical: false,
              syno: ['地址'],
              ui: {},
              primal_type: 'object',
              stats: {},
              schemaID: 'store',
              schema: {
                _id: 'geo',
                name: '地理位置',
                type: 'entity',
                completeSet: 'relative',
                syno: ['地区', '地域', '地理'],
                hierarchy: [
                  {
                    name: '国家',
                    syno: ['国', 'country'],
                    code_length: 3,
                  },
                  {
                    name: '区域',
                    syno: ['大区', 'region'],
                    code_length: 1,
                  },
                  {
                    name: '省市',
                    syno: ['省份', '省', 'province', 'prov'],
                    code_length: 2,
                  },
                  {
                    name: '城市',
                    syno: ['市', 'city', 'cities'],
                    code_length: 2,
                  },
                  {
                    name: '区县',
                    syno: ['区', '县', '旗', 'county'],
                    code_length: 2,
                  },
                ],
                properties: [
                  {
                    name: 'ID',
                    type: 'ID',
                    _id: 'id',
                    stats: {},
                    constraints: {
                      unique: true,
                      required: true,
                    },
                    _sid: '98Xj18SFgFGMeIE1kq8BR',
                    primal_type: 'string',
                    is_comparable: false,
                    schemaID: 'geo',
                  },
                  {
                    name: '名称',
                    type: 'name',
                    _id: 'name',
                    constraints: {
                      required: true,
                    },
                    stats: {},
                    _sid: 'rlRjwLEE-SM9rgYpEnkgi',
                    primal_type: 'string',
                    is_comparable: false,
                    is_name: true,
                    is_categorical: false,
                    schemaID: 'geo',
                  },
                  {
                    name: '等级',
                    syno: ['评级', 'Tier', '几线城市', '几线'],
                    type: 'category',
                    constraints: {
                      enum: [
                        ['一线', 'Tier1'],
                        ['新一线', 'Tier1.5'],
                        ['二线', 'Tier2'],
                        ['三线', 'Tier3'],
                        ['四线', 'Tier4'],
                        ['五线', 'Tier5'],
                      ],
                    },
                    _id: 'tier',
                    stats: {
                      distincts: [
                        '一线',
                        '新一线',
                        '二线',
                        '三线',
                        '四线',
                        '五线',
                      ],
                    },
                    _sid: 'f7PW1lF10Qi7eICo8IB7C',
                    primal_type: 'string',
                    is_comparable: false,
                    is_name: false,
                    is_categorical: true,
                    schemaID: 'geo',
                  },
                  {
                    name: '自治区',
                    type: 'boolean',
                    _id: 'auto_region',
                    stats: {
                      distincts: [true, false],
                    },
                    constraints: {
                      enum: [true, false],
                    },
                    _sid: 'Nkg3ZCbZVQfJ6q-rkKmMK',
                    primal_type: 'boolean',
                    is_comparable: false,
                    is_categorical: true,
                    is_name: false,
                    schemaID: 'geo',
                  },
                  {
                    _id: 'parents',
                    name: 'parents',
                    description: '保存整个链条。方便前端控件展示数据',
                    is_supplementary: true,
                    type: 'string',
                    isArray: true,
                    ui: {
                      delimiter: '/',
                    },
                    stats: {},
                    constraints: {},
                    _sid: 'C2Qq9CQOui70arx2O0O-q',
                    primal_type: 'string',
                    is_comparable: false,
                    is_name: false,
                    is_categorical: false,
                    schemaID: 'geo',
                  },
                ],
                modality: {
                  list: {
                    type: 'HierarchyList',
                  },
                },
              },
              fromSchema: 'store',
              from: 'sales',
            },
            {
              name: '开店日期',
              syno: ['开店时间'],
              type: 'birthday',
              constraints: {
                enum: null,
              },
              _sid: 'Tfz1yXLjRvpTLInCsGTcG',
              _id: 'opendate',
              is_comparable: true,
              ui: {},
              primal_type: 'date',
              stats: {},
              schemaID: 'store',
            },
            {
              name: '关店日期',
              syno: ['关店时间', '闭店日期', '闭店时间'],
              type: 'deathday',
              constraints: {
                enum: null,
              },
              _sid: 'Gj7XpUhVmY2CSm05o2Kkx',
              _id: 'closedate',
              is_comparable: true,
              ui: {},
              primal_type: 'date',
              stats: {},
              schemaID: 'store',
            },
          ],
        },
        schemaID: 'sales',
        fromSchema: 'sales',
      },
      {
        name: '销售量',
        syno: ['销量', 'quantity', 'qty', '数量', '做'],
        type: 'number',
        constraints: {
          enum: null,
        },
        _sid: 'RsDoxDPdYkcyC-Yq3udsY',
        _id: 'volumn',
        is_comparable: true,
        is_additive: true,
        ui: {},
        primal_type: 'number',
        stats: {},
        schemaID: 'sales',
      },
      {
        name: '销售额',
        syno: ['收入', '营业额', '金额', 'sales', '表现'],
        type: 'currency',
        constraints: {
          enum: null,
        },
        _sid: 'O_6KsMCKq7RYZJelcb1ht',
        _id: 'sales',
        is_comparable: true,
        is_additive: true,
        ui: {
          formatter: '0,0.0A',
        },
        impactFactors: [
          {
            schema: 'visit',
            operator: '流量',
          },
          {
            operator: '客单价',
          },
        ],
        primal_type: 'number',
        stats: {},
        schemaID: 'sales',
        from: 'sales',
      },
      {
        name: '原价',
        type: 'currency',
        constraints: {
          enum: null,
        },
        _sid: 'qmbhUXArqLNun0ap__cfh',
        _id: 'tag_sales',
        is_comparable: true,
        is_additive: true,
        ui: {},
        primal_type: 'number',
        stats: {},
        schemaID: 'sales',
      },
      {
        name: '活动',
        type: 'category',
        syno: ['campaign'],
        constraints: {
          enum: ['双十一', '双十二', '三八'],
        },
        _sid: 'KB9E6mSKs78V3m2_E07Vb',
        _id: 'campaigns',
        is_comparable: false,
        is_name: false,
        is_categorical: true,
        ui: {},
        primal_type: 'string',
        stats: {
          distincts: ['双十一', '双十二', '三八'],
        },
        schemaID: 'sales',
      },
      {
        name: '渠道',
        type: 'category',
        syno: ['channel'],
        constraints: {
          enum: ['天猫', '京东', '拼多多', '抖店', '其他'],
        },
        _sid: 'rFRhIp2HOu2dFaO72wHvn',
        _id: 'channel',
        is_comparable: false,
        is_name: false,
        is_categorical: true,
        ui: {},
        primal_type: 'string',
        stats: {
          distincts: ['天猫', '京东', '拼多多', '抖店', '其他'],
        },
        schemaID: 'sales',
      },
      {
        name: '来源',
        type: 'category',
        constraints: {
          enum: ['其他'],
        },
        _sid: '17XolKXgoNpWA-8QuDO8Y',
        _id: 'source',
        is_comparable: false,
        is_name: false,
        is_categorical: true,
        ui: {},
        primal_type: 'string',
        stats: {
          distincts: ['其他'],
        },
        schemaID: 'sales',
      },
    ],
  };

  const selectedItem = {
    _id: '156654',
    '店铺_地理位置(省市)': {
      _id: '156654',
      ID: '156654',
      名称: '西藏自治区',
      等级: null,
      自治区: true,
      parents: ['中国', '西南地区'],
    },
    总销售量: 27011,
  };

  let drilled = drilldownLogicform(logicform, schema, selectedItem);
  t.deepEqual(
    drilled,
    {
      query: {
        日期: {
          $gte: '2023-01-01 00:00:00',
          $lte: '2023-12-31 23:59:59',
          $options: {
            $offset: {
              year: 0,
            },
          },
        },
        店铺: {
          schema: 'store',
          query: {},
        },
        店铺_地理位置: {
          schema: 'geo',
          query: {
            ID: '156654',
          },
          entity_id: '156654',
        },
      },
      schema: 'sales',
      preds: [
        {
          pred: '销售额',
          operator: '$sum',
          name: '总销售额',
        },
      ],
      groupby: [
        {
          _id: '店铺_地理位置',
          level: '城市',
        },
      ],
      sort: {
        总销售额: -1,
      },
    },
    'drill down之后，要把冲突的query删掉'
  );

  // case2： 从地理位置应该下钻到店铺的
  drilled = drilldownLogicform(
    {
      query: {
        店铺: {
          schema: 'store',
          query: {
            地理位置: {
              schema: 'geo',
              query: {
                ID: '15676540',
              },
              entity_id: '15676540',
            },
          },
        },
      },
      preds: [
        {
          pred: '销售量',
          operator: '$sum',
          name: '总销售量',
        },
      ],
      schema: 'sales',
      groupby: [
        {
          _id: '店铺_地理位置',
          level: '区县',
          name: '店铺_地理位置(区县)',
        },
      ],
      sort: {
        总销售量: -1,
      },
    },
    schema,
    {
      _id: '1567654003',
      '店铺_地理位置(区县)': {
        _id: '1567654003',
        ID: '1567654003',
        名称: '奎屯市',
        等级: null,
        自治区: null,
        parents: ['中国', '西北地区', '新疆维吾尔自治区', '伊犁哈萨克自治州'],
      },
      总销售量: 384,
    }
  );

  t.deepEqual(
    drilled,
    {
      query: {
        店铺: {
          schema: 'store',
          query: {},
        },
        店铺_地理位置: {
          schema: 'geo',
          query: {
            ID: '1567654003',
          },
          entity_id: '1567654003',
        },
      },
      preds: [
        {
          pred: '销售量',
          operator: '$sum',
          name: '总销售量',
        },
      ],
      schema: 'sales',
      groupby: [
        {
          _id: '店铺',
        },
      ],
      sort: {
        总销售量: -1,
      },
    },
    'geo + chained'
  );

  // 产品子品类分布， 下钻
  drilled = drilldownLogicform(
    {
      "query": {},
      "schema": "product",
      "preds": [
          {
              "operator": "$count",
              "name": "产品数量"
          }
      ],
      "groupby": "子品类",
      "schemaName": "产品"
    },
    {
      "_id": "product",
      "name": "产品",
      "syno": [
        "SKU",
        "商品",
        "product"
      ],
      "type": "entity",
      "properties": [
        {
          "name": "名称",
          "syno": [
            "name"
          ],
          "type": "name",
          "constraints": {
            "required": true,
            "enum": null
          },
          "_sid": "rWhm_XqrLlR-f1jkwOnzo",
          "_id": "name",
          "is_comparable": false,
          "is_name": true,
          "is_categorical": false,
          "ui": {},
          "auto_syno": true
        },
        {
          "name": "编号",
          "type": "ID",
          "constraints": {
            "unique": true,
            "required": true,
            "enum": null
          },
          "_sid": "ShLwI9lLbFLDZfk7uScZz",
          "_id": "id",
          "is_comparable": false,
          "ui": {},
          "is_name": true,
          "is_categorical": false
        },
        {
          "name": "品类",
          "type": "category",
          "syno": [
            "category",
            "类目"
          ],
          "constraints": {
            "enum": [
              "男装",
              "女装",
              "童装"
            ]
          },
          "hierarchy": {
            "down": "子品类"
          },
          "_sid": "Dx981X8tSFT92O8Vqdk95",
          "_id": "category",
          "is_comparable": false,
          "is_categorical": true,
          "is_name": false,
          "ui": {}
        },
        {
          "name": "子品类",
          "type": "category",
          "syno": [
            "subcategory",
            "子类目"
          ],
          "constraints": {
            "enum": null
          },
          "hierarchy": {
            "up": "品类",
            "down": "_id"
          },
          "_sid": "PeX8EODCFE40gMwvBGBMR",
          "_id": "subcategory",
          "is_comparable": false,
          "is_categorical": true,
          "is_name": false,
          "ui": {}
        },
        {
          "name": "图片",
          "type": "image",
          "constraints": {
            "enum": null
          },
          "_sid": "f2Q_ZFy12xejmkiUGdZEW",
          "_id": "picture",
          "is_comparable": false,
          "ui": {},
          "syno": [
            "picture"
          ]
        },
        {
          "name": "价格",
          "type": "currency",
          "config": "CNY",
          "syno": [
            "price"
          ],
          "constraints": {
            "enum": null
          },
          "_sid": "RHCSg6s2XZWOtCGIZX9BO",
          "_id": "price",
          "is_comparable": true,
          "is_additive": true,
          "ui": {},
          "is_name": false
        },
        {
          "name": "成本",
          "type": "currency",
          "config": "CNY",
          "constraints": {
            "enum": null
          },
          "_sid": "cPF8t3SSCvLDanP4DDSpw",
          "_id": "cost",
          "is_comparable": true,
          "is_additive": true,
          "ui": {},
          "syno": [
            "cost"
          ],
          "is_name": false
        },
        {
          "name": "单件利润",
          "type": "currency",
          "udf": {
            "function": "async (self) => self.价格 - self.成本",
            "dependencies": [
              "价格",
              "成本"
            ]
          },
          "constraints": {
            "enum": null
          },
          "_sid": "ITJlXhj8OKBOjto9vc0lM",
          "_id": "profit",
          "is_comparable": true,
          "is_additive": true,
          "ui": {},
          "is_name": false
        },
        {
          "name": "子商品",
          "isArray": true,
          "type": "object",
          "ref": "product",
          "constraints": {
            "enum": null
          },
          "_sid": "j_dqzTyyBDUrj1NC-nnRy",
          "_id": "subproduct",
          "is_comparable": false,
          "ui": {},
          "is_categorical": false,
          "is_name": false
        },
        {
          "name": "分类",
          "type": "category",
          "constraints": {
            "enum": [
              "单品",
              "组合"
            ]
          },
          "udf": {
            "sql": "if(length(`subproduct`) <= 0, '单品', '组合')",
            "dependencies": []
          },
          "_sid": "R6-ntAmbE3T95Jr4VUrYl",
          "_id": "type",
          "is_comparable": false,
          "is_name": false,
          "is_categorical": true,
          "is_dynamic": true,
          "ui": {},
          "syno": [
            "类型"
          ]
        },
        {
          "name": "链接",
          "type": "url",
          "constraints": {
            "enum": null
          },
          "_sid": "tWyxQRuQ2NPAUd8LCK8kd",
          "_id": "url",
          "is_comparable": false,
          "ui": {}
        }
      ],
      "cache": {
        "cron": "*/2 * * * *"
      }
    },
    {_id: "羊绒衫", 子品类: "羊绒衫", 产品数量: 2},
  );
  t.deepEqual(drilled,    { query: { '子品类': '羊绒衫' }, schema: 'product' }, 'groupby to simple query');
});
