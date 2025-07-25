/**
 * Library untuk normalisasi data keluhan dan sumber informasi
 * Menyederhanakan data yang berbeda-beda namun memiliki makna yang sama
 */

export interface NormalizedData {
  original: string;
  normalized: string;
  count: number;
}

export interface KeluhanMapping {
  [key: string]: string;
}

export interface SumberMapping {
  [key: string]: string;
}

// Mapping untuk normalisasi keluhan
const KELUHAN_MAPPING: KeluhanMapping = {
  // Sulit bicara / Terlambat bicara
  'sulit bicara': 'terlambat bicara',
  'terlambat bicara': 'terlambat bicara',
  'belum bisa bicara': 'terlambat bicara',
  'belum lancar bicara': 'terlambat bicara',
  'speech delay': 'terlambat bicara',
  'keterlambatan bicara': 'terlambat bicara',
  'belum bisa ngomong': 'terlambat bicara',
  'belum bisa berbicara': 'terlambat bicara',
  
  // Sulit fokus / Kurang fokus
  'sulit fokus': 'kurang fokus',
  'kurang fokus': 'kurang fokus',
  'tidak fokus': 'kurang fokus',
  'attention deficit': 'kurang fokus',
  'konsentrasi rendah': 'kurang fokus',
  'tidak bisa fokus': 'kurang fokus',
  'belum bisa fokus': 'kurang fokus',
  
  // Hyperaktif
  'hyperaktif': 'hyperaktif',
  'hiperaktif': 'hyperaktif',
  'sangat aktif': 'hyperaktif',
  'tidak bisa diam': 'hyperaktif',
  'over aktif': 'hyperaktif',
  'terlalu aktif': 'hyperaktif',
  
  // Tantrum
  'sering tantrum': 'sering tantrum',
  'tantrum': 'sering tantrum',
  'mudah marah': 'sering tantrum',
  'emosi tidak stabil': 'sering tantrum',
  'sering ngamuk': 'sering tantrum',
  'mudah emosi': 'sering tantrum',
  
  // Autisme
  'autis': 'autisme',
  'autisme': 'autisme',
  'spektrum autisme': 'autisme',
  'asd': 'autisme',
  
  // Down Syndrome
  'down syndrome': 'down syndrome',
  'down': 'down syndrome',
  'sindrom down': 'down syndrome',
  
  // Cerebral Palsy
  'cerebral palsy': 'cerebral palsy',
  'cp': 'cerebral palsy',
  
  // Gangguan motorik
  'gangguan motorik': 'gangguan motorik',
  'motorik kasar': 'gangguan motorik',
  'motorik halus': 'gangguan motorik',
  'keterlambatan motorik': 'gangguan motorik',
  
  // Gangguan sensorik
  'gangguan sensorik': 'gangguan sensorik',
  'sensory processing': 'gangguan sensorik',
  'hipersensitif': 'gangguan sensorik',
  'hiposensitif': 'gangguan sensorik',
  
  // Gangguan tidur
  'gangguan tidur': 'gangguan tidur',
  'sulit tidur': 'gangguan tidur',
  'insomnia': 'gangguan tidur',
  'tidur tidak teratur': 'gangguan tidur',
  
  // Gangguan makan
  'gangguan makan': 'gangguan makan',
  'picky eater': 'gangguan makan',
  'sulit makan': 'gangguan makan',
  'selective eating': 'gangguan makan',
  
  // Gangguan sosial
  'gangguan sosial': 'gangguan sosial',
  'sulit bergaul': 'gangguan sosial',
  'tidak mau bermain': 'gangguan sosial',
  'isolasi sosial': 'gangguan sosial',
  
  // Gangguan belajar
  'gangguan belajar': 'gangguan belajar',
  'learning disability': 'gangguan belajar',
  'sulit belajar': 'gangguan belajar',
  'keterlambatan akademik': 'gangguan belajar',
  
  // Gangguan perilaku
  'gangguan perilaku': 'gangguan perilaku',
  'behavioral disorder': 'gangguan perilaku',
  'perilaku tidak sesuai': 'gangguan perilaku',
  
  // Gangguan emosi
  'gangguan emosi': 'gangguan emosi',
  'mood swing': 'gangguan emosi',
  
  // Gangguan komunikasi
  'gangguan komunikasi': 'gangguan komunikasi',
  'sulit berkomunikasi': 'gangguan komunikasi',
  'komunikasi terbatas': 'gangguan komunikasi',
  
  // Gangguan kognitif
  'gangguan kognitif': 'gangguan kognitif',
  'keterlambatan kognitif': 'gangguan kognitif',
  'iq rendah': 'gangguan kognitif',
  
  // Gangguan fisik
  'gangguan fisik': 'gangguan fisik',
  'cacat fisik': 'gangguan fisik',
  'disabilitas fisik': 'gangguan fisik',
  
  // Gangguan pendengaran
  'gangguan pendengaran': 'gangguan pendengaran',
  'tuli': 'gangguan pendengaran',
  'hearing loss': 'gangguan pendengaran',
  
  // Gangguan penglihatan
  'gangguan penglihatan': 'gangguan penglihatan',
  'buta': 'gangguan penglihatan',
  'visual impairment': 'gangguan penglihatan',
  
  // Gangguan perkembangan umum
  'gangguan perkembangan': 'gangguan perkembangan',
  'developmental delay': 'gangguan perkembangan',
  'keterlambatan perkembangan': 'gangguan perkembangan',
  'global delay': 'gangguan perkembangan'
};

