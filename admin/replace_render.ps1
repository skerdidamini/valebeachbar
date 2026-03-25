=Get-Content admin.js
=@()
=False
foreach ( in ) {
  if (-not  -and .TrimStart().StartsWith('function renderDetailPanel() {')) {
     += 'function renderDetailPanel() {'
     += '  if (!selectedUmbrellaLabel) return;'
     += '  selectedUmbrellaLabel.textContent = selectedUmbrella'
     += '    ? Umbrella '
     += '    :  Select an umbrella;'
     += '}'
     += ''
    =True
    continue
  }
  if ( -and .TrimStart().StartsWith('function renderStaffTotals')) {
    =False
     += 
    continue
  }
  if () { continue }
   += 
}
Set-Content admin.js 
