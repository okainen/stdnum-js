/**
 * Slovene JMBG
 * https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
 */

import * as jmbg from '../ba/jmbg'

const impl = {
  ...jmbg,
  name: 'Slovene Unique Master Citizen Number',
  localName: 'Enotna Matična Številka Občana',
  abbreviation: 'EMŠO',
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
export default impl
