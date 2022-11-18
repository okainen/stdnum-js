/**
 * Montenegrin JMBG
 * https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
 */

import * as jmbg from '../ba/jmbg'

const impl = {
  ...jmbg,
  name: 'Montenegrin Unique Master Citizen Number',
  localName: ' Јединствени матични број грађана',
  abbreviation: 'ЈМБГ',
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
