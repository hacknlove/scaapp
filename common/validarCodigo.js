import { Random } from 'meteor/random'

export function generarCodigo () {
  const codigo = [Random.id(4), Random.id(4), Random.id(4), Random.id(4)]

  return `${codigo.join('-')}-${(codigo.reduce((a, b) => a + parseInt(b, 36), 21) % 36).toString(36)}`
}

export function validarCodigo (codigo) {
  if (codigo.match(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]$/i) === null) {
    return
  }
  if ((codigo.split('-', 4).reduce((a, b) => a + parseInt(b, 36), 21) % 36).toString(36) !== codigo.substr(-1)) {
    return
  }
  return true
}
