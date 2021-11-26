const test = require('tape');
const moment = require('moment');
const APIService = require('../lib/index');

const { getLogicformByTimeOffset, getMinTimeGranularity } = APIService;

test('getLogicformByTimeOffset', async function (t) {
  let newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        time: {
          $offset: {
            year: -1,
            month: 0,
          },
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );

  t.deepEqual(newLF.query.time, {
    $offset: { year: -1, month: -1 },
  });

  newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        time: {
          $gte: '2021-02-01 00:00:00',
          $lte: '2021-02-28 00:00:00',
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );

  t.deepEqual(moment(newLF.query.time.$gte).format('YYYYMMDD'), '20210101');
  t.deepEqual(
    moment(newLF.query.time.$lte).format('YYYYMMDD'),
    '20210128',
    '牵涉到MTD'
  );

  // MTD
  newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        time: {
          $gte: {
            $offset: { month: 0 },
          },
          $lte: {
            $offset: { day: 0 },
          },
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );

  t.deepEqual(
    moment(newLF.query.time.$gte).format('YYYYMMDD'),
    moment().add(-1, 'month').startOf('month').format('YYYYMMDD'),
    'MTD'
  );
  t.deepEqual(
    moment(newLF.query.time.$lte).format('YYYYMMDD'),
    moment().add(-1, 'month').endOf('day').format('YYYYMMDD'),
    'MTD'
  );

  // do not forget other query
  newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        cate: 'a',
        time: {
          $gte: {
            $offset: { month: 0 },
          },
          $lte: {
            $offset: { day: 0 },
          },
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );
  t.equal(newLF.query.cate, 'a', 'do not forget other query');

  // year do not have last month
  newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        time: {
          $gte: {
            $offset: { year: 0 },
          },
          $lte: {
            $offset: { day: 0 },
          },
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );
  t.equal(newLF, null, 'year do not have last month');

  newLF = getLogicformByTimeOffset(
    {
      schema: 'a',
      query: {
        time: {
          year: 2021,
        },
      },
    },
    {
      time: {
        $offset: {
          month: -1,
        },
      },
    }
  );
  t.equal(newLF, null, 'year do not have last month');

  t.equal(
    getMinTimeGranularity({
      day: 1,
    }),
    'day',
    'getMinTimeGranularity - relative form'
  );

  t.equal(
    getMinTimeGranularity({
      $gte: '2021-02-01 00:00:00',
      $lte: '2021-02-28 23:59:59',
    }),
    'month',
    'getMinTimeGranularity - normal form'
  );
});
