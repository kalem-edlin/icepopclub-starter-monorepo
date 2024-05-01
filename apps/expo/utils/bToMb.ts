/**
 * Converts bytes to megabytes.
 * @param bytes The number of bytes.
 * @returns The equivalent number of megabytes.
 */
export default function bytesToMegabytes(bytes: number): number {
	return bytes / 1048576 // 1 MB = 1048576 bytes
}
