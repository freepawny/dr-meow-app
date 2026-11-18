/**
 * Manipulasi DOM untuk merender struktur dialog Modal Reservasi ke dalam body dokumen (Week 3).
 */
(function mountReservationModalDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-backdrop";
    wrapper.id = "reservationModal";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-modal", "true");
    wrapper.setAttribute("aria-labelledby", "modalHeading");

    wrapper.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-header">
                <div>
                    <span class="badge badge-small badge-outline-default">Standar Medis Veteriner</span>
                    <h2 class="modal-title" id="modalHeading">Reservasi Jadwal Perawatan</h2>
                    <p class="modal-subtitle">Pilih paket &amp; lengkapi data singkat anabul Anda.</p>
                </div>
                <button type="button" class="modal-close-btn" id="closeModalBtn" aria-label="Tutup modal">✕</button>
            </div>

            <form id="reservationForm" class="modal-body" novalidate>
                <div class="form-grid two-cols">
                    <div class="form-field">
                        <label class="form-label" for="resService">1. Paket Layanan *</label>
                        <select id="resService" class="form-select">
                            <option value="hair-skin">Grooming Hair &amp; Skin</option>
                            <option value="complete" selected>Grooming Komplit (Populer)</option>
                            <option value="sensitive">Grooming Sensitive Skin</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="resMethod">2. Metode Layanan *</label>
                        <select id="resMethod" class="form-select">
                            <option value="Antar-Jemput (Pick-up)">Antar-Jemput (Pick-up)</option>
                            <option value="Home Service">Home Service</option>
                            <option value="Drop-off Cabang">Drop-off Cabang</option>
                            <option value="Ditunggu di Klinik">Ditunggu di Klinik</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid two-cols">
                    <div class="form-field">
                        <label class="form-label" for="resCustomerName">Nama Pemilik (Paw Parent) *</label>
                        <input id="resCustomerName" type="text" class="form-input" placeholder="Contoh: Nadia Putri">
                        <span id="errCustomerName" class="form-error"></span>
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="resPhone">Nomor WhatsApp Aktif *</label>
                        <input id="resPhone" type="tel" class="form-input" placeholder="081234567890">
                        <span id="errPhone" class="form-error"></span>
                    </div>
                </div>

                <div class="form-grid two-cols">
                    <div class="form-field">
                        <label class="form-label" for="resCatName">Nama Anabul *</label>
                        <input id="resCatName" type="text" class="form-input" placeholder="Contoh: Mochi">
                        <span id="errCatName" class="form-error"></span>
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="resCatWeight">Berat Badan (kg) *</label>
                        <input id="resCatWeight" type="number" step="0.1" min="0.3" value="1.5" class="form-input">
                        <span id="errCatWeight" class="form-error"></span>
                    </div>
                </div>

                <div class="form-grid two-cols">
                    <div class="form-field">
                        <label class="form-label" for="resDate">Tanggal Kedatangan *</label>
                        <input id="resDate" type="date" class="form-input">
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="resTime">Sesi Jam Operasional *</label>
                        <select id="resTime" class="form-select">
                            <option value="08:00">08:00 WIB (Pagi Awal)</option>
                            <option value="10:00" selected>10:00 WIB (Pagi)</option>
                            <option value="13:00">13:00 WIB (Siang)</option>
                            <option value="15:00">15:00 WIB (Sore)</option>
                        </select>
                    </div>
                </div>

                <div class="form-field">
                    <label class="form-label" id="resAddressLabel" for="resAddress">Alamat Penjemputan / Rumah *</label>
                    <input id="resAddress" type="text" class="form-input" placeholder="Jl. Soekarno Hatta No. 15, Malang">
                    <span id="errAddress" class="form-error"></span>
                </div>
            </form>

            <div id="reservationSuccessView" class="modal-body" style="display: none;">
                <div class="summary-box">
                    <div class="summary-row"><span>Kode Reservasi</span><strong id="sumCode">-</strong></div>
                    <div class="summary-row"><span>Pemilik</span><strong id="sumCustomer">-</strong></div>
                    <div class="summary-row"><span>Anabul</span><strong id="sumCat">-</strong></div>
                    <div class="summary-row"><span>Layanan</span><strong id="sumService">-</strong></div>
                    <div class="summary-row"><span>Jadwal</span><strong id="sumSchedule">-</strong></div>
                    <div class="summary-row"><span>Estimasi Tagihan</span><strong id="sumTotal">-</strong></div>
                </div>
                <a id="sumWhatsappBtn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-large btn-filled">Kirim Bukti Reservasi ke WhatsApp →</a>
            </div>

            <div id="modalFormFooter" class="modal-footer">
                <div>
                    <div class="bill-label">Estimasi Biaya (<span id="resTierLabel">Kecil (&lt; 2 kg)</span>)</div>
                    <div class="bill-amount" id="resTotalBill">Rp 55.000</div>
                </div>
                <button type="submit" form="reservationForm" class="btn btn-large btn-filled">Konfirmasi Reservasi</button>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);
})();
