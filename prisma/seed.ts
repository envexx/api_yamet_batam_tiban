import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Upsert roles
  const roles = [
    'SUPERADMIN',
    'MANAJER',
    'ADMIN',
    'TERAPIS',
    'ORANGTUA',
  ];
  const roleMap: Record<string, any> = {};
  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleMap[roleName] = role;
  }

  // Hash passwords
  const superadminPassword = await bcrypt.hash('Superadminyamet', 10);
  const adminPassword = await bcrypt.hash('Adminyamet123', 10);

  // Create superadmin user
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@yametbatamtiban.com' },
    update: {},
    create: {
      name: 'Super Administrator',
      email: 'superadmin@yametbatamtiban.com',
      password: superadminPassword,
      role_id: roleMap['SUPERADMIN'].id,
      status: 'active',
      phone: '08123456789',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Tambah akun superadmin kedua
  const superadmin2 = await prisma.user.upsert({
    where: { email: 'superadmin2@yametbatamtiban.com' },
    update: {},
    create: {
      name: 'Superadmin Kedua',
      email: 'superadmin2@yametbatamtiban.com',
      password: await bcrypt.hash('Superadmin2yamet', 10),
      role_id: roleMap['SUPERADMIN'].id,
      status: 'active',
      phone: '08123456788',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yametbatamtiban.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@yametbatamtiban.com',
      password: adminPassword,
      role_id: roleMap['ADMIN'].id,
      status: 'active',
      phone: '08123456790',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Tambah akun manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@yametbatamtiban.com' },
    update: {},
    create: {
      name: 'Manager',
      email: 'manager@yametbatamtiban.com',
      password: await bcrypt.hash('Manageryamet123', 10),
      role_id: roleMap['MANAJER'].id,
      status: 'active',
      phone: '08123456787',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Tambah akun terapis
  const terapis = await prisma.user.upsert({
    where: { email: 'terapis@yametbatamtiban.com' },
    update: {},
    create: {
      name: 'Terapis',
      email: 'terapis@yametbatamtiban.com',
      password: await bcrypt.hash('Terapisyamet123', 10),
      role_id: roleMap['TERAPIS'].id,
      status: 'active',
      phone: '08123456786',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Create 1 anak lengkap beserta seluruh relasi barunya
  const anak = await prisma.anak.create({
    data: {
      nomor_anak: 'YAMET-2024-0001',
      full_name: 'Seeder Anak Lengkap',
      nick_name: 'Anak1',
      birth_date: new Date('2018-05-10'),
      birth_place: 'Batam',
      kewarganegaraan: 'Indonesia',
      agama: 'Islam',
      anak_ke: 1,
      sekolah_kelas: 'TK B',
      status: 'AKTIF',
      created_by: admin.id,
      created_at: new Date(),
      updated_at: new Date(),
      survey_awal: {
        create: {
          mengetahui_yamet_dari: 'Internet',
          penjelasan_mekanisme: true,
          bersedia_online: true,
          keluhan_orang_tua: ['Sulit bicara', 'Sering tantrum'],
          tindakan_orang_tua: ['Sudah terapi', 'Konsultasi dokter'],
          kendala: ['Biaya', 'Jarak jauh'],
        }
      },
      ayah: {
        create: {
          nama: 'Ayah Seeder',
          tempat_lahir: 'Batam',
          tanggal_lahir: new Date('1985-01-01'),
          usia: 39,
          agama: 'Islam',
          alamat_rumah: 'Jl. Ayah',
          anak_ke: 1,
          pernikahan_ke: 1,
          usia_saat_menikah: 28,
          pendidikan_terakhir: 'S1',
          pekerjaan_saat_ini: 'Karyawan',
          telepon: '08123456781',
          email: 'ayah@seed.com',
        }
      },
      ibu: {
        create: {
          nama: 'Ibu Seeder',
          tempat_lahir: 'Batam',
          tanggal_lahir: new Date('1987-02-02'),
          usia: 37,
          agama: 'Islam',
          alamat_rumah: 'Jl. Ibu',
          anak_ke: 2,
          pernikahan_ke: 1,
          usia_saat_menikah: 26,
          pendidikan_terakhir: 'SMA',
          pekerjaan_saat_ini: 'Ibu Rumah Tangga',
          telepon: '08123456782',
          email: 'ibu@seed.com',
        }
      },
      riwayat_kehamilan: {
        create: {
          usia_ibu_saat_hamil: 30,
          usia_ayah_saat_hamil: 32,
          mual_sulit_makan: true,
          asupan_gizi_memadai: true,
          perawatan_kehamilan: true,
          kehamilan_diinginkan: true,
          berat_bayi_semester_normal: true,
          diabetes: false,
          hipertensi: false,
          asma: false,
          tbc: false,
          merokok: false,
          sekitar_perokok_berat: false,
          konsumsi_alkohol: false,
          konsumsi_obat_obatan: false,
          infeksi_virus: false,
          kecelakaan_trauma: false,
          pendarahan_flek: false,
          masalah_pernafasan: false,
        }
      },
      riwayat_kelahiran: {
        create: {
          jenis_kelahiran: 'NORMAL',
          alasan_sc: null,
          bantuan_kelahiran: [''],
          is_premature: false,
          usia_kelahiran_bulan: 9,
          posisi_bayi_saat_lahir: 'KEPALA',
          is_sungsang: false,
          is_kuning: false,
          detak_jantung_anak: 'Normal',
          apgar_score: '8-9',
          lama_persalinan: '6 jam',
          penolong_persalinan: 'DOKTER',
          tempat_bersalin: 'RS Batam',
          cerita_spesifik_kelahiran: 'Tidak ada',
        }
      },
      riwayat_imunisasi: {
        create: {
          bgc: true,
          hep_b1: true,
          hep_b2: true,
          hep_b3: true,
          dpt_1: true,
          dpt_2: true,
          dpt_3: true,
          dpt_booster_1: true,
          polio_1: true,
          polio_2: true,
          polio_3: true,
          polio_4: true,
          polio_booster_1: true,
          campak_1: true,
          campak_2: false,
          hib_1: true,
          hib_2: true,
          hib_3: true,
          hib_4: true,
          mmr_1: true,
        }
      },
      riwayat_setelah_lahir: {
        create: {
          asi_sampai_usia_bulan: 6,
          pernah_jatuh: false,
          pernah_sakit_parah: false,
          pernah_panas_tinggi: false,
          disertai_kejang: false,
          pernah_kejang_tanpa_panas: false,
          sakit_karena_virus: false,
        }
      },
      perkembangan_anak: {
        create: {
          tengkurap_ya: true,
          tengkurap_usia: '3 bulan',
          berguling_ya: true,
          berguling_usia: '4 bulan',
          duduk_ya: true,
          duduk_usia: '6 bulan',
          merayap_ya: true,
          merayap_usia: '7 bulan',
          merangkak_ya: true,
          merangkak_usia: '8 bulan',
          jongkok_ya: true,
          jongkok_usia: '10 bulan',
          transisi_berdiri_ya: true,
          transisi_berdiri_usia: '11 bulan',
          berdiri_tanpa_pegangan_ya: true,
          berdiri_tanpa_pegangan_usia: '12 bulan',
          berlari_ya: true,
          berlari_usia: '14 bulan',
          melompat_ya: true,
          melompat_usia: '18 bulan',
          reflek_vokalisasi_ya: true,
          reflek_vokalisasi_usia: '2 bulan',
          bubbling_ya: true,
          bubbling_usia: '5 bulan',
          lalling_ya: true,
          lalling_usia: '7 bulan',
          echolalia_ya: true,
          echolalia_usia: '10 bulan',
          true_speech_ya: true,
          true_speech_usia: '12 bulan',
          ungkap_keinginan_2_kata_ya: true,
          ungkap_keinginan_2_kata_usia: '15 bulan',
          bercerita_ya: true,
          bercerita_usia: '24 bulan',
          tertarik_lingkungan_luar_ya: true,
          tertarik_lingkungan_luar_usia: '3 bulan',
          digendong_siapapun_ya: true,
          digendong_siapapun_usia: '4 bulan',
          interaksi_timbal_balik_ya: true,
          interaksi_timbal_balik_usia: '6 bulan',
          komunikasi_ekspresi_ibu_ya: true,
          komunikasi_ekspresi_ibu_usia: '7 bulan',
          ekspresi_emosi_ya: true,
          ekspresi_emosi_usia: '8 bulan',
        }
      },
      perilaku_oral_motor: {
        create: {
          mengeces: false,
          makan_makanan_keras: true,
          makan_makanan_berkuah: true,
          pilih_pilih_makanan: false,
          makan_di_emut: false,
          mengunyah_saat_makan: true,
          makan_langsung_telan: false,
        }
      },
      pola_makan: {
        create: {
          pola_teratur: 'Teratur',
          ada_pantangan_makanan: false,
          pantangan_makanan: '',
          keterangan_lainnya: '',
        }
      },
      perkembangan_sosial: {
        create: {
          perilaku_bertemu_orang_baru: 'Malu',
          perilaku_bertemu_teman_sebaya: 'Aktif',
          perilaku_bertemu_orang_lebih_tua: 'Sopan',
          bermain_dengan_banyak_anak: 'Ya',
          keterangan_lainnya: '',
        }
      },
      pola_tidur: {
        create: {
          jam_tidur_teratur: true,
          sering_terbangun: false,
          jam_tidur_malam: '21:00',
          jam_bangun_pagi: '06:00',
        }
      },
      penyakit_diderita: {
        create: {
          sakit_telinga: false,
          sakit_mata: false,
          luka_kepala: false,
          penyakit_lainnya: '',
        }
      },
      hubungan_keluarga: {
        create: {
          tinggal_dengan: ['Keluarga inti'],
          tinggal_dengan_lainnya: '',
          hubungan_ayah_ibu: 'Harmonis',
          hubungan_ayah_anak: 'Dekat',
          hubungan_ibu_anak: 'Dekat',
          hubungan_saudara_dengan_anak: 'Baik',
          hubungan_nenek_kakek_dengan_anak: 'Dekat',
          hubungan_saudara_ortu_dengan_anak: '',
          hubungan_pengasuh_dengan_anak: '',
        }
      },
      riwayat_pendidikan: {
        create: {
          mulai_sekolah_formal_usia: '6 tahun',
          mulai_sekolah_informal_usia: '4 tahun',
          sekolah_formal_diikuti: 'TK B',
          sekolah_informal_diikuti: 'PAUD',
          bimbingan_belajar: true,
          belajar_membaca_sendiri: true,
          belajar_dibacakan_ortu: true,
          nilai_rata_rata_sekolah: '90',
          nilai_tertinggi_mapel: 'Matematika',
          nilai_tertinggi_nilai: '100',
          nilai_terendah_mapel: 'Bahasa Inggris',
          nilai_terendah_nilai: '80',
          keluhan_guru: ['Kurang fokus'],
        }
      },
      pemeriksaan_sebelumnya: {
        create: [
          { tempat: 'RS Batam', usia: '3 tahun', diagnosa: 'Speech Delay' }
        ]
      },
      terapi_sebelumnya: {
        create: [
          { jenis_terapi: 'Wicara', frekuensi: '2x/minggu', lama_terapi: '6 bulan', tempat: 'RS Batam' }
        ]
      },
      lampiran: {
        create: {
          hasil_eeg_url: 'http://example.com/eeg.pdf',
          hasil_bera_url: '',
          hasil_ct_scan_url: '',
          program_terapi_3bln_url: '',
          hasil_psikologis_psikiatris_url: '',
          keterangan_tambahan: 'Tidak ada',
        }
      },
    }
  });

  // Create anak kedua lengkap beserta seluruh relasi barunya
  const anak2 = await prisma.anak.create({
    data: {
      nomor_anak: 'YAMET-2024-0002',
      full_name: 'Seeder Anak Lengkap 2',
      nick_name: 'Anak2',
      birth_date: new Date('2017-08-15'),
      birth_place: 'Batam',
      kewarganegaraan: 'Indonesia',
      agama: 'Kristen',
      anak_ke: 2,
      sekolah_kelas: 'SD 1',
      status: 'AKTIF',
      created_by: admin.id,
      created_at: new Date(),
      updated_at: new Date(),
      survey_awal: {
        create: {
          mengetahui_yamet_dari: 'Teman',
          penjelasan_mekanisme: true,
          bersedia_online: false,
          keluhan_orang_tua: ['Sulit fokus', 'Kurang bicara'],
          tindakan_orang_tua: ['Konsultasi psikolog'],
          kendala: ['Waktu', 'Transportasi'],
        }
      },
      ayah: {
        create: {
          nama: 'Ayah Seeder 2',
          tempat_lahir: 'Jakarta',
          tanggal_lahir: new Date('1983-03-03'),
          usia: 41,
          agama: 'Kristen',
          alamat_rumah: 'Jl. Ayah 2',
          anak_ke: 1,
          pernikahan_ke: 1,
          usia_saat_menikah: 30,
          pendidikan_terakhir: 'S2',
          pekerjaan_saat_ini: 'Wiraswasta',
          telepon: '08123456785',
          email: 'ayah2@seed.com',
        }
      },
      ibu: {
        create: {
          nama: 'Ibu Seeder 2',
          tempat_lahir: 'Surabaya',
          tanggal_lahir: new Date('1985-04-04'),
          usia: 39,
          agama: 'Kristen',
          alamat_rumah: 'Jl. Ibu 2',
          anak_ke: 2,
          pernikahan_ke: 1,
          usia_saat_menikah: 28,
          pendidikan_terakhir: 'S1',
          pekerjaan_saat_ini: 'Guru',
          telepon: '08123456784',
          email: 'ibu2@seed.com',
        }
      },
      riwayat_kehamilan: {
        create: {
          usia_ibu_saat_hamil: 32,
          usia_ayah_saat_hamil: 34,
          mual_sulit_makan: false,
          asupan_gizi_memadai: true,
          perawatan_kehamilan: true,
          kehamilan_diinginkan: true,
          berat_bayi_semester_normal: true,
          diabetes: false,
          hipertensi: false,
          asma: false,
          tbc: false,
          merokok: false,
          sekitar_perokok_berat: false,
          konsumsi_alkohol: false,
          konsumsi_obat_obatan: false,
          infeksi_virus: false,
          kecelakaan_trauma: false,
          pendarahan_flek: false,
          masalah_pernafasan: false,
        }
      },
      riwayat_kelahiran: {
        create: {
          jenis_kelahiran: 'CAESAR',
          alasan_sc: 'Posisi bayi sungsang',
          bantuan_kelahiran: ['Forcep'],
          is_premature: true,
          usia_kelahiran_bulan: 8,
          posisi_bayi_saat_lahir: 'KAKI',
          is_sungsang: true,
          is_kuning: true,
          detak_jantung_anak: 'Lemah',
          apgar_score: '7',
          lama_persalinan: '10 jam',
          penolong_persalinan: 'DOKTER',
          tempat_bersalin: 'RS Jakarta',
          cerita_spesifik_kelahiran: 'Prematur, butuh inkubator',
        }
      },
      riwayat_imunisasi: {
        create: {
          bgc: true,
          hep_b1: true,
          hep_b2: true,
          hep_b3: true,
          dpt_1: true,
          dpt_2: true,
          dpt_3: true,
          dpt_booster_1: false,
          polio_1: true,
          polio_2: true,
          polio_3: false,
          polio_4: false,
          polio_booster_1: false,
          campak_1: true,
          campak_2: true,
          hib_1: true,
          hib_2: true,
          hib_3: false,
          hib_4: false,
          mmr_1: true,
        }
      },
      riwayat_setelah_lahir: {
        create: {
          asi_sampai_usia_bulan: 4,
          pernah_jatuh: true,
          jatuh_usia_bulan: 18,
          jatuh_ketinggian_cm: 50,
          pernah_sakit_parah: true,
          sakit_parah_usia_bulan: 24,
          pernah_panas_tinggi: true,
          panas_tinggi_usia_bulan: 30,
          disertai_kejang: true,
          frekuensi_durasi_kejang: '2x, 1 menit',
          pernah_kejang_tanpa_panas: false,
          sakit_karena_virus: true,
          sakit_virus_usia_bulan: 36,
          sakit_virus_jenis: 'Campak',
        }
      },
      perkembangan_anak: {
        create: {
          tengkurap_ya: true,
          tengkurap_usia: '4 bulan',
          berguling_ya: true,
          berguling_usia: '5 bulan',
          duduk_ya: true,
          duduk_usia: '7 bulan',
          merayap_ya: true,
          merayap_usia: '8 bulan',
          merangkak_ya: true,
          merangkak_usia: '9 bulan',
          jongkok_ya: true,
          jongkok_usia: '12 bulan',
          transisi_berdiri_ya: true,
          transisi_berdiri_usia: '13 bulan',
          berdiri_tanpa_pegangan_ya: true,
          berdiri_tanpa_pegangan_usia: '14 bulan',
          berlari_ya: true,
          berlari_usia: '16 bulan',
          melompat_ya: false,
          melompat_usia: null,
          reflek_vokalisasi_ya: true,
          reflek_vokalisasi_usia: '2 bulan',
          bubbling_ya: true,
          bubbling_usia: '3 bulan',
          lalling_ya: true,
          lalling_usia: '6 bulan',
          echolalia_ya: false,
          echolalia_usia: null,
          true_speech_ya: true,
          true_speech_usia: '18 bulan',
          ungkap_keinginan_2_kata_ya: true,
          ungkap_keinginan_2_kata_usia: '20 bulan',
          bercerita_ya: false,
          bercerita_usia: null,
          tertarik_lingkungan_luar_ya: true,
          tertarik_lingkungan_luar_usia: '24 bulan',
          digendong_siapapun_ya: false,
          digendong_siapapun_usia: null,
          interaksi_timbal_balik_ya: true,
          interaksi_timbal_balik_usia: '30 bulan',
          komunikasi_ekspresi_ibu_ya: true,
          komunikasi_ekspresi_ibu_usia: '32 bulan',
          ekspresi_emosi_ya: true,
          ekspresi_emosi_usia: '36 bulan',
        }
      },
      perilaku_oral_motor: {
        create: {
          mengeces: false,
          makan_makanan_keras: true,
          makan_makanan_berkuah: true,
          pilih_pilih_makanan: false,
          makan_di_emut: false,
          mengunyah_saat_makan: true,
          makan_langsung_telan: false,
        }
      },
      pola_makan: {
        create: {
          pola_teratur: '3x sehari',
          ada_pantangan_makanan: false,
          pantangan_makanan: '',
          keterangan_lainnya: 'Tidak ada',
        }
      },
      perkembangan_sosial: {
        create: {
          perilaku_bertemu_orang_baru: 'Malu-malu',
          perilaku_bertemu_teman_sebaya: 'Aktif',
          perilaku_bertemu_orang_lebih_tua: 'Sopan',
          bermain_dengan_banyak_anak: 'Kadang',
          keterangan_lainnya: 'Perlu adaptasi',
        }
      },
      pola_tidur: {
        create: {
          jam_tidur_teratur: true,
          sering_terbangun: false,
          jam_tidur_malam: '21:00',
          jam_bangun_pagi: '06:00',
        }
      },
      penyakit_diderita: {
        create: {
          sakit_telinga: false,
          sakit_telinga_usia_tahun: null,
          sakit_telinga_penjelasan: null,
          sakit_mata: false,
          sakit_mata_usia_tahun: null,
          sakit_mata_penjelasan: null,
          luka_kepala: false,
          luka_kepala_usia_tahun: null,
          penyakit_lainnya: null,
        }
      },
      hubungan_keluarga: {
        create: {
          tinggal_dengan: ['Ayah', 'Ibu', 'Saudara'],
          tinggal_dengan_lainnya: null,
          hubungan_ayah_ibu: 'Harmonis',
          hubungan_ayah_anak: 'Dekat',
          hubungan_ibu_anak: 'Dekat',
          hubungan_saudara_dengan_anak: 'Sering bermain',
          hubungan_nenek_kakek_dengan_anak: 'Kadang bertemu',
          hubungan_saudara_ortu_dengan_anak: 'Jauh',
          hubungan_pengasuh_dengan_anak: null,
        }
      },
      riwayat_pendidikan: {
        create: {
          mulai_sekolah_formal_usia: '7 tahun',
          mulai_sekolah_informal_usia: '5 tahun',
          sekolah_formal_diikuti: 'SDN 1',
          sekolah_informal_diikuti: 'TK',
          bimbingan_belajar: false,
          belajar_membaca_sendiri: true,
          belajar_dibacakan_ortu: false,
          nilai_rata_rata_sekolah: '85',
          nilai_tertinggi_mapel: 'IPA',
          nilai_tertinggi_nilai: '95',
          nilai_terendah_mapel: 'IPS',
          nilai_terendah_nilai: '75',
          keluhan_guru: ['Kurang konsentrasi'],
        }
      },
      pemeriksaan_sebelumnya: {
        create: [
          { tempat: 'RS Jakarta', usia: '2 tahun', diagnosa: 'Speech Delay' }
        ]
      },
      terapi_sebelumnya: {
        create: [
          { jenis_terapi: 'Fisioterapi', frekuensi: '1x/minggu', lama_terapi: '3 bulan', tempat: 'RS Jakarta' }
        ]
      },
      lampiran: {
        create: {
          hasil_eeg_url: '',
          hasil_bera_url: '',
          hasil_ct_scan_url: '',
          program_terapi_3bln_url: '',
          hasil_psikologis_psikiatris_url: '',
          perjanjian: '',
          keterangan_tambahan: 'Tidak ada',
        }
      },
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('📋 Default credentials:');
  console.log('Superadmin:', {
    email: 'superadmin@yametbatamtiban.com',
    password: 'Superadminyamet',
  });
  console.log('Admin:', {
    email: 'admin@yametbatamtiban.com',
    password: 'Adminyamet123',
  });
  console.log('Anak:', {
    nomor_anak: 'YAMET-2024-0001',
    full_name: 'Seeder Anak Lengkap',
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 