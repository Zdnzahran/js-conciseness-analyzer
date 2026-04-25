const assert = require('assert');
const { calculateHalstead } = require('../src/metrics/halsteadCalculator');

describe('Pengujian Metrik Halstead (halsteadCalculator.js)', function() {
    
    it('harus menghitung Vocabulary (n) dan Length (N) dengan akurat', function() {
        // 1. Siapkan data tiruan (Mock Data) dengan format Objek Frekuensi
        // Asumsi dari kode: let a = 1 + 2; (Tiap token muncul 1 kali)
        const mockOperators = { 'let': 1, '=': 1, '+': 1 }; 
        const mockOperands = { 'a': 1, '1': 1, '2': 1 };    
        
        // 2. Jalankan fungsi yang ingin diuji
        const hasil = calculateHalstead(mockOperators, mockOperands);
        
        // 3. Validasi hasil (Assert)
        // Vocabulary (n) = unik operator (3) + unik operan (3) = 6
        assert.strictEqual(hasil.vocabulary, 6, 'Vocabulary harus bernilai 6');
        
        // Length (N) = total operator (3) + total operan (3) = 6
        assert.strictEqual(hasil.length, 6, 'Length harus bernilai 6');
    });

    it('harus dapat menangani input kosong tanpa menyebabkan error', function() {
        // objek kosong {} sebagai representasi tidak ada token
        const mockOperators = {};
        const mockOperands = {};
        
        const hasil = calculateHalstead(mockOperators, mockOperands);
        
        assert.strictEqual(hasil.vocabulary, 0, 'Vocabulary dari objek kosong harus 0');
        assert.strictEqual(hasil.length, 0, 'Length dari objek kosong harus 0');
    });
});