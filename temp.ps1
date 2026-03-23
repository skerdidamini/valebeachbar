 = Get-Content index.html
 = @()
 = False
 = False
foreach ( in ) {
  if (-not  -and  -match '<div class= reservation-highlight>') {
     += '        <div class=reservation-form whatsapp>'
     += '          <p>'
     += '            Tap below to open WhatsApp and send Vale Beach Bar a booking note. We will confirm your table within'
     += '            12 hours.'
     += '          </p>'
     += '          <!-- Replace the phone number (355670000000) with the real Vale Beach Bar WhatsApp line. -->'
     += '          <a'
     += '            class=btn primary'
     += '            href=https://wa.me/355670000000?text=Hello%2C%20I%27d%20like%20to%20reserve%20a%20table%20at%20Vale%20Beach%20Bar.'
     += '            target=_blank'
     += '            rel=noreferrer'
     += '          >'
     += '            Message Us on WhatsApp'
     += '          </a>'
     += '        </div>'
     = True
  }
  if () {
    if ( -match '</form>') {
       = False
      continue
    }
    continue
  }
  if ( -match '<!-- Toggle these details once you integrate WhatsApp or another booking channel. -->') {
    continue
  }
  if ( -match '<form') {
     = True
    continue
  }
   += 
}
Set-Content index.html 
