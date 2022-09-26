/**
 *
 * The CLABE (Clave Bancaria Estandarizada)
 *
 * Spanish for "standardized banking cipher" or "standardized bank code") is a banking standard for the numbering of
 * bank accounts in Mexico. This standard is a requirement for the sending and receiving of domestic inter-bank
 * electronic funds transfer since June 1, 2004.
 *
 * Sources:
 *   http://m.sat.gob.mx/contabilidadelectronica/Paginas/documentos/bancos_nacionales.pdf
 *
 * BANK
 */

import * as exceptions from '../exceptions'
import { strings, weightedSum } from '../util'
import { banksMap, cities } from './banks'

function clean(input) {
  return strings.cleanUnicode(input, '- ')
}

const impl = {
  name: 'Mexican Standardized Bank Code',
  localName: 'Clave Bancaria Estandarizada',
  abbreviation: 'CLABE',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value.toLocaleUpperCase()
  },

  format(input) {
    const [value] = clean(input)

    return value
  },

  /**
   * Check if the number is a valid CLABE.
   * This checks the length, formatting and other contraints. It does not check
   * for control letter.
   */
  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 18) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    const [bankCode, cityCode, account, checksum] = strings.splitAt(value, 3, 6, 17)

    if (banksMap[parseInt(bankCode, 10)] === undefined) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }
    if (cities[parseInt(cityCode, 10)] === undefined) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }
    if (!strings.isdigits(account)) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    const sum =
      (10 -
        weightedSum(value.substr(0, 17), {
          weights: [3, 7, 1],
          modulus: 10,
        })) %
      10

    if (checksum !== String(sum)) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: false,
      isCompany: false,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
