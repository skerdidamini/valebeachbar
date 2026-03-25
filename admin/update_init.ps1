$content = Get-Content admin.js -Raw
$search = @"
  appInitialized = true;

  loginForm.addEventListener("submit", handleLogin);
"@
$replace = @"
  appInitialized = true;

  loginForm.setAttribute("action", "javascript:void(0);");
  loginForm.setAttribute("method", "post");
  loginForm.addEventListener("submit", handleLogin);
"@
$content = $content -replace [regex]::Escape($search), $replace
Set-Content admin.js -Value $content
