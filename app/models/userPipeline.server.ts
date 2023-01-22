export const userPipeLine = ({
  pageNumber,
  limit,
}: {
  pageNumber: number;
  limit: number;
}) => {
  const limitPageIndex = Number(pageNumber - 1) * limit;
  const skip = limitPageIndex < 0 ? 0 : limitPageIndex;
  return [
    {
      $facet: {
        total: [
          {
            $count: "count",
          },
        ],
        users: [
          {
            $addFields: {
              username: "$username"
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$total",
      },
    },
    {
      $project: {
        users: {
          $slice: [
            "$users",
            skip,
            {
              $ifNull: [limit, "$total.count"],
            },
          ],
        },
        page: {
          $literal: skip / limit + 1,
        },
        hasNextPage: {
          $lt: [
            {
              $multiply: [limit, Number(pageNumber)], //
            },
            "$total.count",
          ],
        },
        hasPreviousPage: {
          //https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/cond/
          $cond: [
            {
              $eq: [Number(pageNumber), 1], // if this is true
            },
            false, //returns false
            {
              $gt: [Number(pageNumber), Number(pageNumber) - 1], //else return the result it $gt
            },
          ],
        },
        totalPages: {
          $ceil: {
            $divide: ["$total.count", limit],
          },
        },
        totalUsers: "$total.count",
      },
    },
    {
      $project: {
        "users.password": 0,
      },
    },
  ];
};
