# Guida all'Installazione WordPress Plugin Maker

## Requisiti di Sistema
- Ubuntu 22.04 LTS
- Node.js 20.x
- Plesk Obsidian
- Nginx
- PM2 per process management
- Certificato SSL

## 1. Preparazione del Server

```bash
# Aggiorna il sistema
apt update && apt upgrade -y

# Installa Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Installa PM2 globalmente
npm install -g pm2

# Verifica le versioni
node --version  # Dovrebbe mostrare v20.x.x
npm --version   # Dovrebbe mostrare 10.x.x
```

## 2. Configurazione Plesk

1. Accedi a Plesk
2. Crea un nuovo dominio: `pluginmaker.weblabfactory.it`
3. Abilita SSL/TLS con Let's Encrypt
4. Configura Nginx come web server

## 3. Configurazione del Progetto

```bash
# Crea la directory dell'applicazione
mkdir -p /var/www/pluginmaker
cd /var/www/pluginmaker

# Clona il repository
git clone [URL_REPOSITORY] .

# Installa le dipendenze
npm install

# Crea il file .env
touch .env
```

Configura il file `.env`:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-secret-key
VITE_API_URL=https://pluginmaker.weblabfactory.it
```

## 4. Build del Frontend

```bash
# Build dell'applicazione React
npm run build
```

## 5. Configurazione Nginx

Crea il file di configurazione Nginx tramite Plesk:

1. Vai su Plesk > Domini > pluginmaker.weblabfactory.it > Hosting & DNS
2. Clicca su "Impostazioni Apache & nginx"
3. Aggiungi la seguente configurazione nel campo "Direttive nginx aggiuntive":

```nginx
location / {
    root /var/www/pluginmaker/dist;
    try_files $uri $uri/ /index.html;
}

location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 6. Avvio dell'Applicazione

```bash
# Avvia il server Node.js con PM2
cd /var/www/pluginmaker
pm2 start server/index.js --name "plugin-maker"
pm2 save

# Configura l'avvio automatico
pm2 startup
```

## 7. Sicurezza

1. Configura il firewall:
```bash
ufw allow 80
ufw allow 443
ufw allow 8443 # Plesk
ufw enable
```

2. Imposta i permessi corretti:
```bash
chown -R www-data:www-data /var/www/pluginmaker
chmod -R 755 /var/www/pluginmaker
```

## Utilizzo dell'Applicazione

1. **Accesso Amministratore**:
   - Accedi a `https://pluginmaker.weblabfactory.it/login`
   - Usa le credenziali amministratore configurate

2. **Configurazione OpenRouter**:
   - Vai su "API Settings"
   - Inserisci la tua chiave API OpenRouter
   - Seleziona il modello AI predefinito

3. **Generazione Plugin**:
   - Vai sulla pagina "Crea Plugin"
   - Descrivi il plugin desiderato in italiano
   - L'AI genererà il codice completo
   - Scarica il plugin in formato ZIP

4. **Monitoraggio**:
   - Controlla i log del server:
     ```bash
     pm2 logs plugin-maker
     ```
   - Monitora le prestazioni:
     ```bash
     pm2 monit
     ```

## Manutenzione

1. **Aggiornamenti**:
```bash
cd /var/www/pluginmaker
git pull
npm install
npm run build
pm2 restart plugin-maker
```

2. **Backup**:
```bash
# Backup dei file
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/pluginmaker

# Backup delle configurazioni
cp /etc/nginx/conf.d/pluginmaker.conf backups/
```

## Risoluzione Problemi

1. **Server non risponde**:
   ```bash
   pm2 restart plugin-maker
   systemctl restart nginx
   ```

2. **Errori 502**:
   - Verifica i log: `pm2 logs`
   - Controlla la porta: `netstat -tulpn | grep 3000`
   - Riavvia il processo: `pm2 restart plugin-maker`

3. **Problemi di permessi**:
   ```bash
   chown -R www-data:www-data /var/www/pluginmaker
   chmod -R 755 /var/www/pluginmaker
   ```