// Mapping untuk normalisasi sumber informasi
const SUMBER_MAPPING: SumberMapping = {
  // Internet / Google
  'internet': 'internet',
  'google': 'internet',
  'googling': 'internet',
  'browsing': 'internet',
  'web': 'internet',
  'online': 'internet',
  'search engine': 'internet',
  
  // Social Media
  'social media': 'social media',
  'sosmed': 'social media',
  'instagram': 'social media',
  'ig': 'social media',
  'facebook': 'social media',
  'fb': 'social media',
  'twitter': 'social media',
  'tiktok': 'social media',
  'youtube': 'social media',
  'sosial media': 'social media',
  
  // Teman / Rekomendasi
  'teman': 'rekomendasi teman',
  'teman sekolah': 'rekomendasi teman',
  'teman-teman': 'rekomendasi teman',
  'rekomendasi teman': 'rekomendasi teman',
  'sahabat': 'rekomendasi teman',
  'kawan': 'rekomendasi teman',
  
  // Keluarga
  'saudara': 'rekomendasi keluarga',
  'kakak': 'rekomendasi keluarga',
  'adik': 'rekomendasi keluarga',
  'orang tua': 'rekomendasi keluarga',
  'ibu': 'rekomendasi keluarga',
  'ayah': 'rekomendasi keluarga',
  'nenek': 'rekomendasi keluarga',
  'kakek': 'rekomendasi keluarga',
  'keluarga': 'rekomendasi keluarga',
  
  // Tetangga
  'tetangga': 'rekomendasi tetangga',
  'neighbor': 'rekomendasi tetangga',
  
  // Dokter / Tenaga Medis
  'dokter': 'rekomendasi medis',
  'rekomendasi dokter': 'rekomendasi medis',
  'rekomendasi dokter anak': 'rekomendasi medis',
  'dokter anak': 'rekomendasi medis',
  'pediatrician': 'rekomendasi medis',
  'psikolog': 'rekomendasi medis',
  'psikiater': 'rekomendasi medis',
  'terapis': 'rekomendasi medis',
  'fisioterapis': 'rekomendasi medis',
  'okupasi terapis': 'rekomendasi medis',
  'speech therapist': 'rekomendasi medis',
  
  // Rumah Sakit / Klinik
  'rumah sakit': 'rumah sakit/klinik',
  'rs': 'rumah sakit/klinik',
  'klinik': 'rumah sakit/klinik',
  'tempat terapi': 'rumah sakit/klinik',
  'tempat terapi rumah sakit': 'rumah sakit/klinik',
  'hospital': 'rumah sakit/klinik',
  'medical center': 'rumah sakit/klinik',
  
  // Sekolah
  'sekolah': 'sekolah',
  'guru': 'sekolah',
  'teacher': 'sekolah',
  'institution': 'sekolah',
  'lembaga pendidikan': 'sekolah',
  
  // Google Maps
  'google maps': 'google maps',
  'maps': 'google maps',
  'lokasi': 'google maps',
  'location': 'google maps',
  
  // Orang Tua Siswa
  'orang tua siswa': 'orang tua siswa',
  'parent': 'orang tua siswa',
  'wali murid': 'orang tua siswa',
  
  // Anak Ke-2 di YAMET
  'anak ke 2 diyamet': 'anak ke-2 di yamet',
  'anak kedua di yamet': 'anak ke-2 di yamet',
  'anak kedua yamet': 'anak ke-2 di yamet',
  'anak ke 2 di yamet': 'anak ke-2 di yamet',
  
  // Kombinasi
  'teman dan sosmed': 'kombinasi',
  'teman/instagram': 'kombinasi',
  'sosmed/ig yamet': 'kombinasi',
  'instagram/sekolah': 'kombinasi',
  'teman dan internet': 'kombinasi',
  'sosmed dan teman': 'kombinasi',
  
  // Lainnya
  'lainnya': 'lainnya',
  'other': 'lainnya',
  'tidak tahu': 'lainnya',
  'tidak ingat': 'lainnya',
  'lupa': 'lainnya'
};

