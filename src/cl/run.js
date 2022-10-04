import * as rut from './rut'

const impl = {
  ...rut,
  name: 'Chilean National Identification Number',
  localName: 'Rol Único Nacional ',
  abbreviation: 'RUN',
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
