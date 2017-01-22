export function base64 (input) {
  return new Buffer(input, 'utf8').toString('base64')
}

export function unbase64 (input) {
  return new Buffer(input, 'base64').toString('utf8')
}
