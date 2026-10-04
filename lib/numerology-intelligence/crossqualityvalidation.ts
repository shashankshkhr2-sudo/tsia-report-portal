/**
 * Cross-quality resolver must never directly
 * determine Needed Number, remedy or Y3.
 */
function validateRemedyFirewall():
  CrossQualityValidationResult {
  const result =
    resolveCrossQualityPair(
      'INDIVIDUAL_AGENCY',
      'RELATIONAL_RECEPTIVITY',
      [
        supported(
          'FW_A',
          'INDIVIDUAL_AGENCY'
        ),

        underSupported(
          'FW_B',
          'RELATIONAL_RECEPTIVITY'
        ),
      ]
    )

  const firewallProtected =
    result
      .neededNumberDetermined ===
        false &&
    result
      .remedyDetermined ===
        false &&
    result
      .y3Determined ===
        false

  return passOrFail(
    'REMEDY_FIREWALL',
    'Cross-quality conclusion cannot determine Needed Number, remedy or Y3',
    'false / false / false',
    `${result.neededNumberDetermined} / ${result.remedyDetermined} / ${result.y3Determined}`,
    firewallProtected,
    'Cross-quality interpretation remains upstream of the separate Needed Number, remedy and Y3 decision gates.'
  )
}