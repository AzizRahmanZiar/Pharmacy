<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sale Report</title>

    <style>
        body {
            font-family: DejaVu Sans;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin-bottom: 5px;
        }

        .date {
            text-align: right;
            margin-bottom: 10px;
            font-size: 11px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }

        th {
            background-color: #f3f4f6;
        }

        .paid {
            color: green;
            font-weight: bold;
        }

        .partial {
            color: orange;
            font-weight: bold;
        }

        .pending {
            color: red;
            font-weight: bold;
        }

        .footer {
            margin-top: 10px;
            text-align: right;
            font-size: 11px;
        }
    </style>
</head>
<body>

<h2>Sale Report ({{ strtoupper($status) }})</h2>

<div class="date">
    Generated: {{ now()->format('Y-m-d H:i') }}
</div>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Bill No</th>
            <th>Patient</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Status</th>
            <th>Date</th>
        </tr>
    </thead>

    <tbody>
        @foreach($sales as $index => $s)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $s->bill_no }}</td>
            <td>{{ $s->patient_name ?? '-' }}</td>
            <td>{{ number_format($s->total_amount ?? 0, 2) }}</td>
            <td>{{ number_format($s->paid_amount ?? 0, 2) }}</td>
            <td>{{ number_format($s->due_amount ?? 0, 2) }}</td>

            <td class="
                @if($s->payment_status == 'paid') paid
                @elseif($s->payment_status == 'partial') partial
                @else pending
                @endif
            ">
                {{ ucfirst($s->payment_status) }}
            </td>

            <td>
                {{ \Carbon\Carbon::parse($s->sale_date)->format('Y-m-d') }}
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    Total Records: {{ count($sales) }}
</div>

</body>
</html>
