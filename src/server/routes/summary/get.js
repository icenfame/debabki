const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  const summary = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        income: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gt: ["$amount", 0],
                  },
                  {
                    $gte: ["$date", new Date(req.params.start)],
                  },
                  {
                    $lte: ["$date", new Date(req.params.end)],
                  },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
        outcome: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $lt: ["$amount", 0],
                  },
                  {
                    $gte: ["$date", new Date(req.params.start)],
                  },
                  {
                    $lte: ["$date", new Date(req.params.end)],
                  },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  res.json(summary[0]);
};
