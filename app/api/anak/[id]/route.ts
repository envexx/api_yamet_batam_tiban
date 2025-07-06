export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import { createCorsResponse, createCorsOptionsResponse } from '../../../lib/cors';

// Validation schema for updating anak with all related data
const updateAnakSchema = z.object({
  // Basic anak info
  nomor_anak: z.string().optional(),
  full_name: z.string().min(2).max(100).optional(),
  jenis_kelamin: z.enum(['LAKI_LAKI', 'PEREMPUAN']).nullable().optional(),
  nick_name: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  birth_place: z.string().nullable().optional(),
  kewarganegaraan: z.string().nullable().optional(),
  agama: z.string().nullable().optional(),
  anak_ke: z.number().nullable().optional(),
  sekolah_kelas: z.string().nullable().optional(),
  status: z.enum(['AKTIF', 'CUTI', 'LULUS', 'BERHENTI']).optional(),
  tanggal_pemeriksaan: z.string().nullable().optional(),
  mulai_terapi: z.string().nullable().optional(),
  selesai_terapi: z.string().nullable().optional(),
  mulai_cuti: z.string().nullable().optional(),
  
  // Survey Awal
  survey_awal: z.object({
    mengetahui_yamet_dari: z.string().nullable().optional(),
    penjelasan_mekanisme: z.boolean().nullable().optional(),
    bersedia_online: z.boolean().nullable().optional(),
    keluhan_orang_tua: z.array(z.string()).optional(),
    tindakan_orang_tua: z.array(z.string()).optional(),
    kendala: z.array(z.string()).optional(),
  }).optional(),
  
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
  }).optional(),
  
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
  }).optional(),
  
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
  }).optional(),
  
  // Riwayat Kelahiran
  riwayat_kelahiran: z.object({
    jenis_kelahiran: z.enum(['NORMAL', 'CAESAR']).nullable().optional(),
    alasan_sc: z.string().nullable().optional(),
    bantuan_kelahiran: z.array(z.string()).optional(),
    is_premature: z.boolean().nullable().optional(),
    usia_kelahiran_bulan: z.number().nullable().optional(),
    posisi_bayi_saat_lahir: z.enum(['KEPALA', 'KAKI']).nullable().optional(),
    is_sungsang: z.boolean().nullable().optional(),
    is_kuning: z.boolean().nullable().optional(),
    detak_jantung_anak: z.string().nullable().optional(),
    apgar_score: z.string().nullable().optional(),
    lama_persalinan: z.string().nullable().optional(),
    penolong_persalinan: z.enum(['DOKTER', 'BIDAN', 'DUKUN_BAYI']).nullable().optional(),
    tempat_bersalin: z.string().nullable().optional(),
    cerita_spesifik_kelahiran: z.string().nullable().optional(),
  }).optional(),
  
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
  }).optional(),
  
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
    sakit_karena_virus: z.boolean().nullable().optional(),
    sakit_virus_usia_bulan: z.number().nullable().optional(),
    sakit_virus_jenis: z.string().nullable().optional(),
  }).optional(),
  
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
  }).optional(),
  
  // Perilaku Oral Motor
  perilaku_oral_motor: z.object({
    mengeces: z.boolean().nullable().optional(),
    makan_makanan_keras: z.boolean().nullable().optional(),
    makan_makanan_berkuah: z.boolean().nullable().optional(),
    pilih_pilih_makanan: z.boolean().nullable().optional(),
    makan_di_emut: z.boolean().nullable().optional(),
    mengunyah_saat_makan: z.boolean().nullable().optional(),
    makan_langsung_telan: z.boolean().nullable().optional(),
  }).optional(),
  
  // Pola Makan
  pola_makan: z.object({
    pola_teratur: z.string().nullable().optional(),
    ada_pantangan_makanan: z.boolean().nullable().optional(),
    pantangan_makanan: z.string().nullable().optional(),
    keterangan_lainnya: z.string().nullable().optional(),
  }).optional(),
  
  // Perkembangan Sosial
  perkembangan_sosial: z.object({
    perilaku_bertemu_orang_baru: z.string().nullable().optional(),
    perilaku_bertemu_teman_sebaya: z.string().nullable().optional(),
    perilaku_bertemu_orang_lebih_tua: z.string().nullable().optional(),
    bermain_dengan_banyak_anak: z.string().nullable().optional(),
    keterangan_lainnya: z.string().nullable().optional(),
  }).optional(),
  
  // Pola Tidur
  pola_tidur: z.object({
    jam_tidur_teratur: z.boolean().nullable().optional(),
    sering_terbangun: z.boolean().nullable().optional(),
    jam_tidur_malam: z.string().nullable().optional(),
    jam_bangun_pagi: z.string().nullable().optional(),
  }).optional(),
  
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
  }).optional(),
  
  // Hubungan Keluarga
  hubungan_keluarga: z.object({
    tinggal_dengan: z.array(z.string()).optional(),
    tinggal_dengan_lainnya: z.string().nullable().optional(),
    hubungan_ayah_ibu: z.string().nullable().optional(),
    hubungan_ayah_anak: z.string().nullable().optional(),
    hubungan_ibu_anak: z.string().nullable().optional(),
    hubungan_saudara_dengan_anak: z.string().nullable().optional(),
    hubungan_nenek_kakek_dengan_anak: z.string().nullable().optional(),
    hubungan_saudara_ortu_dengan_anak: z.string().nullable().optional(),
    hubungan_pengasuh_dengan_anak: z.string().nullable().optional(),
  }).optional(),
  
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
    keluhan_guru: z.array(z.string()).optional(),
  }).optional(),
  
  // Pemeriksaan Sebelumnya
  pemeriksaan_sebelumnya: z.array(z.object({
    tempat: z.string().nullable().optional(),
    usia: z.string().nullable().optional(),
    diagnosa: z.string().nullable().optional(),
  })).optional(),
  
  // Terapi Sebelumnya
  terapi_sebelumnya: z.array(z.object({
    jenis_terapi: z.string().nullable().optional(),
    frekuensi: z.string().nullable().optional(),
    lama_terapi: z.string().nullable().optional(),
    tempat: z.string().nullable().optional(),
  })).optional(),
  
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

