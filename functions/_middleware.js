const PASSWORD = "Rhein"; 

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // schon eingeloggt?
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("br_auth=1")) {
    return next();
  }

  // pw aus URL prüfen (?pw=...)
  const pw = url.searchParams.get("pw");
  if (pw && pw === PASSWORD) {
    url.searchParams.delete("pw");

    return new Response(null, {
      status: 302,
      headers: {
        "Location": url.toString(),
        "Set-Cookie": "br_auth=1; Path=/; Secure; SameSite=Lax; Max-Age=7200"
      }
    });
  }

  // Login-Seite
  return new Response(
    `<!doctype html>
<html lang="de"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zugriff</title>
<style>
  body{font-family:system-ui;margin:32px;max-width:520px}
  input,button{font-size:16px;padding:10px;width:100%;margin:8px 0}
</style>
<h1>Zugriff</h1>
<p>Bitte Passwort eingeben:</p>
<input id="pw" type="password" placeholder="Passwort">
<button onclick="go()">Weiter</button>
<script>
  function go(){
    const pw = document.getElementById('pw').value;
    const u = new URL(location.href);
    u.searchParams.set('pw', pw);
    location.href = u.toString();
  }
</script>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
