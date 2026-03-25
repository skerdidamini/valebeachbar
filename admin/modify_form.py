from pathlib import Path
path = Path('index.html')
text = path.read_text()
old = '<form class="login-form" id="loginForm">'
new = '<form class="login-form" id="loginForm" action="javascript:void(0);" method="post" novalidate>'
if old not in text:
    raise SystemExit('original form tag not found')
path.write_text(text.replace(old, new, 1))
