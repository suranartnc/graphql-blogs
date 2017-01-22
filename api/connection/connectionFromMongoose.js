import { isNil } from 'lodash'
import { base64, unbase64 } from 'api/utils/base64'

export function validateConnectionArgs ({ first, after, last, before }) {
  const MAX_LIMIT = 100

  if (
    (isNil(first) || first <= 0) &&
    (isNil(last) || last <= 0)
  ) {
    return new Error('You must provide a `first` or `last` value to properly paginate the connection.')
  }

  if (first > 0 && last > 0) {
    return new Error('Passing both `first` and `last` values to paginate the connection is not supported.')
  }

  if (first > MAX_LIMIT) {
    return new Error(`Requesting ${first} records on the connection exceeds the \`first\` limit of ${MAX_LIMIT} records.`)
  }

  if (last > MAX_LIMIT) {
    return new Error(`Requesting ${last} records on the connection exceeds the \`last\` limit of ${MAX_LIMIT} records.`)
  }

  return null
}

export function mapDirectionEnumToValue (direction) {
  if (direction === 'DESC') {
    return -1
  }

  return 1
}

export function itemToCursor (item, orderByField) {
  return item[orderByField] ? base64(`${orderByField}-${item[orderByField]}`) : null
}

export function generateEdges (items, orderByField) {
  return items.map(item => ({
    cursor: itemToCursor(item, orderByField),
    node: item
  }))
}

export function generatePageInfo (edges) {
  return {
    endCursor: edges[0] ? edges[0].cursor : null,
    hasNextPage: true,
    hasPreviousPage: true,
    startCursor: edges[edges.length - 1] ? edges[edges.length - 1].cursor : null
  }
}

export default async function connectionFromMongoose (mongooseQuery, args) {
  const error = validateConnectionArgs(args)

  const {
    first,
    after,
    last,
    before,
    orderBy = {
      field: '_id',
      direction: 'DESC'
    }
  } = args

  if (error) {
    throw error
  }

  const limit = first || last

  const items = await mongooseQuery
    .limit(limit)
    .sort({ [orderBy.field]: mapDirectionEnumToValue(orderBy.direction) })

  const edges = generateEdges(items, orderBy.field)

  const pageInfo = generatePageInfo(edges)

  return {
    edges,
    pageInfo
  }
}
