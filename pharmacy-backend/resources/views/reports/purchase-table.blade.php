<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Report - {{ ucfirst($status) }}</title>
    <!-- Google Fonts: Inter for modern sans-serif -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'DejaVu Sans', sans-serif;
            background: #f3f4f6;
            padding: 2rem;
            color: #1f2937;
        }

        /* Main container */
        .report-container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            overflow: hidden;
        }

        /* Header with gradient */
        .report-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            padding: 2rem 2rem 1.5rem 2rem;
            color: white;
        }

        .report-title {
            font-size: 1.875rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
        }

        .report-subtitle {
            font-size: 1rem;
            opacity: 0.9;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
        }

        .status-badge-header {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            padding: 0.25rem 1rem;
            border-radius: 40px;
            font-size: 0.875rem;
            font-weight: 600;
            display: inline-block;
        }

        /* Summary cards grid */
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
        }

        .summary-card {
            background: white;
            border-radius: 16px;
            padding: 1rem 1.25rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2ff;
            transition: all 0.2s;
        }

        .summary-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .summary-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }

        .summary-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
        }

        /* Table styling */
        .table-wrapper {
            overflow-x: auto;
            padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .purchase-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.875rem;
        }

        .purchase-table thead th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 600;
            padding: 0.875rem 1rem;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            white-space: nowrap;
        }

        .purchase-table tbody tr {
            transition: background-color 0.15s;
        }

        .purchase-table tbody tr:hover {
            background-color: #f8fafc;
        }

        .purchase-table td {
            padding: 0.875rem 1rem;
            text-align: center;
            border-bottom: 1px solid #eef2ff;
            white-space: nowrap;
        }

        /* Status badges */
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 40px;
            font-size: 0.75rem;
            font-weight: 600;
            text-align: center;
            min-width: 80px;
        }

        .badge-paid {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-partial {
            background: #fed7aa;
            color: #9a3412;
        }

        .badge-pending {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Footer */
        .report-footer {
            padding: 1rem 2rem 1.5rem 2rem;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            display: flex;
            justify-content: flex-end;
            font-size: 0.75rem;
            color: #6b7280;
        }

        /* Print adjustments (optional) */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .summary-card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
            .badge {
                border: 1px solid currentColor;
                background: none !important;
            }
            .report-header {
                background: #1e3a8a !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
<div class="report-container">
    <!-- Header -->
    <div class="report-header">
        <div class="report-title">Purchase Report</div>
        <div class="report-subtitle">
            <span class="status-badge-header">Status: {{ ucfirst($status) }}</span>
            <span>Generated: {{ now()->format('F j, Y, g:i A') }}</span>
        </div>
    </div>

    <!-- Summary Cards (calculations from collection) -->
    @php
        $totalCost = $purchases->sum('details_sum_total_buyer_price');
        $totalProfit = $purchases->sum('details_sum_total_profit');
        $totalAmount = $purchases->sum('total_amount');
        $totalPaid = $purchases->sum('paid_amount');
        $totalDue = $purchases->sum('due_amount');
        $recordCount = $purchases->count();
    @endphp

    <div class="summary-grid">
        <div class="summary-card">
            <div class="summary-label">Total Cost</div>
            <div class="summary-value">${{ number_format($totalCost, 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Profit</div>
            <div class="summary-value">${{ number_format($totalProfit, 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Amount</div>
            <div class="summary-value">${{ number_format($totalAmount, 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Paid</div>
            <div class="summary-value">${{ number_format($totalPaid, 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Total Due</div>
            <div class="summary-value">${{ number_format($totalDue, 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Records</div>
            <div class="summary-value">{{ $recordCount }}</div>
        </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
        <table class="purchase-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Bill No</th>
                    <th>Total Cost</th>
                    <th>Total Profit</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchases as $index => $p)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $p->bill_no }}</td>
                    <td>${{ number_format($p->details_sum_total_buyer_price ?? 0, 2) }}</td>
                    <td>${{ number_format($p->details_sum_total_profit ?? 0, 2) }}</td>
                    <td>${{ number_format($p->total_amount ?? 0, 2) }}</td>
                    <td>${{ number_format($p->paid_amount ?? 0, 2) }}</td>
                    <td>${{ number_format($p->due_amount ?? 0, 2) }}</td>
                    <td>
                        @php
                            $statusClass = match($p->payment_status) {
                                'paid' => 'badge-paid',
                                'partial' => 'badge-partial',
                                default => 'badge-pending'
                            };
                        @endphp
                        <span class="badge {{ $statusClass }}">{{ ucfirst($p->payment_status) }}</span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($p->purchase_date)->format('Y-m-d') }}</td>
                </tr>
                @endforeach
                @if($recordCount === 0)
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem;">No purchase records found.</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <div class="report-footer">
        Report generated from {{ config('app.name') }} • {{ now()->format('Y-m-d H:i:s') }}
    </div>
</div>
</body>
</html>
