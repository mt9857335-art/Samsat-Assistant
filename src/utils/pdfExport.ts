import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, CustomerSubscription } from '../types';

/**
 * Utility to convert an HTML element to a multi-page or single-page A4 PDF file using html2canvas & jsPDF
 */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  // Ensure the element is rendered and fonts are loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for crisp high-quality print
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 800,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate proportional height in mm
  const imgHeightMm = (canvasHeight * pdfWidth) / canvasWidth;

  if (imgHeightMm <= pdfHeight) {
    // Single page
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeightMm);
  } else {
    // Multi-page slicing
    let heightLeft = imgHeightMm;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm);
      heightLeft -= pdfHeight;
    }
  }

  pdf.save(filename);
}

/**
 * Generates and downloads a dedicated, printable, official PDF for an Invoice
 */
export async function generateInvoicePdf(invoice: Invoice, isAr: boolean = true): Promise<void> {
  // Create an off-screen beautifully styled printable invoice container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px'; // Standard A4 at 96 DPI
  container.style.minHeight = '1123px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Tajawal', 'Plus Jakarta Sans', Arial, sans-serif";
  container.style.direction = isAr ? 'rtl' : 'ltr';
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';

  const isPaid = invoice.paymentStatus === 'paid';
  const statusColor = isPaid ? '#059669' : '#d97706';
  const statusBg = isPaid ? '#ecfdf5' : '#fffbeb';
  const statusText = isPaid ? (isAr ? 'مدفوعة بالكامل' : 'PAID') : (isAr ? 'قيد التحصيل والسداد' : 'PENDING');

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 28px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 76px; height: 76px;">
          <img src="/samsat-logo.svg" style="width: 100%; height: 100%; object-fit: contain;" alt="SAM SAT Logo" />
        </div>
        <div>
          <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: 1px; font-family: 'Times New Roman', serif;">
            SAM SAT
          </h1>
          <div style="font-size: 11px; font-weight: 700; color: #b45309; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px;">
            PREMIUM SATELLITE SOLUTIONS
          </div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
            ${isAr ? 'إشراف وإدارة: الأستاذ سام • تدقيق ومتابعة: سمسات' : 'Managed by Sam • Operations by Samsat'}
          </div>
        </div>
      </div>

      <div style="text-align: ${isAr ? 'left' : 'right'};">
        <div style="font-size: 24px; font-weight: 900; color: #0284c7; letter-spacing: 1px;">
          ${isAr ? 'فاتورة حساب' : 'INVOICE'}
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #334155; font-family: monospace; margin-top: 4px;">
          #${invoice.invoiceNumber}
        </div>
        <div style="display: inline-block; margin-top: 8px; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor};">
          ${statusText}
        </div>
      </div>
    </div>

    <!-- Info Block: Customer & Invoice Details -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
          ${isAr ? 'المطلوب من الزبون الكريم:' : 'BILLED TO:'}
        </div>
        <div style="font-size: 16px; font-weight: 800; color: #0f172a;">
          ${invoice.customerName}
        </div>
        ${invoice.customerPhone ? `
          <div style="font-size: 13px; color: #475569; font-family: monospace; margin-top: 4px;">
            📞 ${invoice.customerPhone}
          </div>
        ` : ''}
        ${invoice.customerAddress ? `
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
            📍 ${invoice.customerAddress}
          </div>
        ` : ''}
      </div>

      <div style="text-align: ${isAr ? 'left' : 'right'};">
        <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
          ${isAr ? 'تفاصيل وتاريخ الفاتورة:' : 'INVOICE DETAILS:'}
        </div>
        <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">
          <span style="color: #64748b;">${isAr ? 'تاريخ الإصدار:' : 'Date:'}</span>
          <strong style="font-family: monospace;"> ${invoice.createdAt}</strong>
        </div>
        <div style="font-size: 13px; color: #334155; margin-bottom: 4px;">
          <span style="color: #64748b;">${isAr ? 'عملة الفاتورة:' : 'Currency:'}</span>
          <strong style="font-family: monospace;"> ${invoice.currency}</strong>
        </div>
        <div style="font-size: 13px; color: #334155;">
          <span style="color: #64748b;">${isAr ? 'خط التحويل المعتمد:' : 'Remit to Line:'}</span>
          <strong style="font-family: monospace; color: #0284c7;"> ${invoice.paymentPhone}</strong>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="margin-bottom: 28px;">
      <table style="width: 100%; border-collapse: collapse; text-align: ${isAr ? 'right' : 'left'};">
        <thead>
          <tr style="background: #0f172a; color: #ffffff;">
            <th style="padding: 12px 16px; font-size: 12px; font-weight: 800; border-radius: ${isAr ? '0 8px 8px 0' : '8px 0 0 8px'};">
              ${isAr ? 'البند / الخدمة / باقة التشريج' : 'Item & Description'}
            </th>
            <th style="padding: 12px 16px; font-size: 12px; font-weight: 800; text-align: center; width: 80px;">
              ${isAr ? 'الكمية' : 'Qty'}
            </th>
            <th style="padding: 12px 16px; font-size: 12px; font-weight: 800; text-align: center; width: 120px;">
              ${isAr ? 'سعر الوحدة' : 'Unit Price'}
            </th>
            <th style="padding: 12px 16px; font-size: 12px; font-weight: 800; text-align: ${isAr ? 'left' : 'right'}; width: 140px; border-radius: ${isAr ? '8px 0 0 8px' : '0 8px 8px 0'};">
              ${isAr ? 'المجموع' : 'Total'}
            </th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #e2e8f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              <td style="padding: 14px 16px; font-size: 13px; font-weight: 700; color: #1e293b;">
                ${item.description}
              </td>
              <td style="padding: 14px 16px; font-size: 13px; text-align: center; font-family: monospace; color: #475569;">
                ${item.quantity}
              </td>
              <td style="padding: 14px 16px; font-size: 13px; text-align: center; font-family: monospace; color: #475569;">
                ${item.unitPrice} ${invoice.currency}
              </td>
              <td style="padding: 14px 16px; font-size: 14px; font-weight: 800; text-align: ${isAr ? 'left' : 'right'}; font-family: monospace; color: #0284c7;">
                ${item.total} ${invoice.currency}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Total Due Box -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
      <div style="width: 320px; background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 12px; padding: 18px 24px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 8px;">
          <span>${isAr ? 'المجموع الجزئي:' : 'Subtotal:'}</span>
          <span style="font-family: monospace; font-weight: 700;">${invoice.totalAmount} ${invoice.currency}</span>
        </div>
        <div style="border-top: 2px solid #94a3b8; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 15px; font-weight: 900; color: #0f172a;">${isAr ? 'الإجمالي المطلوب:' : 'Grand Total:'}</span>
          <span style="font-size: 22px; font-weight: 900; color: #059669; font-family: monospace;">
            ${invoice.totalAmount} ${invoice.currency}
          </span>
        </div>
      </div>
    </div>

    <!-- Official Payment Instructions -->
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 18px 22px; margin-bottom: 28px;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 6px;">
        <span>💳</span>
        <span>${isAr ? 'طرق وبيانات التحويل والدفع المعتمدة:' : 'Approved Payment Instructions:'}</span>
      </div>
      <div style="font-size: 13px; color: #14532d; line-height: 1.6;">
        ${isAr 
          ? `يرجى تحويل المبلغ المطلوب إلى رقم التحويل المعتمد عبر <strong>Whish Money</strong> أو <strong>OMT</strong> أو كاش:` 
          : `Please remit total payment via Whish Money, OMT, or Cash to the approved line:`}
        <div style="font-size: 18px; font-weight: 900; color: #0284c7; font-family: monospace; margin: 6px 0;">
          📱 ${invoice.paymentPhone}
        </div>
        <div style="font-size: 11px; color: #475569;">
          ${isAr 
            ? 'يرجى إرسال إشعار أو وصل التحويل عبر الواتساب فور إتمام العملية لتأكيد السداد.' 
            : 'Kindly share the transfer receipt via WhatsApp once sent.'}
        </div>
      </div>
    </div>

    <!-- Footer Seal -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
      <div>
        <strong>SAM SAT</strong> • Premium Satellite & Recharge Solutions
      </div>
      <div>
        ${isAr ? 'خط الدعم والمتابعة المباشر:' : 'Direct Contact:'} <strong style="font-family: monospace; color: #0f172a;">03983010</strong>
      </div>
      <div>
        ${isAr ? 'صادرة وموثقة رسمياً' : 'Official Document'}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const safeCustomer = invoice.customerName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
    const filename = `SAM_SAT_Invoice_${invoice.invoiceNumber}_${safeCustomer}.pdf`;
    await exportElementToPdf(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generates and downloads a complete, professional Monthly Report PDF
 */
export async function generateMonthlyReportPdf({
  monthName,
  monthKey,
  financials,
  subscriptions,
  invoices,
  aiAnalysis,
  isAr = true,
}: {
  monthName: string;
  monthKey: string;
  financials: {
    revenueUSD: number;
    revenueLBP: number;
    unpaidUSD: number;
    collectionRate: number;
  };
  subscriptions: CustomerSubscription[];
  invoices: Invoice[];
  aiAnalysis?: string;
  isAr?: boolean;
}): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Tajawal', 'Plus Jakarta Sans', Arial, sans-serif";
  container.style.direction = isAr ? 'rtl' : 'ltr';
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';

  const expiringSubs = subscriptions.filter(s => s.endDate && s.endDate.startsWith(monthKey));

  container.innerHTML = `
    <!-- Report Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 72px; height: 72px;">
          <img src="/samsat-logo.svg" style="width: 100%; height: 100%; object-fit: contain;" alt="SAM SAT Logo" />
        </div>
        <div>
          <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: 1px;">
            SAM SAT • ${isAr ? 'التقرير المالي والتنفيذي الشامل' : 'Comprehensive Executive Report'}
          </h1>
          <div style="font-size: 13px; font-weight: 700; color: #0284c7; margin-top: 4px;">
            ${isAr ? `تقرير شهر: ${monthName}` : `Report Month: ${monthName}`} (${monthKey})
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${isAr ? 'مُعد للأستاذ سام • إدارة العمليات: سمسات (Samsat)' : "Prepared for Sam • Operations by Samsat"}
          </div>
        </div>
      </div>

      <div style="text-align: ${isAr ? 'left' : 'right'}; font-size: 12px; color: #475569;">
        <div>${isAr ? 'تاريخ التصدير:' : 'Generated on:'} <strong style="font-family: monospace;">${new Date().toISOString().split('T')[0]}</strong></div>
        <div>${isAr ? 'خط التحويل المعتمد:' : 'Remittance:'} <strong style="font-family: monospace; color: #b45309;">71186492</strong></div>
        <div>${isAr ? 'خط الأستاذ سام:' : "Sam's Line:"} <strong style="font-family: monospace; color: #0284c7;">03983010</strong></div>
      </div>
    </div>

    <!-- Executive KPI Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;">
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 800; color: #166534; text-transform: uppercase;">
          ${isAr ? 'إجمالي المحصل (USD)' : 'Collected (USD)'}
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #15803d; font-family: monospace; margin-top: 4px;">
          $${financials.revenueUSD.toLocaleString()}
        </div>
      </div>

      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 800; color: #92400e; text-transform: uppercase;">
          ${isAr ? 'مبالغ معلقة للتحصيل' : 'Pending Receivables'}
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #b45309; font-family: monospace; margin-top: 4px;">
          $${financials.unpaidUSD.toLocaleString()}
        </div>
      </div>

      <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 10px; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 800; color: #0369a1; text-transform: uppercase;">
          ${isAr ? 'المشتركون النشطون' : 'Active Subscribers'}
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #0284c7; font-family: monospace; margin-top: 4px;">
          ${subscriptions.length}
        </div>
      </div>

      <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 10px; padding: 14px; text-align: center;">
        <div style="font-size: 10px; font-weight: 800; color: #9d174d; text-transform: uppercase;">
          ${isAr ? 'نسبة التحصيل المالي' : 'Collection Rate'}
        </div>
        <div style="font-size: 20px; font-weight: 900; color: #be185d; font-family: monospace; margin-top: 4px;">
          ${financials.collectionRate}%
        </div>
      </div>
    </div>

    ${financials.revenueLBP > 0 ? `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 16px; font-size: 12px; margin-bottom: 20px; display: flex; justify-content: space-between;">
        <span>${isAr ? 'المقبوضات الإضافية بالليرة اللبنانية:' : 'Additional Revenue (LBP):'}</span>
        <strong style="font-family: monospace; color: #0284c7;">${financials.revenueLBP.toLocaleString()} ل.ل</strong>
      </div>
    ` : ''}

    <!-- Samsat AI Executive Synthesis -->
    ${aiAnalysis ? `
      <div style="background: #f8fafc; border-right: 4px solid #0284c7; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 800; color: #0284c7; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <span>✨</span>
          <span>${isAr ? 'التحليل والتوجيه التنفيذي لسام (سمسات):' : "Samsat's Strategic Executive Briefing:"}</span>
        </div>
        <div style="font-size: 12px; color: #334155; line-height: 1.7; white-space: pre-wrap;">
          ${aiAnalysis}
        </div>
      </div>
    ` : ''}

    <!-- Table 1: Expiring & Critical Subscriptions this Month -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
        ${isAr ? `اشتراكات تنتهي في شهر ${monthName} (${expiringSubs.length}):` : `Subscriptions Ending in ${monthName} (${expiringSubs.length}):`}
      </div>
      ${expiringSubs.length === 0 ? `
        <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #64748b;">
          ${isAr ? 'لا توجد اشتراكات تنتهي خلال هذا الشهر. جميع الاشتراكات محدثة وسارية.' : 'No subscriptions ending this month.'}
        </div>
      ` : `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: ${isAr ? 'right' : 'left'};">
          <thead>
            <tr style="background: #1e293b; color: #ffffff;">
              <th style="padding: 8px 12px;">${isAr ? 'اسم المشترك' : 'Subscriber'}</th>
              <th style="padding: 8px 12px;">${isAr ? 'رقم الهاتف' : 'Phone'}</th>
              <th style="padding: 8px 12px;">${isAr ? 'الخدمة' : 'Service'}</th>
              <th style="padding: 8px 12px; text-align: center;">${isAr ? 'تاريخ الانتهاء' : 'Expiry'}</th>
              <th style="padding: 8px 12px; text-align: center;">${isAr ? 'الرسوم' : 'Fee'}</th>
              <th style="padding: 8px 12px; text-align: center;">${isAr ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            ${expiringSubs.map((sub, i) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 8px 12px; font-weight: 700;">${sub.name}</td>
                <td style="padding: 8px 12px; font-family: monospace;">${sub.phone}</td>
                <td style="padding: 8px 12px;">${sub.serviceType}</td>
                <td style="padding: 8px 12px; text-align: center; font-family: monospace; color: #b45309; font-weight: 700;">${sub.endDate}</td>
                <td style="padding: 8px 12px; text-align: center; font-family: monospace; font-weight: 700;">$${sub.price}</td>
                <td style="padding: 8px 12px; text-align: center; font-weight: 800; color: ${sub.paymentStatus === 'paid' ? '#15803d' : '#b45309'};">
                  ${sub.paymentStatus === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'معلق' : 'Pending')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>

    <!-- Table 2: Issued Invoices Summary -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
        ${isAr ? `فواتير التشريج والخدمات المصدرة هذا الشهر (${invoices.length}):` : `Invoices Issued This Month (${invoices.length}):`}
      </div>
      ${invoices.length === 0 ? `
        <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #64748b;">
          ${isAr ? 'لم تصدر فواتير بعد لهذا الشهر.' : 'No invoices issued for this month.'}
        </div>
      ` : `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: ${isAr ? 'right' : 'left'};">
          <thead>
            <tr style="background: #1e293b; color: #ffffff;">
              <th style="padding: 8px 12px;">${isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
              <th style="padding: 8px 12px;">${isAr ? 'اسم الزبون' : 'Customer'}</th>
              <th style="padding: 8px 12px;">${isAr ? 'التاريخ' : 'Date'}</th>
              <th style="padding: 8px 12px; text-align: center;">${isAr ? 'الحالة' : 'Status'}</th>
              <th style="padding: 8px 12px; text-align: ${isAr ? 'left' : 'right'};">${isAr ? 'المبلغ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map((inv, i) => `
              <tr style="border-bottom: 1px solid #e2e8f0; background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 8px 12px; font-family: monospace; font-weight: 700; color: #0284c7;">#${inv.invoiceNumber}</td>
                <td style="padding: 8px 12px; font-weight: 700;">${inv.customerName}</td>
                <td style="padding: 8px 12px; font-family: monospace; color: #64748b;">${inv.createdAt}</td>
                <td style="padding: 8px 12px; text-align: center; font-weight: 800; color: ${inv.paymentStatus === 'paid' ? '#15803d' : '#b45309'};">
                  ${inv.paymentStatus === 'paid' ? (isAr ? 'مدفوعة' : 'Paid') : (isAr ? 'معلقة' : 'Pending')}
                </td>
                <td style="padding: 8px 12px; text-align: ${isAr ? 'left' : 'right'}; font-family: monospace; font-weight: 800; color: #0f172a;">
                  ${inv.totalAmount} ${inv.currency}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>

    <!-- Official Report Footer -->
    <div style="border-top: 2px solid #e2e8f0; padding-top: 16px; margin-top: 28px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
      <div>
        <strong>SAM SAT</strong> • Premium Satellite Solutions
      </div>
      <div>
        ${isAr ? 'رقم التحويل المعتمد:' : 'Remit line:'} <strong style="font-family: monospace; color: #b45309;">71186492</strong> | ${isAr ? 'خط سام:' : "Sam's line:"} <strong style="font-family: monospace; color: #0284c7;">03983010</strong>
      </div>
      <div>
        ${isAr ? 'تقرير رسمي معتمد' : 'Certified Executive Report'}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const filename = `SAM_SAT_Monthly_Report_${monthKey}.pdf`;
    await exportElementToPdf(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}
