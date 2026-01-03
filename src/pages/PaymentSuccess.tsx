import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order as Order;

  if (!order) {
    return <Navigate to="/" />;
  }

  const generateInvoice = () => {
    const doc = new jsPDF();

    // -- Header Section --
    // Logo / Brand Name
    doc.setFontSize(24);
    doc.setTextColor(255, 153, 0); // RaviMart Orange
    doc.text('Ravi', 14, 20);
    doc.setTextColor(0, 0, 0);
    doc.text('Mart', 33, 20);

    // Company Address (Right Aligned)
    doc.setFontSize(9);
    doc.setTextColor(50);
    const companyInfo = [
      '117, Myladi Main Road, APT Complex,',
      'M. Anumanpalli, Erode-638 101',
      'GSTIN: 33ANNPR9745D1ZL',
      'Cell: 98427 39425, 98429 78995',
      'Shop: 04294 – 239425'
    ];
    doc.text(companyInfo, 196, 15, { align: 'right' });

    // Divider
    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    // -- Order Details Section --
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('INVOICE', 14, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    
    // Left Column: Bill To
    doc.text('Bill To:', 14, 57);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    if (order.shippingAddress) {
      doc.text(order.shippingAddress.name, 14, 62);
      doc.setFont('helvetica', 'normal');
      doc.text(order.shippingAddress.address, 14, 67);
      doc.text(`${order.shippingAddress.city} - ${order.shippingAddress.zip}`, 14, 72);
    } else {
      doc.text('Valued Customer', 14, 62);
    }

    // Right Column: Invoice Details
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text('Invoice No:', 120, 57);
    doc.text('Order Date:', 120, 62);
    doc.text('Payment Mode:', 120, 67);
    
    doc.setTextColor(0);
    doc.text(order.id, 160, 57);
    doc.text(new Date(order.date).toLocaleDateString(), 160, 62);
    doc.text(order.paymentMethod.toUpperCase(), 160, 67);

    // -- Items Table --
    const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
    const tableRows = order.items.map(item => [
      item.name,
      item.quantity,
      `Rs. ${item.price.toLocaleString()}`,
      `Rs. ${(item.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [35, 47, 62], // Dark Blue
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 90 }, // Description
        1: { cellWidth: 20, halign: 'center' }, // Qty
        2: { cellWidth: 35, halign: 'right' }, // Price
        3: { cellWidth: 35, halign: 'right' }  // Total
      }
    });

    // -- Totals Section --
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Box for totals
    doc.setFillColor(248, 248, 248);
    doc.rect(110, finalY - 5, 86, 35, 'F');
    
    doc.setFontSize(10);
    doc.text('Subtotal:', 120, finalY);
    doc.text(`Rs. ${order.total.toLocaleString()}`, 190, finalY, { align: 'right' });
    
    doc.text('Tax (18% GST):', 120, finalY + 7);
    doc.text(`Rs. ${(order.total * 0.18).toLocaleString()}`, 190, finalY + 7, { align: 'right' });
    
    doc.text('Shipping:', 120, finalY + 14);
    doc.text('Free', 190, finalY + 14, { align: 'right' });
    
    doc.setDrawColor(200);
    doc.line(120, finalY + 18, 190, finalY + 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', 120, finalY + 25);
    doc.text(`Rs. ${(order.total * 1.18).toLocaleString()}`, 190, finalY + 25, { align: 'right' });

    // -- Footer --
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128);
    
    const pageHeight = doc.internal.pageSize.height;
    doc.text('Thank you for shopping with RaviMart!', 105, pageHeight - 20, { align: 'center' });
    doc.text('117, Myladi Main Road, APT Complex, M. Anumanpalli, Erode-638 101', 105, pageHeight - 15, { align: 'center' });

    doc.save(`RaviMart_Invoice_${order.id}.pdf`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-500 text-sm">Order ID</span>
            <span className="font-mono font-bold text-gray-900">{order.id}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Amount Paid</span>
            <span className="font-bold text-gray-900 text-lg">{formatPrice(order.total * 1.18)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Payment Method</span>
            <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={generateInvoice}
            className="w-full bg-gray-900 hover:bg-black text-white py-6 flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            <Download className="w-5 h-5" /> Download Invoice
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" /> My Orders
              </Button>
            </Link>
            <Link to="/products" className="w-full">
              <Button variant="outline" className="w-full">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