/**
 * Normalisasi data keluhan
 * @param keluhanData Array of objects dengan properti 'keluhan' dan 'count'
 * @returns Array of NormalizedData
 */
export function normalizeKeluhan(keluhanData: Array<{keluhan: string, count: number}>): NormalizedData[] {
  const normalizedMap = new Map<string, NormalizedData>();
  
  keluhanData.forEach(item => {
    const originalKeluhan = item.keluhan.toLowerCase().trim();
    const normalizedKeluhan = KELUHAN_MAPPING[originalKeluhan] || originalKeluhan;
    
    if (normalizedMap.has(normalizedKeluhan)) {
      const existing = normalizedMap.get(normalizedKeluhan)!;
      existing.count += item.count;
      // Gabungkan original values untuk tracking
      if (!existing.original.includes(item.keluhan)) {
        existing.original += `, ${item.keluhan}`;
      }
    } else {
      normalizedMap.set(normalizedKeluhan, {
        original: item.keluhan,
        normalized: normalizedKeluhan,
        count: item.count
      });
    }
  });
  
  // Convert to array and sort by count (descending)
  return Array.from(normalizedMap.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * Normalisasi data sumber informasi
 * @param sumberData Array of objects dengan properti 'sumber' dan 'count'
 * @returns Array of NormalizedData
 */
export function normalizeSumber(sumberData: Array<{sumber: string, count: number}>): NormalizedData[] {
  const normalizedMap = new Map<string, NormalizedData>();
  
  sumberData.forEach(item => {
    const originalSumber = item.sumber.toLowerCase().trim();
    const normalizedSumber = SUMBER_MAPPING[originalSumber] || originalSumber;
    
    if (normalizedMap.has(normalizedSumber)) {
      const existing = normalizedMap.get(normalizedSumber)!;
      existing.count += item.count;
      // Gabungkan original values untuk tracking
      if (!existing.original.includes(item.sumber)) {
        existing.original += `, ${item.sumber}`;
      }
    } else {
      normalizedMap.set(normalizedSumber, {
        original: item.sumber,
        normalized: normalizedSumber,
        count: item.count
      });
    }
  });
  
  // Convert to array and sort by count (descending)
  return Array.from(normalizedMap.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * Format data untuk display
 * @param normalizedData Array of NormalizedData
 * @param maxItems Jumlah maksimal item yang ditampilkan
 * @returns Formatted string
 */
export function formatNormalizedData(normalizedData: NormalizedData[], maxItems: number = 5): string {
  const topItems = normalizedData.slice(0, maxItems);
  
  return topItems.map(item => 
    `${item.normalized}\n${item.count} kasus`
  ).join('\n\n');
}

/**
 * Tambahkan mapping baru untuk keluhan
 * @param original Original text
 * @param normalized Normalized text
 */
export function addKeluhanMapping(original: string, normalized: string): void {
  KELUHAN_MAPPING[original.toLowerCase().trim()] = normalized.toLowerCase().trim();
}

/**
 * Tambahkan mapping baru untuk sumber
 * @param original Original text
 * @param normalized Normalized text
 */
export function addSumberMapping(original: string, normalized: string): void {
  SUMBER_MAPPING[original.toLowerCase().trim()] = normalized.toLowerCase().trim();
}

/**
 * Get all available mappings
 */
export function getMappings() {
  return {
    keluhan: KELUHAN_MAPPING,
    sumber: SUMBER_MAPPING
  };
} 