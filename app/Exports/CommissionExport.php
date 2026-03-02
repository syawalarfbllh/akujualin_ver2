<?php

namespace App\Exports;

use App\Models\Commission;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CommissionExport implements FromQuery, WithHeadings, WithMapping
{
    protected $start, $end;

    public function __construct($start, $end) {
        $this->start = $start;
        $this->end = $end;
    }

    public function query()
    {
        return Commission::query()
            ->when($this->start, fn($q) => $q->whereDate('created_at', '>=', $this->start))
            ->when($this->end, fn($q) => $q->whereDate('created_at', '<=', $this->end));
    }

    public function headings(): array {
        return ["ID", "Nama Mahasiswa", "Produk", "Jumlah Komisi", "Tanggal"];
    }

    public function map($commission): array {
        return [
            $commission->id,
            $commission->user->name,
            $commission->product->name,
            $commission->amount,
            $commission->created_at->format('d/m/Y'),
        ];
    }
}