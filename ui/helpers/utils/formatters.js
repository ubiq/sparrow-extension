// TODO: Rename to reflect that this function is used for more cases than ETH, and update all uses.
export function formatETHFee(ethFee, currencySymbol = 'UBQ') {
  return `${ethFee} ${currencySymbol}`;
}
