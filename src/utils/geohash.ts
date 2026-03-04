// Geohash Utility Functions for DukandaR
// Geohash is a geocoding system that encodes geographic coordinates into a short string
// It enables efficient spatial queries and proximity searches in databases

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Encode GPS coordinates to geohash string
 * @param lat Latitude (-90 to 90)
 * @param lng Longitude (-180 to 180)
 * @param precision Length of geohash (default 6, ~1.2km accuracy)
 * @returns Geohash string
 */
export function encodeGeohash(
  lat: number,
  lng: number,
  precision: number = 6
): string {
  let geohash = '';
  let even = true;
  let latMin = -90;
  let latMax = 90;
  let lngMin = -180;
  let lngMax = 180;
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (even) {
      // Longitude
      const mid = (lngMin + lngMax) / 2;
      if (lng > mid) {
        ch |= 1 << (4 - bit);
        lngMin = mid;
      } else {
        lngMax = mid;
      }
    } else {
      // Latitude
      const mid = (latMin + latMax) / 2;
      if (lat > mid) {
        ch |= 1 << (4 - bit);
        latMin = mid;
      } else {
        latMax = mid;
      }
    }

    even = !even;
    bit++;

    if (bit === 5) {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geohash;
}

/**
 * Decode geohash string back to coordinates
 * @param geohash Geohash string
 * @returns Object with lat and lng
 */
export function decodeGeohash(geohash: string): { lat: number; lng: number } {
  let even = true;
  let latMin = -90;
  let latMax = 90;
  let lngMin = -180;
  let lngMax = 180;

  for (let i = 0; i < geohash.length; i++) {
    const chr = geohash[i];
    const idx = BASE32.indexOf(chr);

    if (idx === -1) {
      throw new Error(`Invalid geohash character: ${chr}`);
    }

    for (let bit = 4; bit >= 0; bit--) {
      const mask = 1 << bit;

      if (even) {
        // Longitude
        const mid = (lngMin + lngMax) / 2;
        if (idx & mask) {
          lngMin = mid;
        } else {
          lngMax = mid;
        }
      } else {
        // Latitude
        const mid = (latMin + latMax) / 2;
        if (idx & mask) {
          latMin = mid;
        } else {
          latMax = mid;
        }
      }

      even = !even;
    }
  }

  return {
    lat: (latMin + latMax) / 2,
    lng: (lngMin + lngMax) / 2,
  };
}

/**
 * Get 8 neighboring geohash cells
 * @param geohash Center geohash
 * @returns Array of 8 neighbor geohashes
 */
export function getNeighbors(geohash: string): string[] {
  const neighbors: string[] = [];
  const { lat, lng } = decodeGeohash(geohash);
  const precision = geohash.length;

  // Calculate approximate width of geohash cell
  const latErr = 180 / Math.pow(2, Math.ceil((precision * 5) / 2));
  const lngErr = 360 / Math.pow(2, Math.floor((precision * 5) / 2));

  // Generate 8 neighbors (N, NE, E, SE, S, SW, W, NW)
  const offsets = [
    [latErr, 0], // N
    [latErr, lngErr], // NE
    [0, lngErr], // E
    [-latErr, lngErr], // SE
    [-latErr, 0], // S
    [-latErr, -lngErr], // SW
    [0, -lngErr], // W
    [latErr, -lngErr], // NW
  ];

  for (const [latOffset, lngOffset] of offsets) {
    const neighborLat = lat + latOffset;
    const neighborLng = lng + lngOffset;
    // Wrap around if out of bounds
    const wrappedLng =
      neighborLng > 180 ? neighborLng - 360 : neighborLng < -180 ? neighborLng + 360 : neighborLng;
    const clampedLat = Math.max(-90, Math.min(90, neighborLat));
    neighbors.push(encodeGeohash(clampedLat, wrappedLng, precision));
  }

  return neighbors;
}

/**
 * Get appropriate geohash precision for a given radius
 * @param radiusKm Radius in kilometers
 * @returns Geohash precision (length)
 */
export function geohashPrecisionForRadius(radiusKm: number): number {
  // Precision levels and their approximate coverage:
  // 4: ~20km
  // 5: ~5km
  // 6: ~1.2km
  // 7: ~150m
  // 8: ~40m
  if (radiusKm >= 10) return 4;
  if (radiusKm >= 5) return 5;
  if (radiusKm >= 1) return 6;
  if (radiusKm >= 0.2) return 7;
  return 8;
}

/**
 * Get array of geohash prefixes that cover a radius from center point
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Array of geohash strings covering the area
 */
export function getGeohashesForRadius(
  lat: number,
  lng: number,
  radiusKm: number
): string[] {
  const precision = geohashPrecisionForRadius(radiusKm);
  const centerHash = encodeGeohash(lat, lng, precision);
  const neighbors = getNeighbors(centerHash);

  // Return center + all neighbors
  return [centerHash, ...neighbors];
}
