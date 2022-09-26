import * as rc from '../cz/rc'

const impl = {
  ...rc,
  name: 'Slovak Birth Number',
  localName: 'Rodné číslo',
  abbreviation: 'RC',
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
