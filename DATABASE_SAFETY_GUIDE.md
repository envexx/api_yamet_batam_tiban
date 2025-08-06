# 🚨 PANDUAN KEAMANAN DATABASE PRODUCTION

## ⚠️ PERINGATAN PENTING

**JANGAN PERNAH melakukan operasi yang bisa menghapus data di production tanpa backup!**

## 🔒 Scripts yang AMAN untuk Production

### ✅ **AMAN - Tidak akan menghapus data:**
```bash
# Generate Prisma client (aman)
npm run db:generate

# Deploy migration baru (aman - hanya menambah)
npm run db:migrate:prod

# Check status migration (aman)
npm run db:status

# Deploy aman (generate + migrate)
npm run db:deploy-safe
```

### ❌ **BERBAHAYA - Bisa menghapus data:**
```bash
# JANGAN GUNAKAN DI PRODUCTION!
npm run db:push          # Bisa menghapus data
npm run db:migrate       # Development only
npm run db:seed          # Bisa overwrite data
npm run db:seed:prod     # Bisa overwrite data
```

## 🛡️ Prosedur Aman untuk Production

### 1. **Sebelum Deploy Database**
```bash
# 1. Backup database dulu
pg_dump -h your-host -U your-user -d your-database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Check status migration
npm run db:status

# 3. Deploy aman
npm run db:deploy-safe
```

### 2. **Jika Perlu Seed Data di Production**
```bash
# 1. Backup dulu
pg_dump -h your-host -U your-user -d your-database > backup_before_seed.sql

# 2. Seed dengan hati-hati (hanya data yang belum ada)
npm run db:seed:prod
```

### 3. **Emergency Recovery**
```bash
# Restore dari backup
psql -h your-host -U your-user -d your-database < backup_20250108_143022.sql
```

## 📋 Checklist Sebelum Deploy Database

- [ ] **Backup database** dengan `pg_dump`
- [ ] **Test di staging** terlebih dahulu
- [ ] **Check migration status** dengan `npm run db:status`
- [ ] **Review migration files** sebelum deploy
- [ ] **Monitor logs** setelah deploy
- [ ] **Verify data** masih ada setelah deploy

## 🔍 Monitoring Database

### Check Migration Status
```bash
npm run db:status
```

### Check Database Connection
```bash
# Test connection
psql -h your-host -U your-user -d your-database -c "SELECT 1;"
```

### Monitor Logs
```bash
# Check application logs
tail -f logs/app.log

# Check database logs
tail -f logs/database.log
```

## 🚨 Emergency Procedures

### Jika Data Terhapus:
1. **STOP aplikasi segera**
2. **Restore dari backup terakhir**
3. **Investigate penyebab**
4. **Implement safeguards**

### Jika Migration Gagal:
1. **Rollback migration**
2. **Check error logs**
3. **Fix migration file**
4. **Test di staging**
5. **Deploy ulang**

## 📞 Kontak Emergency

- **Database Admin**: [kontak]
- **Backup Location**: [lokasi backup]
- **Recovery Time**: [estimasi waktu recovery]

---

**⚠️ INGAT: Lebih baik mencegah daripada mengobati. Selalu backup sebelum operasi database!** 