// GET - Get anak by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anakId = parseInt(id);
    if (isNaN(anakId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }
    const anak = await prisma.anak.findFirst({
      where: {
        id: anakId,
        deleted_at: null,
      },
      include: {
        user_created: {
          select: {
            id: true,
            name: true,
          },
        },
        user_updated: {
          select: {
            id: true,
            name: true,
          },
        },
        survey_awal: true,
        ayah: true,
        ibu: true,
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
        program_terapi: {
          orderBy: {
            created_at: 'desc',
          },
          take: 5,
        },
      },
    });
    if (!anak) {
      return createCorsResponse({ status: 'error', message: 'Data anak tidak ditemukan' }, 404, request);
    }
    return createCorsResponse({
      status: 'success',
      message: 'Data anak berhasil diambil',
      data: { anak },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Get anak by ID error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// PUT - Update anak
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anakId = parseInt(id);
    const body = await request.json();
    
    if (isNaN(anakId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }
    
    // Validate input
    const validatedData = updateAnakSchema.parse(body);
    
    // Check if anak exists
    const existingAnak = await prisma.anak.findFirst({
      where: {
        id: anakId,
        deleted_at: null,
      },
    });
    
    if (!existingAnak) {
      return createCorsResponse({ status: 'error', message: 'Data anak tidak ditemukan' }, 404, request);
    }
    
    // Prepare anak update data
    const anakUpdateData: any = {
      updated_by: user.id,
      updated_at: new Date(),
    };
    
    // Add basic fields if provided
    if (validatedData.nomor_anak !== undefined) anakUpdateData.nomor_anak = validatedData.nomor_anak;
    if (validatedData.full_name !== undefined) anakUpdateData.full_name = validatedData.full_name;
    if (validatedData.jenis_kelamin !== undefined) anakUpdateData.jenis_kelamin = validatedData.jenis_kelamin;
    if (validatedData.nick_name !== undefined) anakUpdateData.nick_name = validatedData.nick_name;
    if (validatedData.birth_place !== undefined) anakUpdateData.birth_place = validatedData.birth_place;
    if (validatedData.kewarganegaraan !== undefined) anakUpdateData.kewarganegaraan = validatedData.kewarganegaraan;
    if (validatedData.agama !== undefined) anakUpdateData.agama = validatedData.agama;
    if (validatedData.anak_ke !== undefined) anakUpdateData.anak_ke = validatedData.anak_ke;
    if (validatedData.sekolah_kelas !== undefined) anakUpdateData.sekolah_kelas = validatedData.sekolah_kelas;
    if (validatedData.status !== undefined) anakUpdateData.status = validatedData.status;
    
    // Convert date strings to Date objects
    if (validatedData.birth_date) {
      anakUpdateData.birth_date = new Date(validatedData.birth_date);
    }
    if (validatedData.tanggal_pemeriksaan) {
      anakUpdateData.tanggal_pemeriksaan = new Date(validatedData.tanggal_pemeriksaan);
    }
    if (validatedData.mulai_terapi) {
      anakUpdateData.mulai_terapi = new Date(validatedData.mulai_terapi);
    }
    if (validatedData.selesai_terapi) {
      anakUpdateData.selesai_terapi = new Date(validatedData.selesai_terapi);
    }
    if (validatedData.mulai_cuti) {
      anakUpdateData.mulai_cuti = new Date(validatedData.mulai_cuti);
    }
    
    // Logika status cuti/berhenti
    if (validatedData.status === 'CUTI') {
      // Jika mulai_cuti null, isi dengan hari ini
      if (!existingAnak.mulai_cuti && !validatedData.mulai_cuti) {
        anakUpdateData.mulai_cuti = new Date();
      }
      // Jika sudah lebih dari 3 bulan dari mulai_cuti, ubah status ke BERHENTI
      const cutiDate = validatedData.mulai_cuti ? new Date(validatedData.mulai_cuti) : existingAnak.mulai_cuti ? new Date(existingAnak.mulai_cuti) : null;
      if (cutiDate) {
        const now = new Date();
        const diffMonth = (now.getFullYear() - cutiDate.getFullYear()) * 12 + (now.getMonth() - cutiDate.getMonth());
        if (diffMonth >= 3) {
          anakUpdateData.status = 'BERHENTI';
        }
      }
    }
    
    // Update anak and all related data using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update main anak record
      const anak = await tx.anak.update({
        where: { id: anakId },
        data: anakUpdateData,
      });
      let relasiDiupdate = false;
      
      // Update or create related data
      if (validatedData.survey_awal) {
        await tx.surveyAwal.upsert({
          where: { anak_id: anakId },
          update: validatedData.survey_awal,
          create: {
            anak_id: anakId,
            ...validatedData.survey_awal,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.ayah) {
        const ayahData = {
          ...validatedData.ayah,
          tanggal_lahir: validatedData.ayah.tanggal_lahir ? new Date(validatedData.ayah.tanggal_lahir) : null,
        };
        await tx.orangTua.upsert({
          where: { anak_id_ayah: anakId },
          update: ayahData,
          create: {
            anak_id_ayah: anakId,
            ...ayahData,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.ibu) {
        const ibuData = {
          ...validatedData.ibu,
          tanggal_lahir: validatedData.ibu.tanggal_lahir ? new Date(validatedData.ibu.tanggal_lahir) : null,
        };
        await tx.orangTua.upsert({
          where: { anak_id_ibu: anakId },
          update: ibuData,
          create: {
            anak_id_ibu: anakId,
            ...ibuData,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.riwayat_kehamilan) {
        await tx.riwayatKehamilan.upsert({
          where: { anak_id: anakId },
          update: validatedData.riwayat_kehamilan,
          create: {
            anak_id: anakId,
            ...validatedData.riwayat_kehamilan,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.riwayat_kelahiran) {
        await tx.riwayatKelahiran.upsert({
          where: { anak_id: anakId },
          update: validatedData.riwayat_kelahiran,
          create: {
            anak_id: anakId,
            ...validatedData.riwayat_kelahiran,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.riwayat_imunisasi) {
        await tx.riwayatImunisasi.upsert({
          where: { anak_id: anakId },
          update: validatedData.riwayat_imunisasi,
          create: {
            anak_id: anakId,
            ...validatedData.riwayat_imunisasi,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.riwayat_setelah_lahir) {
        await tx.riwayatSetelahLahir.upsert({
          where: { anak_id: anakId },
          update: validatedData.riwayat_setelah_lahir,
          create: {
            anak_id: anakId,
            ...validatedData.riwayat_setelah_lahir,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.perkembangan_anak) {
        await tx.perkembanganAnak.upsert({
          where: { anak_id: anakId },
          update: validatedData.perkembangan_anak,
          create: {
            anak_id: anakId,
            ...validatedData.perkembangan_anak,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.perilaku_oral_motor) {
        await tx.perilakuOralMotor.upsert({
          where: { anak_id: anakId },
          update: validatedData.perilaku_oral_motor,
          create: {
            anak_id: anakId,
            ...validatedData.perilaku_oral_motor,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.pola_makan) {
        await tx.polaMakan.upsert({
          where: { anak_id: anakId },
          update: validatedData.pola_makan,
          create: {
            anak_id: anakId,
            ...validatedData.pola_makan,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.perkembangan_sosial) {
        await tx.perkembanganSosial.upsert({
          where: { anak_id: anakId },
          update: validatedData.perkembangan_sosial,
          create: {
            anak_id: anakId,
            ...validatedData.perkembangan_sosial,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.pola_tidur) {
        await tx.polaTidur.upsert({
          where: { anak_id: anakId },
          update: validatedData.pola_tidur,
          create: {
            anak_id: anakId,
            ...validatedData.pola_tidur,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.penyakit_diderita) {
        await tx.penyakitDiderita.upsert({
          where: { anak_id: anakId },
          update: validatedData.penyakit_diderita,
          create: {
            anak_id: anakId,
            ...validatedData.penyakit_diderita,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.hubungan_keluarga) {
        await tx.hubunganKeluarga.upsert({
          where: { anak_id: anakId },
          update: validatedData.hubungan_keluarga,
          create: {
            anak_id: anakId,
            ...validatedData.hubungan_keluarga,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.riwayat_pendidikan) {
        await tx.riwayatPendidikan.upsert({
          where: { anak_id: anakId },
          update: validatedData.riwayat_pendidikan,
          create: {
            anak_id: anakId,
            ...validatedData.riwayat_pendidikan,
          },
        });
        relasiDiupdate = true;
      }
      
      if (validatedData.lampiran) {
        await tx.lampiran.upsert({
          where: { anak_id: anakId },
          update: {
            ...validatedData.lampiran,
            perjanjian: validatedData.lampiran.perjanjian ?? null,
          },
          create: {
            anak_id: anakId,
            ...validatedData.lampiran,
            perjanjian: validatedData.lampiran.perjanjian ?? null,
          },
        });
        relasiDiupdate = true;
      }
      
      // Handle array data - delete existing and create new
      if (validatedData.pemeriksaan_sebelumnya !== undefined) {
        await tx.pemeriksaanSebelumnya.deleteMany({
          where: { anak_id: anakId },
        });
        if (validatedData.pemeriksaan_sebelumnya.length > 0) {
          await tx.pemeriksaanSebelumnya.createMany({
            data: validatedData.pemeriksaan_sebelumnya.map(item => ({
              anak_id: anakId,
              ...item,
            })),
          });
        }
      }
      
      if (validatedData.terapi_sebelumnya !== undefined) {
        await tx.terapiSebelumnya.deleteMany({
          where: { anak_id: anakId },
        });
        if (validatedData.terapi_sebelumnya.length > 0) {
          await tx.terapiSebelumnya.createMany({
            data: validatedData.terapi_sebelumnya.map(item => ({
              anak_id: anakId,
              ...item,
            })),
          });
        }
      }
      
      // Jika ada relasi yang diupdate, update updated_at anak
      if (relasiDiupdate) {
        await tx.anak.update({
          where: { id: anakId },
          data: { updated_at: new Date() },
        });
      }
      
      // Cek apakah anak sudah punya assessment, jika belum buat assessment default
      const existingAssessment = await tx.penilaianAnak.findFirst({
        where: { anak_id: anakId }
      });
      
      if (!existingAssessment) {
        const assessmentDate = validatedData.tanggal_pemeriksaan ? 
          new Date(validatedData.tanggal_pemeriksaan) : 
          new Date();
        
        await tx.penilaianAnak.create({
          data: {
            anak_id: anakId,
            assessment_date: assessmentDate,
            assessment_type: 'Assessment Awal',
            assessment_result: 'Menunggu Penilaian',
            notes: `Assessment otomatis dibuat saat update data anak ${anak.full_name}`,
            created_by: user.id,
          },
        });
      }

      // Cek apakah anak sudah punya program terapi, jika belum buat program terapi default
      const existingProgram = await tx.programTerapi.findFirst({
        where: { anak_id: anakId }
      });
      
      if (!existingProgram) {
        const programStartDate = validatedData.tanggal_pemeriksaan ? 
          new Date(validatedData.tanggal_pemeriksaan) : 
          new Date();
        
        await tx.programTerapi.create({
          data: {
            anak_id: anakId,
            program_name: `Program Terapi - ${anak.full_name}`,
            description: `Program terapi otomatis dibuat saat update data anak ${anak.full_name}`,
            start_date: programStartDate,
            end_date: new Date(programStartDate.getTime() + (90 * 24 * 60 * 60 * 1000)), // 90 hari dari start
            status: 'AKTIF',
            created_by: user.id,
          },
        });
      }
      
      // Return updated anak with all relations
      return await tx.anak.findUnique({
        where: { id: anakId },
        include: {
          user_created: {
            select: {
              id: true,
              name: true,
            },
          },
          user_updated: {
            select: {
              id: true,
              name: true,
            },
          },
          survey_awal: true,
          ayah: true,
          ibu: true,
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
    });
    
    return createCorsResponse({
      status: 'success',
      message: 'Data anak berhasil diperbarui',
      data: { anak: result },
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    if (error instanceof z.ZodError) {
      return createCorsResponse({ status: 'error', message: 'Data tidak valid', errors: error.errors }, 400, request);
    }
    console.error('Update anak error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// DELETE - Soft delete anak
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const anakId = parseInt(id);
    if (isNaN(anakId)) {
      return createCorsResponse({ status: 'error', message: 'ID tidak valid' }, 400, request);
    }
    // Check if anak exists
    const existingAnak = await prisma.anak.findFirst({
      where: {
        id: anakId,
        deleted_at: null,
      },
    });
    if (!existingAnak) {
      return createCorsResponse({ status: 'error', message: 'Data anak tidak ditemukan' }, 404, request);
    }
    // Soft delete
    await prisma.anak.update({
      where: { id: anakId },
      data: {
        deleted_at: new Date(),
        deleted_by: user.id,
      },
    });
    return createCorsResponse({
      status: 'success',
      message: 'Data anak berhasil dihapus',
    }, 200, request);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createCorsResponse({ status: 'error', message: 'Akses ditolak. Token tidak valid.' }, 401, request);
    }
    console.error('Delete anak error:', error);
    return createCorsResponse({ status: 'error', message: 'Terjadi kesalahan server' }, 500, request);
  }
}

// Tambahkan handler OPTIONS untuk CORS
export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return createCorsOptionsResponse(request);
} 