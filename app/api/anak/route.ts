import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../lib/cors';

// Validation schema for creating anak with all new fields
const createAnakSchema = z.object({
  // Basic anak info
  full_name: z.string().min(2).max(100),
  jenis_kelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).nullable().optional(),
  nick_name: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  birth_place: z.string().nullable().optional(),
  kewarganegaraan: z.string().nullable().optional(),
  agama: z.string().nullable().optional(),
  anak_ke: z.number().nullable().optional(),
  sekolah_kelas: z.string().nullable().optional(),
  status: z.enum(['AKTIF', 'CUTI', 'LULUS', 'BERHENTI']).default('AKTIF'),
  
  // Additional fields from frontend
  tanggal_pemeriksaan: z.string().nullable().optional(),
  mulai_terapi: z.string().nullable().optional(),
  selesai_terapi: z.string().nullable().optional(),
  mulai_cuti: z.string().nullable().optional(),
  
  // Survey Awal
  survey_awal: z.object({
    mengetahui_yamet_dari: z.string().nullable().optional(),
    penjelasan_mekanisme: z.boolean().nullable().optional(),
    bersedia_online: z.boolean().nullable().optional(),
    keluhan_orang_tua: z.array(z.string()).nullable().optional(),
    tindakan_orang_tua: z.array(z.string()).nullable().optional(),
    kendala: z.array(z.string()).nullable().optional(),
  }).nullable().optional(),
  
  // Orang Tua
  ayah: z.object({
    nama: z.string().nullable().optional(),
    tempat_lahir: z.string().nullable().optional(),
    tanggal_lahir: z.string().nullable().optional(),
    usia: z.number().nullable().optional(),
    agama: z.string().nullable().optional(),
    alamat_rumah: z.string().nullable().optional(),
    anak_ke: z.number().nullable().optional(),
    pernikahan_ke: z.number().nullable().optional(),
    usia_saat_menikah: z.number().nullable().optional(),
    pendidikan_terakhir: z.string().nullable().optional(),
    pekerjaan_saat_ini: z.string().nullable().optional(),
    telepon: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    tahun_meninggal: z.number().nullable().optional(),
    usia_saat_meninggal: z.number().nullable().optional(),
    kewarganegaraan: z.string().nullable().optional(),
  }).nullable().optional(),
  
  ibu: z.object({
    nama: z.string().nullable().optional(),
    tempat_lahir: z.string().nullable().optional(),
    tanggal_lahir: z.string().nullable().optional(),
    usia: z.number().nullable().optional(),
    agama: z.string().nullable().optional(),
    alamat_rumah: z.string().nullable().optional(),
    anak_ke: z.number().nullable().optional(),
    pernikahan_ke: z.number().nullable().optional(),
    usia_saat_menikah: z.number().nullable().optional(),
    pendidikan_terakhir: z.string().nullable().optional(),
    pekerjaan_saat_ini: z.string().nullable().optional(),
    telepon: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    tahun_meninggal: z.number().nullable().optional(),
    usia_saat_meninggal: z.number().nullable().optional(),
    kewarganegaraan: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Riwayat Kehamilan
  riwayat_kehamilan: z.object({
    usia_ibu_saat_hamil: z.number().nullable().optional(),
    usia_ayah_saat_hamil: z.number().nullable().optional(),
    mual_sulit_makan: z.boolean().nullable().optional(),
    asupan_gizi_memadai: z.boolean().nullable().optional(),
    perawatan_kehamilan: z.boolean().nullable().optional(),
    kehamilan_diinginkan: z.boolean().nullable().optional(),
    berat_bayi_semester_normal: z.boolean().nullable().optional(),
    diabetes: z.boolean().nullable().optional(),
    hipertensi: z.boolean().nullable().optional(),
    asma: z.boolean().nullable().optional(),
    tbc: z.boolean().nullable().optional(),
    merokok: z.boolean().nullable().optional(),
    sekitar_perokok_berat: z.boolean().nullable().optional(),
    konsumsi_alkohol: z.boolean().nullable().optional(),
    konsumsi_obat_obatan: z.boolean().nullable().optional(),
    infeksi_virus: z.boolean().nullable().optional(),
    kecelakaan_trauma: z.boolean().nullable().optional(),
    pendarahan_flek: z.boolean().nullable().optional(),
    masalah_pernafasan: z.boolean().nullable().optional(),
  }).nullable().optional(),
  
  // Riwayat Kelahiran - Updated enum values to match frontend
  riwayat_kelahiran: z.object({
    jenis_kelahiran: z.enum(['NORMAL', 'CAESAR', 'Normal']).nullable().optional(), // Added 'Normal' to match frontend
    alasan_sc: z.string().nullable().optional(),
    bantuan_kelahiran: z.array(z.string()).nullable().optional(),
    is_premature: z.boolean().nullable().optional(),
    usia_kelahiran_bulan: z.number().nullable().optional(),
    posisi_bayi_saat_lahir: z.enum(['KEPALA', 'KAKI', 'Normal']).nullable().optional(), // Added 'Normal' to match frontend
    is_sungsang: z.boolean().nullable().optional(),
    is_kuning: z.boolean().nullable().optional(),
    detak_jantung_anak: z.string().nullable().optional(),
    apgar_score: z.string().nullable().optional(),
    lama_persalinan: z.string().nullable().optional(),
    penolong_persalinan: z.enum(['DOKTER', 'BIDAN', 'DUKUN_BAYI', 'Dokter_Spesialis', 'Dokter Spesialis']).nullable().optional(), // Accept both formats
    tempat_bersalin: z.string().nullable().optional(),
    cerita_spesifik_kelahiran: z.string().nullable().optional(),
    berat_badan_bayi: z.number().nullable().optional(), // Berat Badan Bayi (kg)
    panjang_badan_bayi: z.number().nullable().optional(), // Panjang Badan Bayi (cm)
  }).nullable().optional(),
  
  // Riwayat Imunisasi
  riwayat_imunisasi: z.object({
    bgc: z.boolean().nullable().optional(),
    hep_b1: z.boolean().nullable().optional(),
    hep_b2: z.boolean().nullable().optional(),
    hep_b3: z.boolean().nullable().optional(),
    dpt_1: z.boolean().nullable().optional(),
    dpt_2: z.boolean().nullable().optional(),
    dpt_3: z.boolean().nullable().optional(),
    dpt_booster_1: z.boolean().nullable().optional(),
    polio_1: z.boolean().nullable().optional(),
    polio_2: z.boolean().nullable().optional(),
    polio_3: z.boolean().nullable().optional(),
    polio_4: z.boolean().nullable().optional(),
    polio_booster_1: z.boolean().nullable().optional(),
    campak_1: z.boolean().nullable().optional(),
    campak_2: z.boolean().nullable().optional(),
    hib_1: z.boolean().nullable().optional(),
    hib_2: z.boolean().nullable().optional(),
    hib_3: z.boolean().nullable().optional(),
    hib_4: z.boolean().nullable().optional(),
    mmr_1: z.boolean().nullable().optional(),
  }).nullable().optional(),
  
  // Riwayat Setelah Lahir
  riwayat_setelah_lahir: z.object({
    asi_sampai_usia_bulan: z.number().nullable().optional(),
    pernah_jatuh: z.boolean().nullable().optional(),
    jatuh_usia_bulan: z.number().nullable().optional(),
    jatuh_ketinggian_cm: z.number().nullable().optional(),
    pernah_sakit_parah: z.boolean().nullable().optional(),
    sakit_parah_usia_bulan: z.number().nullable().optional(),
    pernah_panas_tinggi: z.boolean().nullable().optional(),
    panas_tinggi_usia_bulan: z.number().nullable().optional(),
    disertai_kejang: z.boolean().nullable().optional(),
    frekuensi_durasi_kejang: z.string().nullable().optional(),
    pernah_kejang_tanpa_panas: z.boolean().nullable().optional(),
    kejang_tanpa_panas_usia_bulan: z.number().nullable().optional(),
    frekuensi_durasi_kejang_tanpa_panas: z.string().nullable().optional(),
    sakit_karena_virus: z.boolean().nullable().optional(),
    sakit_virus_usia_bulan: z.number().nullable().optional(),
    sakit_virus_jenis: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Perkembangan Anak
  perkembangan_anak: z.object({
    // Motorik Kasar
    tengkurap_ya: z.boolean().nullable().optional(),
    tengkurap_usia: z.string().nullable().optional(),
    berguling_ya: z.boolean().nullable().optional(),
    berguling_usia: z.string().nullable().optional(),
    duduk_ya: z.boolean().nullable().optional(),
    duduk_usia: z.string().nullable().optional(),
    merayap_ya: z.boolean().nullable().optional(),
    merayap_usia: z.string().nullable().optional(),
    merangkak_ya: z.boolean().nullable().optional(),
    merangkak_usia: z.string().nullable().optional(),
    jongkok_ya: z.boolean().nullable().optional(),
    jongkok_usia: z.string().nullable().optional(),
    transisi_berdiri_ya: z.boolean().nullable().optional(),
    transisi_berdiri_usia: z.string().nullable().optional(),
    berdiri_tanpa_pegangan_ya: z.boolean().nullable().optional(),
    berdiri_tanpa_pegangan_usia: z.string().nullable().optional(),
    berjalan_tanpa_pegangan_ya: z.boolean().nullable().optional(),
    berjalan_tanpa_pegangan_usia: z.string().nullable().optional(),
    berlari_ya: z.boolean().nullable().optional(),
    berlari_usia: z.string().nullable().optional(),
    melompat_ya: z.boolean().nullable().optional(),
    melompat_usia: z.string().nullable().optional(),
    
    // Bicara dan Bahasa
    reflek_vokalisasi_ya: z.boolean().nullable().optional(),
    reflek_vokalisasi_usia: z.string().nullable().optional(),
    bubbling_ya: z.boolean().nullable().optional(),
    bubbling_usia: z.string().nullable().optional(),
    lalling_ya: z.boolean().nullable().optional(),
    lalling_usia: z.string().nullable().optional(),
    echolalia_ya: z.boolean().nullable().optional(),
    echolalia_usia: z.string().nullable().optional(),
    true_speech_ya: z.boolean().nullable().optional(),
    true_speech_usia: z.string().nullable().optional(),
    mengucapkan_1_kata_ya: z.boolean().nullable().optional(),
    mengucapkan_1_kata_usia: z.string().nullable().optional(),
    ungkap_keinginan_2_kata_ya: z.boolean().nullable().optional(),
    ungkap_keinginan_2_kata_usia: z.string().nullable().optional(),
    bercerita_ya: z.boolean().nullable().optional(),
    bercerita_usia: z.string().nullable().optional(),
    
    // Emosi
    tertarik_lingkungan_luar_ya: z.boolean().nullable().optional(),
    tertarik_lingkungan_luar_usia: z.string().nullable().optional(),
    digendong_siapapun_ya: z.boolean().nullable().optional(),
    digendong_siapapun_usia: z.string().nullable().optional(),
    interaksi_timbal_balik_ya: z.boolean().nullable().optional(),
    interaksi_timbal_balik_usia: z.string().nullable().optional(),
    komunikasi_ekspresi_ibu_ya: z.boolean().nullable().optional(),
    komunikasi_ekspresi_ibu_usia: z.string().nullable().optional(),
    ekspresi_emosi_ya: z.boolean().nullable().optional(),
    ekspresi_emosi_usia: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Perilaku Oral Motor
  perilaku_oral_motor: z.object({
    mengeces: z.boolean().nullable().optional(),
    makan_makanan_keras: z.boolean().nullable().optional(),
    makan_makanan_berkuah: z.boolean().nullable().optional(),
    pilih_pilih_makanan: z.boolean().nullable().optional(),
    makan_di_emut: z.boolean().nullable().optional(),
    mengunyah_saat_makan: z.boolean().nullable().optional(),
    makan_langsung_telan: z.boolean().nullable().optional(),
  }).nullable().optional(),
  
  // Pola Makan
  pola_makan: z.object({
    pola_teratur: z.string().nullable().optional(),
    ada_pantangan_makanan: z.boolean().nullable().optional(),
    pantangan_makanan: z.string().nullable().optional(),
    keterangan_lainnya: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Perkembangan Sosial
  perkembangan_sosial: z.object({
    perilaku_bertemu_orang_baru: z.string().nullable().optional(),
    perilaku_bertemu_teman_sebaya: z.string().nullable().optional(),
    perilaku_bertemu_orang_lebih_muda: z.string().nullable().optional(), // field baru
    perilaku_bertemu_orang_lebih_tua: z.string().nullable().optional(),
    bermain_dengan_banyak_anak: z.string().nullable().optional(),
    keterangan_lainnya: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Pola Tidur
  pola_tidur: z.object({
    jam_tidur_teratur: z.boolean().nullable().optional(),
    sering_terbangun: z.boolean().nullable().optional(),
    jam_tidur_malam: z.string().nullable().optional(),
    jam_bangun_pagi: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Penyakit Diderita
  penyakit_diderita: z.object({
    sakit_telinga: z.boolean().nullable().optional(),
    sakit_telinga_usia_tahun: z.number().nullable().optional(),
    sakit_telinga_penjelasan: z.string().nullable().optional(),
    sakit_mata: z.boolean().nullable().optional(),
    sakit_mata_usia_tahun: z.number().nullable().optional(),
    sakit_mata_penjelasan: z.string().nullable().optional(),
    luka_kepala: z.boolean().nullable().optional(),
    luka_kepala_usia_tahun: z.number().nullable().optional(),
    penyakit_lainnya: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Hubungan Keluarga
  hubungan_keluarga: z.object({
    tinggal_dengan: z.array(z.string()).nullable().optional(),
    tinggal_dengan_lainnya: z.string().nullable().optional(),
    hubungan_ayah_ibu: z.string().nullable().optional(),
    hubungan_ayah_anak: z.string().nullable().optional(),
    hubungan_ibu_anak: z.string().nullable().optional(),
    hubungan_saudara_dengan_anak: z.string().nullable().optional(),
    hubungan_nenek_kakek_dengan_anak: z.string().nullable().optional(),
    hubungan_saudara_ortu_dengan_anak: z.string().nullable().optional(),
    hubungan_pengasuh_dengan_anak: z.string().nullable().optional(),
  }).nullable().optional(),
  
  // Riwayat Pendidikan
  riwayat_pendidikan: z.object({
    mulai_sekolah_formal_usia: z.string().nullable().optional(),
    mulai_sekolah_informal_usia: z.string().nullable().optional(),
    sekolah_formal_diikuti: z.string().nullable().optional(),
    sekolah_informal_diikuti: z.string().nullable().optional(),
    bimbingan_belajar: z.boolean().nullable().optional(),
    belajar_membaca_sendiri: z.boolean().nullable().optional(),
    belajar_dibacakan_ortu: z.boolean().nullable().optional(),
    nilai_rata_rata_sekolah: z.string().nullable().optional(),
    nilai_tertinggi_mapel: z.string().nullable().optional(),
    nilai_tertinggi_nilai: z.string().nullable().optional(),
    nilai_terendah_mapel: z.string().nullable().optional(),
    nilai_terendah_nilai: z.string().nullable().optional(),
    keluhan_guru: z.array(z.string()).nullable().optional(),
  }).nullable().optional(),
  
  // Pemeriksaan Sebelumnya
  pemeriksaan_sebelumnya: z.array(z.object({
    tempat: z.string().nullable().optional(),
    usia: z.string().nullable().optional(),
    diagnosa: z.string().nullable().optional(),
  })).nullable().optional(),
  
  // Terapi Sebelumnya
  terapi_sebelumnya: z.array(z.object({
    jenis_terapi: z.string().nullable().optional(),
    frekuensi: z.string().nullable().optional(),
    lama_terapi: z.string().nullable().optional(),
    tempat: z.string().nullable().optional(),
  })).nullable().optional(),
  
  // Lampiran
  lampiran: z.object({
    hasil_eeg_url: z.string().nullable().optional(),
    hasil_bera_url: z.string().nullable().optional(),
    hasil_ct_scan_url: z.string().nullable().optional(),
    program_terapi_3bln_url: z.string().nullable().optional(),
    hasil_psikologis_psikiatris_url: z.string().nullable().optional(),
    perjanjian: z.string().nullable().optional(),
    keterangan_tambahan: z.string().nullable().optional(),
  }).nullable().optional(),
});

// Generate nomor anak (YAMET-YYYY-XXXX)
function generateNomorAnak(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `YAMET-${year}-${randomNum}`;
}

// GET - Get all anak with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      deleted_at: null, // Only show non-deleted records
    };
    
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { nick_name: { contains: search, mode: 'insensitive' } },
        { nomor_anak: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate && endDate) {
      where.created_at = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    // Get total count
    const total = await prisma.anak.count({ where });
    
    // Get anak data with all relations
    const anak = await prisma.anak.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder.toLowerCase() as 'asc' | 'desc',
      },
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
          },
        },
        ayah: true,
        ibu: true,
        survey_awal: true,
        riwayat_kehamilan: true,
        riwayat_kelahiran: true,
        riwayat_imunisasi: true,
        riwayat_setelah_lahir: true,
        perkembangan_anak: true,
        perilaku_oral_motor: true,
        pola_makan: true,
        perkembangan_sosial: true,
        pola_tidur: true,
        penyakit_diderita: true,
        hubungan_keluarga: true,
        riwayat_pendidikan: true,
        pemeriksaan_sebelumnya: true,
        terapi_sebelumnya: true,
        lampiran: true,
      },
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return createCorsResponse({
      status: 'success',
      message: 'Data anak berhasil diambil',
      data: anak,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse(
        { status: 'error', message: 'Akses ditolak. Token tidak valid.' },
        401,
        request
      );
    }
    console.error('Get anak error:', error);
    return createCorsResponse(
      { status: 'error', message: 'Terjadi kesalahan server' },
      500,
      request
    );
  }
}

// POST - Create new anak with all related data
export async function POST(request: NextRequest) {
  try {
    // Step 1: Authentication check
    let user;
    try {
      user = requireAuth(request);
    } catch (authError) {
      console.error('Authentication error:', authError);
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Akses ditolak. Token tidak valid.',
          error_type: 'AUTHENTICATION_ERROR',
          details: authError instanceof Error ? authError.message : 'Unknown authentication error'
        },
        401,
        request
      );
    }

    // Step 2: Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Format JSON tidak valid',
          error_type: 'JSON_PARSE_ERROR',
          details: parseError instanceof Error ? parseError.message : 'Invalid JSON format'
        },
        400,
        request
      );
    }

    // Step 3: Validate input data
    let validatedData;
    try {
      validatedData = createAnakSchema.parse(body);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        return createCorsResponse(
          { 
            status: 'error', 
            message: 'Data tidak valid',
            error_type: 'VALIDATION_ERROR',
            details: errorDetails,
            total_errors: validationError.errors.length
          },
          400,
          request
        );
      }
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Validasi data gagal',
          error_type: 'VALIDATION_ERROR',
          details: validationError instanceof Error ? validationError.message : 'Unknown validation error'
        },
        400,
        request
      );
    }

    // Step 4: Generate nomor anak
    let nomorAnak;
    try {
      nomorAnak = generateNomorAnak();
    } catch (nomorError) {
      console.error('Nomor anak generation error:', nomorError);
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Gagal generate nomor anak',
          error_type: 'NOMOR_GENERATION_ERROR',
          details: nomorError instanceof Error ? nomorError.message : 'Failed to generate anak number'
        },
        500,
        request
      );
    }

    // Step 5: Prepare anak data
    let anakData;
    try {
      anakData = {
        nomor_anak: nomorAnak,
        full_name: validatedData.full_name,
        jenis_kelamin: validatedData.jenis_kelamin,
        nick_name: validatedData.nick_name,
        birth_date: validatedData.birth_date ? new Date(validatedData.birth_date) : null,
        birth_place: validatedData.birth_place,
        kewarganegaraan: validatedData.kewarganegaraan,
        agama: validatedData.agama,
        anak_ke: validatedData.anak_ke,
        sekolah_kelas: validatedData.sekolah_kelas,
        status: validatedData.status,
        tanggal_pemeriksaan: validatedData.tanggal_pemeriksaan ? new Date(validatedData.tanggal_pemeriksaan) : null,
        mulai_terapi: validatedData.mulai_terapi && validatedData.mulai_terapi !== "" ? new Date(validatedData.mulai_terapi) : null,
        selesai_terapi: validatedData.selesai_terapi && validatedData.selesai_terapi !== "" ? new Date(validatedData.selesai_terapi) : null,
        mulai_cuti: validatedData.mulai_cuti && validatedData.mulai_cuti !== "" ? new Date(validatedData.mulai_cuti) : null,
        created_by: user.id,
      };
    } catch (dataPrepError) {
      console.error('Data preparation error:', dataPrepError);
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Gagal menyiapkan data anak',
          error_type: 'DATA_PREPARATION_ERROR',
          details: dataPrepError instanceof Error ? dataPrepError.message : 'Failed to prepare anak data'
        },
        500,
        request
      );
    }

    // Step 6: Insert anak utama
    let anak;
    try {
      anak = await prisma.anak.create({
        data: anakData,
        include: {
          user_created: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (anakError) {
      console.error('Create anak error:', anakError);
      return createCorsResponse(
        { 
          status: 'error', 
          message: 'Gagal menyimpan data anak utama',
          error_type: 'CREATE_ANAK_ERROR',
          details: anakError instanceof Error ? anakError.message : 'Failed to create anak'
        },
        500,
        request
      );
    }

    // Step 7: Insert/Upsert relasi satu per satu (async, bukan transaction)
    const relasiSummary: { relasi: string; status: string; error?: string }[] = [];
    // Helper untuk try-catch per relasi
    async function tryRelasi(label: string, fn: () => Promise<void>) {
      try {
        await fn();
        relasiSummary.push({ relasi: label, status: 'success' });
      } catch (error) {
        relasiSummary.push({ relasi: label, status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    }

    // Survey Awal
    if (validatedData.survey_awal) {
      await tryRelasi('survey_awal', async () => {
        const surveyAwalData = {
          ...validatedData.survey_awal,
          keluhan_orang_tua: validatedData.survey_awal?.keluhan_orang_tua ?? [],
          tindakan_orang_tua: validatedData.survey_awal?.tindakan_orang_tua ?? [],
          kendala: validatedData.survey_awal?.kendala ?? [],
        };
        await prisma.surveyAwal.upsert({
          where: { anak_id: anak.id },
          update: surveyAwalData,
          create: { anak_id: anak.id, ...surveyAwalData },
        });
      });
    }
    // Ayah
    if (validatedData.ayah) {
      await tryRelasi('ayah', async () => {
        const ayahData = {
          ...validatedData.ayah,
          tanggal_lahir: validatedData.ayah?.tanggal_lahir ? new Date(validatedData.ayah.tanggal_lahir) : null,
          tahun_meninggal: validatedData.ayah?.tahun_meninggal && validatedData.ayah.tahun_meninggal > 0 ? validatedData.ayah.tahun_meninggal : null,
          usia_saat_meninggal: validatedData.ayah?.usia_saat_meninggal && validatedData.ayah.usia_saat_meninggal > 0 ? validatedData.ayah.usia_saat_meninggal : null,
          kewarganegaraan: validatedData.ayah?.kewarganegaraan,
        };
        await prisma.orangTua.upsert({
          where: { anak_id_ayah: anak.id },
          update: ayahData,
          create: { anak_id_ayah: anak.id, ...ayahData },
        });
      });
    }
    // Ibu
    if (validatedData.ibu) {
      await tryRelasi('ibu', async () => {
        const ibuData = {
          ...validatedData.ibu,
          tanggal_lahir: validatedData.ibu?.tanggal_lahir ? new Date(validatedData.ibu.tanggal_lahir) : null,
          tahun_meninggal: validatedData.ibu?.tahun_meninggal && validatedData.ibu.tahun_meninggal > 0 ? validatedData.ibu.tahun_meninggal : null,
          usia_saat_meninggal: validatedData.ibu?.usia_saat_meninggal && validatedData.ibu.usia_saat_meninggal > 0 ? validatedData.ibu.usia_saat_meninggal : null,
          kewarganegaraan: validatedData.ibu?.kewarganegaraan,
        };
        await prisma.orangTua.upsert({
          where: { anak_id_ibu: anak.id },
          update: ibuData,
          create: { anak_id_ibu: anak.id, ...ibuData },
        });
      });
    }
    // Riwayat Kehamilan
    if (validatedData.riwayat_kehamilan) {
      await tryRelasi('riwayat_kehamilan', async () => {
        await prisma.riwayatKehamilan.upsert({
          where: { anak_id: anak.id },
          update: validatedData.riwayat_kehamilan ?? {},
          create: { anak_id: anak.id, ...(validatedData.riwayat_kehamilan ?? {}) },
        });
      });
    }
    // Riwayat Kelahiran
    if (validatedData.riwayat_kelahiran) {
      await tryRelasi('riwayat_kelahiran', async () => {
        const riwayatKelahiranData = {
          ...validatedData.riwayat_kelahiran ?? {},
          penolong_persalinan: validatedData.riwayat_kelahiran?.penolong_persalinan?.replace(' ', '_') as any,
          bantuan_kelahiran: validatedData.riwayat_kelahiran?.bantuan_kelahiran ?? [],
          berat_badan_bayi: validatedData.riwayat_kelahiran?.berat_badan_bayi ?? null,
          panjang_badan_bayi: validatedData.riwayat_kelahiran?.panjang_badan_bayi ?? null,
        };
        await prisma.riwayatKelahiran.upsert({
          where: { anak_id: anak.id },
          update: riwayatKelahiranData,
          create: { anak_id: anak.id, ...riwayatKelahiranData },
        });
      });
    }
    // Riwayat Imunisasi
    if (validatedData.riwayat_imunisasi) {
      await tryRelasi('riwayat_imunisasi', async () => {
        await prisma.riwayatImunisasi.upsert({
          where: { anak_id: anak.id },
          update: validatedData.riwayat_imunisasi ?? {},
          create: { anak_id: anak.id, ...(validatedData.riwayat_imunisasi ?? {}) },
        });
      });
    }
    // Riwayat Setelah Lahir
    if (validatedData.riwayat_setelah_lahir) {
      await tryRelasi('riwayat_setelah_lahir', async () => {
        await prisma.riwayatSetelahLahir.upsert({
          where: { anak_id: anak.id },
          update: validatedData.riwayat_setelah_lahir ?? {},
          create: { anak_id: anak.id, ...(validatedData.riwayat_setelah_lahir ?? {}) },
        });
      });
    }
    // Perkembangan Anak
    if (validatedData.perkembangan_anak) {
      await tryRelasi('perkembangan_anak', async () => {
        await prisma.perkembanganAnak.upsert({
          where: { anak_id: anak.id },
          update: validatedData.perkembangan_anak ?? {},
          create: { anak_id: anak.id, ...(validatedData.perkembangan_anak ?? {}) },
        });
      });
    }
    // Perilaku Oral Motor
    if (validatedData.perilaku_oral_motor) {
      await tryRelasi('perilaku_oral_motor', async () => {
        await prisma.perilakuOralMotor.upsert({
          where: { anak_id: anak.id },
          update: validatedData.perilaku_oral_motor ?? {},
          create: { anak_id: anak.id, ...(validatedData.perilaku_oral_motor ?? {}) },
        });
      });
    }
    // Pola Makan
    if (validatedData.pola_makan) {
      await tryRelasi('pola_makan', async () => {
        await prisma.polaMakan.upsert({
          where: { anak_id: anak.id },
          update: validatedData.pola_makan ?? {},
          create: { anak_id: anak.id, ...(validatedData.pola_makan ?? {}) },
        });
      });
    }
    // Perkembangan Sosial
    if (validatedData.perkembangan_sosial) {
      await tryRelasi('perkembangan_sosial', async () => {
        await prisma.perkembanganSosial.upsert({
          where: { anak_id: anak.id },
          update: validatedData.perkembangan_sosial ?? {},
          create: { anak_id: anak.id, ...(validatedData.perkembangan_sosial ?? {}) },
        });
      });
    }
    // Pola Tidur
    if (validatedData.pola_tidur) {
      await tryRelasi('pola_tidur', async () => {
        await prisma.polaTidur.upsert({
          where: { anak_id: anak.id },
          update: validatedData.pola_tidur ?? {},
          create: { anak_id: anak.id, ...(validatedData.pola_tidur ?? {}) },
        });
      });
    }
    // Penyakit Diderita
    if (validatedData.penyakit_diderita) {
      await tryRelasi('penyakit_diderita', async () => {
        await prisma.penyakitDiderita.upsert({
          where: { anak_id: anak.id },
          update: validatedData.penyakit_diderita ?? {},
          create: { anak_id: anak.id, ...(validatedData.penyakit_diderita ?? {}) },
        });
      });
    }
    // Hubungan Keluarga
    if (validatedData.hubungan_keluarga) {
      const hubunganKeluarga = validatedData.hubungan_keluarga ?? {};
      await tryRelasi('hubungan_keluarga', async () => {
        const hubunganKeluargaData = {
          ...hubunganKeluarga,
          tinggal_dengan: hubunganKeluarga.tinggal_dengan ?? [],
        };
        await prisma.hubunganKeluarga.upsert({
          where: { anak_id: anak.id },
          update: hubunganKeluargaData,
          create: { anak_id: anak.id, ...hubunganKeluargaData },
        });
      });
    }
    // Riwayat Pendidikan
    if (validatedData.riwayat_pendidikan) {
      const riwayatPendidikan = validatedData.riwayat_pendidikan ?? {};
      await tryRelasi('riwayat_pendidikan', async () => {
        const riwayatPendidikanData = {
          ...riwayatPendidikan,
          keluhan_guru: riwayatPendidikan.keluhan_guru ?? [],
        };
        await prisma.riwayatPendidikan.upsert({
          where: { anak_id: anak.id },
          update: riwayatPendidikanData,
          create: { anak_id: anak.id, ...riwayatPendidikanData },
        });
      });
    }
    // Pemeriksaan Sebelumnya (array)
    if (validatedData.pemeriksaan_sebelumnya !== undefined && validatedData.pemeriksaan_sebelumnya !== null) {
      await tryRelasi('pemeriksaan_sebelumnya', async () => {
        await prisma.pemeriksaanSebelumnya.deleteMany({ where: { anak_id: anak.id } });
        if (validatedData.pemeriksaan_sebelumnya && validatedData.pemeriksaan_sebelumnya.length > 0) {
          await prisma.pemeriksaanSebelumnya.createMany({
            data: validatedData.pemeriksaan_sebelumnya.map(item => ({ anak_id: anak.id, ...item })),
          });
        }
      });
    }
    // Terapi Sebelumnya (array)
    if (validatedData.terapi_sebelumnya !== undefined && validatedData.terapi_sebelumnya !== null) {
      await tryRelasi('terapi_sebelumnya', async () => {
        await prisma.terapiSebelumnya.deleteMany({ where: { anak_id: anak.id } });
        if (validatedData.terapi_sebelumnya && validatedData.terapi_sebelumnya.length > 0) {
          await prisma.terapiSebelumnya.createMany({
            data: validatedData.terapi_sebelumnya.map(item => ({ anak_id: anak.id, ...item })),
          });
        }
      });
    }
    // Lampiran
    if (validatedData.lampiran) {
      const lampiranData = validatedData.lampiran ?? {};
      await tryRelasi('lampiran', async () => {
        await prisma.lampiran.upsert({
          where: { anak_id: anak.id },
          update: {
            ...lampiranData,
            perjanjian: lampiranData.perjanjian ?? null,
          },
          create: { anak_id: anak.id, ...lampiranData, perjanjian: lampiranData.perjanjian ?? null },
        });
      });
    }

    // Assessment Default - Otomatis buat assessment awal
    await tryRelasi('assessment_default', async () => {
      const assessmentDate = validatedData.tanggal_pemeriksaan ? 
        new Date(validatedData.tanggal_pemeriksaan) : 
        new Date();
      
      await prisma.penilaianAnak.create({
        data: {
          anak_id: anak.id,
          assessment_date: assessmentDate,
          assessment_type: 'Assessment Awal',
          assessment_result: 'Menunggu Penilaian',
          notes: `Assessment otomatis dibuat saat pendaftaran anak ${anak.full_name}`,
          created_by: user.id,
        },
      });
    });

    // Program Terapi Default - Otomatis buat program terapi awal
    await tryRelasi('program_terapi_default', async () => {
      const programStartDate = validatedData.tanggal_pemeriksaan ? 
        new Date(validatedData.tanggal_pemeriksaan) : 
        new Date();
      
      // Buat program terapi default berdasarkan nama anak
      const defaultProgramName = `Program Terapi - ${anak.full_name}`;
      
      await prisma.programTerapi.create({
        data: {
          anak_id: anak.id,
          program_name: defaultProgramName,
          description: `Program terapi otomatis dibuat saat pendaftaran anak ${anak.full_name}`,
          start_date: programStartDate,
          end_date: new Date(programStartDate.getTime() + (90 * 24 * 60 * 60 * 1000)), // 90 hari dari start
          status: 'AKTIF',
          created_by: user.id,
        },
      });
    });

    // Step 8: Return anak with all relations (fetch again)
    let anakWithRelations = null;
    try {
      anakWithRelations = await prisma.anak.findUnique({
        where: { id: anak.id },
        include: {
          user_created: {
            select: {
              id: true,
              name: true,
            },
          },
          ayah: true,
          ibu: true,
          survey_awal: true,
          riwayat_kehamilan: true,
          riwayat_kelahiran: true,
          riwayat_imunisasi: true,
          riwayat_setelah_lahir: true,
          perkembangan_anak: true,
          perilaku_oral_motor: true,
          pola_makan: true,
          perkembangan_sosial: true,
          pola_tidur: true,
          penyakit_diderita: true,
          hubungan_keluarga: true,
          riwayat_pendidikan: true,
          pemeriksaan_sebelumnya: true,
          terapi_sebelumnya: true,
          lampiran: true,
          penilaian: {
            orderBy: {
              assessment_date: 'desc',
            },
            take: 5,
          },
        },
      });
    } catch (fetchError) {
      // Tetap kembalikan summary relasi meski fetch gagal
      return createCorsResponse({
        status: 'partial_success',
        message: 'Data anak utama berhasil dibuat, namun gagal mengambil data lengkap.',
        anak_id: anak.id,
        relasi_summary: relasiSummary,
        error: fetchError instanceof Error ? fetchError.message : fetchError,
      }, 201, request);
    }

    return createCorsResponse({
      status: 'success',
      message: 'Data anak berhasil dibuat (asynchronous, non-transaction)',
      data: { anak: anakWithRelations },
      relasi_summary: relasiSummary,
      created_at: new Date().toISOString()
    }, 201, request);
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in POST /api/anak:', error);
    let errorType = 'UNEXPECTED_ERROR';
    let errorDetails = 'An unexpected error occurred';
    let statusCode = 500;
    if (error instanceof Error) {
      errorDetails = error.message;
    }
    return createCorsResponse(
      {
        status: 'error',
        message: 'Terjadi kesalahan server',
        error_type: errorType,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      statusCode,
      request
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return createCorsOptionsResponse(request);
} 