import React, { useRef } from 'react';
import { Printer, CheckCircle, X, MapPin, Calendar, Receipt, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BillModal = ({ items, subtotal, tax, total, settings, onClose, onFinalize }) => {
    const date = new Date().toLocaleString();
    const orderNumber = `#${Date.now().toString().slice(-6)}`;
    const receiptRef = useRef(null);

    const handleDownloadPDF = async () => {
        try {
            const element = receiptRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 297] // 80mm width (thermal printer standard)
            });

            const imgWidth = 80;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`receipt-${orderNumber}-${Date.now()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try printing instead.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel" style={{
                maxWidth: '550px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div className="modal-header" style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Receipt size={24} color="var(--color-primary)" />
                        <h2 style={{ margin: 0 }}>Bill Receipt</h2>
                    </div>
                    <button className="close-btn" onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem'
                }}>
                    <div
                        ref={receiptRef}
                        className="receipt-view"
                        style={{
                            padding: '2rem',
                            background: 'white',
                            color: 'black',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: "'Courier New', Courier, monospace"
                        }}
                    >
                        {/* Header */}
                        <div className="receipt-header" style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed #000', paddingBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                                {settings?.restaurantName || 'Third Pole Restaurant'}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                                <MapPin size={14} />
                                <p style={{ margin: 0 }}>{settings?.address || 'Kathmandu, Nepal'}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                <Calendar size={14} />
                                <p style={{ margin: 0 }}>{date}</p>
                            </div>
                            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Order {orderNumber}</p>
                        </div>

                        {/* Items */}
                        <div className="receipt-items" style={{ marginBottom: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #000' }}>
                                        <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 'bold' }}>Item</th>
                                        <th style={{ textAlign: 'center', padding: '0.5rem 0', fontWeight: 'bold' }}>Qty</th>
                                        <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 'bold' }}>Price</th>
                                        <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 'bold' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id} style={{ borderBottom: index === items.length - 1 ? 'none' : '1px dashed #ddd' }}>
                                            <td style={{ padding: '0.75rem 0' }}>{item.name}</td>
                                            <td style={{ textAlign: 'center', padding: '0.75rem 0' }}>{item.quantity}</td>
                                            <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>Rs. {item.price.toFixed(2)}</td>
                                            <td style={{ textAlign: 'right', padding: '0.75rem 0', fontWeight: 'bold' }}>
                                                Rs. {(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="receipt-summary" style={{
                            borderTop: '2px dashed #000',
                            paddingTop: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                <span>Subtotal:</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#666' }}>
                                <span>Tax ({settings?.taxRate || 13}%):</span>
                                <span>Rs. {tax.toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                borderTop: '2px solid #000',
                                paddingTop: '0.75rem'
                            }}>
                                <span>GRAND TOTAL:</span>
                                <span>Rs. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="receipt-footer" style={{
                            textAlign: 'center',
                            borderTop: '2px dashed #000',
                            paddingTop: '1rem',
                            fontSize: '0.85rem'
                        }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Thank you for dining with us!</p>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Please visit again</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="modal-actions" style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    flexShrink: 0,
                    background: '#1e293b'
                }}>
                    <button
                        className="btn"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        className="btn"
                        onClick={handleDownloadPDF}
                        style={{
                            background: 'var(--gradient-accent)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <Download size={16} />
                        PDF
                    </button>
                    <button
                        className="btn btn-primary print-btn"
                        onClick={() => window.print()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Printer size={16} />
                        Print
                    </button>
                    <button
                        className="btn"
                        onClick={onFinalize}
                        style={{
                            background: 'var(--gradient-success)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        <CheckCircle size={16} />
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillModal;
