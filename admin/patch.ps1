 = 'index.html'
 = Get-Content  -Raw
 = '        <section class= panel detail-panel id=detailSection>'
 = .IndexOf()
if ( -lt 0) { throw 'start marker not found' }
 = '    <script src= https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js>'
 = .IndexOf(, )
if ( -lt 0) { throw 'script marker not found' }
 = .Substring(0, )
 = .Substring()
        <section class= panel detail-panel id=detailSection>
          <div class= panel-head>
            <h2>Umbrella detail & actions</h2>
            <span id= selectedUmbrellaLabel>Select an umbrella</span>
          </div>
          <div class= detail-content placeholder>
            <p>Select an umbrella from the map to open the action modal.</p>
          </div>
        </section>

        <div class= modal-backdrop hidden id=umbrellaModalBackdrop>
          <div class= modal role=dialog aria-modal=true aria-labelledby=modalTitle>
            <button class= modal-close id=modalCloseBtn aria-label=Close modal>&times;</button>
            <div class= modal-header>
              <h3 id= modalTitle>Umbrella <span id=modalUmbrellaNumber>—</span></h3>
              <span id= modalStatus>Status: —</span>
            </div>
            <div class= modal-body>
              <form id= modalReserveForm class=action-form>
                <h4>Reserve</h4>
                <label>
                  Guest name *
                  <input type= text name=guestName required />
                </label>
                <label>
                  Phone
                  <input type=" tel\ name=\phone\ />
                </label>
                <label>
                  Guest count
                  <input type=" number\ name=\guestCount\ min=\1\ />
                </label>
                <label>
                  Notes
                  <textarea name=" notes\ rows=\2\></textarea>
                </label>
                <button type=" submit\>Reserve umbrella</button>
              </form>
              <div class= action-rows>
                <button type=" button\ id=\modalMarkOccupiedBtn\>Mark occupied</button>
                <button type=" button\ id=\modalReleaseUmbrellaBtn\ class=\ghost-btn\>Release umbrella</button>
                <button type=" button\ id=\modalMarkArrivedBtn\ class=\secondary\>Mark arrived</button>
                <button type=" button\ id=\modalDeleteEntryBtn\ class=\ghost-btn\>Delete entry</button>
              </div>
              <div class= detail-log id=modalDetailLog></div>
            </div>
          </div>
        </div>
 =  +  + 
