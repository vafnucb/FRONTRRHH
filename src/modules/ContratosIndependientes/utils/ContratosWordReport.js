/**
 * ContratosWordReport.js
 * Generates Word (.doc) reports for Contratos module using HTML-to-Word approach.
 * No external libraries needed.
 */

function generateStyles () {
    return `
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #333; }
        h1 { font-size: 18pt; color: #1a237e; text-align: center; margin-bottom: 5px; }
        h2 { font-size: 14pt; color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 4px; margin-top: 20px; }
        h3 { font-size: 12pt; color: #333; margin-top: 15px; }
        .subtitle { text-align: center; color: #666; font-size: 10pt; margin-bottom: 20px; }
        .info-label { font-weight: bold; color: #555; font-size: 9pt; text-transform: uppercase; }
        .info-value { font-size: 11pt; margin-bottom: 8px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .info-table td { padding: 5px 10px; vertical-align: top; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
        .data-table th { background-color: #1a237e; color: white; padding: 6px 8px; font-size: 9pt; text-align: center; border: 1px solid #1a237e; }
        .data-table td { padding: 5px 8px; font-size: 9pt; border: 1px solid #ccc; }
        .data-table tr:nth-child(even) { background-color: #f5f5f5; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary-box { background-color: #e8f5e9; border: 2px solid #4CAF50; padding: 10px 15px; margin-top: 15px; }
        .summary-label { font-weight: bold; color: #2e7d32; font-size: 10pt; }
        .summary-value { font-size: 13pt; font-weight: bold; color: #2e7d32; }
        .badge { padding: 2px 8px; border-radius: 3px; font-size: 9pt; font-weight: bold; color: white; }
        .badge-pendiente { background-color: #FFA000; }
        .badge-aprobado { background-color: #2196F3; }
        .badge-pagado { background-color: #4CAF50; }
        .badge-cancelado { background-color: #F44336; }
        .page-break { page-break-before: always; }
        .filter-info { background-color: #f0f0f0; padding: 8px 12px; margin-bottom: 15px; font-size: 9pt; color: #666; }
      </style>
    `
  }
  
  function getWordHeader () {
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        ${generateStyles()}
      </head>
      <body>`
  }
  
  function getWordFooter () {
    return '</body></html>'
  }
  
  function formatMoney (amount) {
    if (!amount) return '0.00'
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  function formatDate (dateStr) {
    if (!dateStr) return '-'
    var date = new Date(dateStr)
    var day = ('0' + date.getDate()).slice(-2)
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var year = date.getFullYear()
    return day + '/' + month + '/' + year
  }
  
  function getEstadoBadgeClass (estado) {
    var map = {
      'PENDIENTE': 'badge-pendiente',
      'APROBADO': 'badge-aprobado',
      'PAGADO': 'badge-pagado',
      'CANCELADO': 'badge-cancelado'
    }
    return map[estado] || ''
  }
  
  function generateTimestamp () {
    var now = new Date()
    return now.toLocaleString('es-BO')
  }
  
  /**
   * Generate a report for a single contract with its assignments
   */
  export function generateSingleContractReport (contrato, asignaciones) {
    var totalHorasMes = asignaciones.reduce(function (sum, a) { return sum + (a.HorasMes || 0) }, 0)
    var totalMonto = asignaciones.reduce(function (sum, a) { return sum + (a.MontoTotal || 0) }, 0)
  
    var html = getWordHeader()
  
    // Title
    html += '<h1>Reporte de Contrato</h1>'
    html += '<p class="subtitle">Generado el ' + generateTimestamp() + '</p>'
  
    // Contract Info
    html += '<h2>Informaci\u00f3n del Contrato</h2>'
    html += '<table class="info-table">' +
      '<tr>' +
        '<td width="25%"><span class="info-label">N\u00b0 Contrato:</span><br><span class="info-value" style="font-size: 14pt; color: #2196F3; font-weight: bold;">' + (contrato.NumeroContrato || '-') + '</span></td>' +
        '<td width="25%"><span class="info-label">Docente:</span><br><span class="info-value"><strong>' + (contrato.NombreDocente || '-') + '</strong></span></td>' +
        '<td width="25%"><span class="info-label">Sede:</span><br><span class="info-value">' + (contrato.SedeNombre || '-') + ' (' + (contrato.SedeAbr || '') + ')</span></td>' +
        '<td width="25%"><span class="info-label">Per\u00edodo:</span><br><span class="info-value">' + (contrato.PeriodoId || '-') + '</span></td>' +
      '</tr>' +
      '<tr>' +
        '<td><span class="info-label">Monto Total:</span><br><span class="info-value" style="font-size: 13pt; color: #4CAF50; font-weight: bold;">Bs. ' + formatMoney(contrato.MontoTotal) + '</span></td>' +
        '<td><span class="info-label">Estado:</span><br><span class="badge ' + getEstadoBadgeClass(contrato.Estado) + '">' + (contrato.Estado || '-') + '</span></td>' +
        '<td><span class="info-label">Fecha Creaci\u00f3n:</span><br><span class="info-value">' + formatDate(contrato.CreatedAt) + '</span></td>' +
        '<td><span class="info-label">Total Asignaciones:</span><br><span class="info-value"><strong>' + asignaciones.length + '</strong></span></td>' +
      '</tr>' +
    '</table>'
  
    // Observaciones
    if (contrato.Observaciones) {
      html += '<p><span class="info-label">Observaciones:</span><br>' + contrato.Observaciones + '</p>'
    }
  
    // Assignments Table
    html += '<h2>Asignaciones (' + asignaciones.length + ')</h2>'
    html += '<table class="data-table">' +
      '<thead><tr>' +
        '<th>#</th>' +
        '<th>CI</th>' +
        '<th>Docente</th>' +
        '<th>Sigla</th>' +
        '<th>Paralelo</th>' +
        '<th>C\u00f3d. Paralelo</th>' +
        '<th>Hrs/Sem</th>' +
        '<th>Hrs/Mes</th>' +
        '<th>Costo/Hora</th>' +
        '<th>Meses</th>' +
        '<th>Monto Total</th>' +
        '<th>Unidad Organizacional</th>' +
      '</tr></thead><tbody>'
  
    asignaciones.forEach(function (a, index) {
      html += '<tr>' +
        '<td class="text-center">' + (index + 1) + '</td>' +
        '<td>' + (a.CiDocente || '-') + '</td>' +
        '<td>' + (a.NombreCompleto || '-') + '</td>' +
        '<td>' + (a.Sigla || '-') + '</td>' +
        '<td class="text-center">' + (a.Paralelo || '-') + '</td>' +
        '<td>' + (a.CodigoParalelo || '-') + '</td>' +
        '<td class="text-right">' + (a.HorasSemana ? a.HorasSemana.toFixed(2) : '0.00') + '</td>' +
        '<td class="text-right">' + (a.HorasMes ? a.HorasMes.toFixed(2) : '0.00') + '</td>' +
        '<td class="text-right">Bs. ' + (a.CostoHora ? a.CostoHora.toFixed(2) : '0.00') + '</td>' +
        '<td class="text-center">' + (a.CantidadMeses || '-') + '</td>' +
        '<td class="text-right"><strong>Bs. ' + formatMoney(a.MontoTotal) + '</strong></td>' +
        '<td>' + (a.UnidadOrganizacional || '-') + '</td>' +
      '</tr>'
    })
  
    html += '</tbody></table>'
  
    // Summary
    html += '<div class="summary-box">' +
      '<table class="info-table"><tr>' +
        '<td width="33%"><span class="summary-label">Total Asignaciones:</span><br><span class="summary-value">' + asignaciones.length + '</span></td>' +
        '<td width="33%"><span class="summary-label">Total Horas/Mes:</span><br><span class="summary-value">' + totalHorasMes.toFixed(2) + '</span></td>' +
        '<td width="33%"><span class="summary-label">Monto Total del Contrato:</span><br><span class="summary-value">Bs. ' + formatMoney(totalMonto) + '</span></td>' +
      '</tr></table>' +
    '</div>'
  
    html += getWordFooter()
    return html
  }
  
  /**
   * Generate a report for all filtered contracts
   */
  export function generateAllContractsReport (contratos, filters, branches, periodos) {
    var totalMonto = contratos.reduce(function (sum, c) { return sum + (c.MontoTotal || 0) }, 0)
    var totalAsignaciones = contratos.reduce(function (sum, c) { return sum + (c.TotalAsignaciones || 0) }, 0)
  
    // Build filter description
    var filterDesc = []
    if (filters.branchesId) {
      var branch = branches.find(function (b) { return b.Id === filters.branchesId })
      if (branch) filterDesc.push('Sede: ' + branch.Name)
    }
    if (filters.periodoId) {
      var periodo = periodos.find(function (p) { return p.Value === filters.periodoId })
      if (periodo) filterDesc.push('Per\u00edodo: ' + periodo.Name)
    }
    if (filters.estado) {
      filterDesc.push('Estado: ' + filters.estado)
    }
  
    var html = getWordHeader()
  
    // Title
    html += '<h1>Reporte de Contratos</h1>'
    html += '<p class="subtitle">Generado el ' + generateTimestamp() + '</p>'
  
    // Filters applied
    if (filterDesc.length > 0) {
      html += '<div class="filter-info"><strong>Filtros aplicados:</strong> ' + filterDesc.join(' | ') + '</div>'
    }
  
    // Summary stats
    html += '<div class="summary-box">' +
      '<table class="info-table"><tr>' +
        '<td width="33%"><span class="summary-label">Total Contratos:</span><br><span class="summary-value">' + contratos.length + '</span></td>' +
        '<td width="33%"><span class="summary-label">Total Asignaciones:</span><br><span class="summary-value">' + totalAsignaciones + '</span></td>' +
        '<td width="33%"><span class="summary-label">Monto Total:</span><br><span class="summary-value">Bs. ' + formatMoney(totalMonto) + '</span></td>' +
      '</tr></table>' +
    '</div>'
  
    // Contracts Table
    html += '<h2>Lista de Contratos (' + contratos.length + ')</h2>'
    html += '<table class="data-table">' +
      '<thead><tr>' +
        '<th>#</th>' +
        '<th>N\u00b0 Contrato</th>' +
        '<th>Docente</th>' +
        '<th>Monto Total</th>' +
        '<th>Asignaciones</th>' +
        '<th>Estado</th>' +
        '<th>Fecha Creaci\u00f3n</th>' +
      '</tr></thead><tbody>'
  
    contratos.forEach(function (c, index) {
      html += '<tr>' +
        '<td class="text-center">' + (index + 1) + '</td>' +
        '<td>' + (c.NumeroContrato || '-') + '</td>' +
        '<td>' + (c.NombreDocente || '-') + '</td>' +
        '<td class="text-right"><strong>Bs. ' + formatMoney(c.MontoTotal) + '</strong></td>' +
        '<td class="text-center">' + (c.TotalAsignaciones || 0) + '</td>' +
        '<td class="text-center"><span class="badge ' + getEstadoBadgeClass(c.Estado) + '">' + (c.Estado || '-') + '</span></td>' +
        '<td class="text-center">' + formatDate(c.CreatedAt) + '</td>' +
      '</tr>'
    })
  
    html += '</tbody></table>'
  
    html += getWordFooter()
    return html
  }
  
  /**
   * Download HTML content as a .doc file
   */
  export function downloadWordFile (htmlContent, filename) {
    var blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' })
    var url = URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = url
    link.download = filename || 'reporte.doc'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }