import * as bech32 from 'bech32';

/**
 * Converts a Bech32 address (e.g. init1...) to its Hex equivalent for EVM-1 interactions.
 */
export function bech32ToHex(address: string): string | null {
  if (!address) return null;
  if (address.startsWith('0x')) return address;

  try {
    const { words } = bech32.decode(address);
    const data = bech32.fromWords(words);
    
    // Manual Uint8Array to Hex conversion to avoid Buffer in browser
    const hex = Array.from(new Uint8Array(data))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
    return `0x${hex}`;
  } catch (e) {
    console.error('Failed to convert bech32 to hex:', e);
    return null;
  }
}
