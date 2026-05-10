const API = 'https://tugas3-123230027-praktcc-579679620696.us-central1.run.app/api/v1';

// Fungsi untuk memuat semua catatan
async function loadNotes() {
  try {
    const res = await fetch(`${API}/notes`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    
    // Penyesuaian di sini: mengambil array dari property 'data'
    const notes = responseData.data || []; 
    
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    if (notes.length === 0) {
      list.innerHTML = '<p style="text-align:center;">Belum ada catatan.</p>';
      return;
    }

    notes.forEach(note => {
      // Format tanggal agar lebih manusiawi (WIB)
      const date = new Date(note.tanggal_dibuat).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      list.innerHTML += `
        <div class="note-card">
          <h3>${note.judul}</h3>
          <p>${note.isi}</p>
          <small>📅 ${date}</small>
          <div class="card-actions">
            <button class="btn-edit" onclick="editNote(${note.id}, '${note.judul.replace(/'/g, "\\'")}', '${note.isi.replace(/'/g, "\\\\n")}')">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteNote(${note.id})">🗑️ Hapus</button>
          </div>
        </div>`;
    });
  } catch (error) {
    console.error('Gagal memuat notes:', error);
    // Alert ini muncul jika ada masalah CORS atau koneksi internet
    // alert('Gagal terhubung ke server. Pastikan backend sudah aktif dan CORS diizinkan.');
  }
}

// Fungsi untuk menyimpan catatan (Tambah/Update)
async function saveNote() {
  const id = document.getElementById('editId').value;
  const judul = document.getElementById('judul').value;
  const isi = document.getElementById('isi').value;

  if (!judul || !isi) return alert('Judul dan isi wajib diisi!');

  const bodyData = JSON.stringify({ judul, isi });
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (id) {
      // Update data yang sudah ada
      await fetch(`${API}/notes/${id}`, {
        method: 'PUT',
        headers: headers,
        body: bodyData
      });
    } else {
      // Tambah data baru
      await fetch(`${API}/notes`, {
        method: 'POST',
        headers: headers,
        body: bodyData
      });
    }
    
    cancelEdit();
    loadNotes();
  } catch (error) {
    console.error('Gagal menyimpan note:', error);
    alert('Terjadi kesalahan saat menyimpan data.');
  }
}

// Mengisi form input saat tombol edit ditekan
function editNote(id, judul, isi) {
  document.getElementById('editId').value = id;
  document.getElementById('judul').value = judul;
  document.getElementById('isi').value = isi;
  document.getElementById('btnCancel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset form input
function cancelEdit() {
  document.getElementById('editId').value = '';
  document.getElementById('judul').value = '';
  document.getElementById('isi').value = '';
  document.getElementById('btnCancel').style.display = 'none';
}

// Fungsi hapus
async function deleteNote(id) {
  if (!confirm('Yakin hapus catatan ini?')) return;
  
  try {
    await fetch(`${API}/notes/${id}`, { method: 'DELETE' });
    loadNotes();
  } catch (error) {
    console.error('Gagal menghapus note:', error);
    alert('Gagal menghapus data.');
  }
}

// Jalankan fungsi load pertama kali saat halaman dibuka
loadNotes();