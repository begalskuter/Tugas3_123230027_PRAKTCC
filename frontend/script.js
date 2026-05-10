const API = 'http://localhost:3000/api/v1'; // Ganti dengan IP VM saat deploy

async function loadNotes() {
  const res = await fetch(`${API}/notes`);
  if (!res.ok) {
    console.error('Gagal memuat notes:', res.status, res.statusText);
    return;
  }

  const data = await res.json();
  const notes = data.data || [];
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  notes.forEach(note => {
    const date = new Date(note.tanggal_dibuat).toLocaleString('id-ID');
    list.innerHTML += `
      <div class="note-card">
        <h3>${note.judul}</h3>
        <p>${note.isi}</p>
        <small>📅 ${date}</small>
        <div class="card-actions">
          <button class="btn-edit" onclick="editNote(${note.id}, '${note.judul.replace(/'/g,"\\'")}', '${note.isi.replace(/'/g,"\\'")}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteNote(${note.id})">🗑️ Hapus</button>
        </div>
      </div>`;
  });
}

async function saveNote() {
  const id = document.getElementById('editId').value;
  const judul = document.getElementById('judul').value;
  const isi = document.getElementById('isi').value;
  if (!judul) return alert('Judul wajib diisi!');

  if (id) {
    await fetch(`${API}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, isi })
    });
  } else {
    await fetch(`${API}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, isi })
    });
  }
  cancelEdit();
  loadNotes();
}

function editNote(id, judul, isi) {
  document.getElementById('editId').value = id;
  document.getElementById('judul').value = judul;
  document.getElementById('isi').value = isi;
  document.getElementById('btnCancel').style.display = 'block';
  window.scrollTo(0, 0);
}

function cancelEdit() {
  document.getElementById('editId').value = '';
  document.getElementById('judul').value = '';
  document.getElementById('isi').value = '';
  document.getElementById('btnCancel').style.display = 'none';
}

async function deleteNote(id) {
  if (!confirm('Yakin hapus catatan ini?')) return;
  await fetch(`${API}/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

loadNotes();