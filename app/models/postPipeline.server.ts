export const postPipeline = ({ pageNumber = 1, limit = 4, isFeatured = false }:
  { pageNumber: number, limit: number, isFeatured?: boolean }) => {
  const limitPageIndex = (Number(pageNumber - 1)) * limit;
  const skip = limitPageIndex < 0 ? 0 : limitPageIndex;
  return [
    {
      '$match': {
        'isFeatured': isFeatured === false ? { $in: [null, false, true] } : isFeatured
      }
    }, {
      '$sort': {
        'createdAt': -1
      }
    }, {
      '$project': {
        'isFeatured': 0
      }
    }, {
      '$facet': {  //adding to new fields
        'total': [
          {
            '$count': 'count'
          }
        ],
        'posts': [
          {
            '$addFields': {
              '_id': '$_id'
            }
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$total'
      }
    }, {
      '$project': {
        'posts': {
          '$slice': [
            '$posts', skip, {
              '$ifNull': [
                limit, '$total.count'
              ]
            }
          ]
        },
        'page': {
          '$literal': skip / limit + 1
        },
        'hastNextPage': {
          '$lt': [
            {
              '$multiply': [
                limit, Number(pageNumber)
              ]
            }, '$total.count'
          ]
        },
        'hasPreviousPage': {
          '$cond': [
            {
              '$eq': [
                Number(pageNumber), 1
              ]
            }, false, {
              '$gt': [
                Number(pageNumber), Number(pageNumber) - 1
              ]
            }
          ]
        },
        'totalPages': {
          '$ceil': {
            '$divide': [
              '$total.count', limit
            ]
          }
        },
        'totalPosts': '$total.count'
      }
    }
  ]
}