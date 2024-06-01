import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TAX_RATE = 0.07;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(quantity, unit) {
  return quantity * unit;
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

export default function OrderTable({ rows }) {
  console.log(rows);
  const processedRows = rows.map((row) => ({
    ...row,
    price: priceRow(row.item_Quantity, row.item_Price)
  }));

  const invoiceSubtotal = subtotal(processedRows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              colSpan={4}
              sx={{ backgroundColor: '#f0f0f0', fontSize: '20px' }}
            >
              Details
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: '#f0f0f0', fontSize: '20px' }}
            >
              Price
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
            <TableCell sx={{ fontSize: '20px' }}>Image</TableCell>
            <TableCell sx={{ fontSize: '20px' }}>Product Name</TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>
              Qty.
            </TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>
              Unit
            </TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processedRows.map((row) => (
            <TableRow key={row.item_Name}>
              <TableCell>
                <img
                  src={row.item_image}
                  alt={row.item_Name}
                  style={{ width: '50px', height: '50px' }}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '20px' }}>{row.item_Name}</TableCell>
              <TableCell align="right" sx={{ fontSize: '20px' }}>
                {row.item_Quantity}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: '20px' }}>
                {row.unit}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: '20px' }}>
                {ccyFormat(row.item_Price)} ₹
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: '#f0f0f0', fontSize: '20px' }}>
            <TableCell rowSpan={3} />
            <TableCell colSpan={3} sx={{ fontSize: '20px' }}>
              Subtotal
            </TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>
              {ccyFormat(invoiceSubtotal)} ₹
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontSize: '20px' }}>
              Tax
            </TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>{`${(
              TAX_RATE * 100
            ).toFixed(0)} %`}</TableCell>
            <TableCell align="right" sx={{ fontSize: '20px' }}>
              {ccyFormat(invoiceTaxes)} ₹
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: '#f0f0f0', fontSize: '20px' }}>
            <TableCell
              colSpan={3}
              sx={{ fontSize: '20px', fontWeight: '900', fontStyle: 'bold' }}
            >
              Total
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontSize: '20px', fontWeight: '900', fontStyle: 'bold' }}
            >
              {ccyFormat(invoiceTotal)} ₹
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
