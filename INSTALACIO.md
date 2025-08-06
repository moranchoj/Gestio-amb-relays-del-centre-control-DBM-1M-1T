# Sistema de Control Automàtic de Bomba DBM

Aquest projecte implementa un sistema automatitzat per al control d'una bomba entre dos dipòsits utilitzant Node-RED, Raspberry Pi, i components Victron Energy.

## Components del Sistema

- **Raspberry Pi 4B** amb HAT PiRelay v2 (4 relés)
- **Victron Cerbo GX** amb GX Tank 140 (firmware 3.63+)
- **2 sondes de nivell 4-20 mA**: Canal 3 (dipòsit A), Canal 4 (dipòsit B)
- **DBM Control 1M/1T** per control de bomba
- **Node-RED** amb mòduls MQTT, GPIO, email i dashboard

## Instal·lació

### 1. Preparació del Sistema Venus OS 3.64 Large

**Important**: Venus OS 3.64 Large està basat en OpenEmbedded/Yocto, no utilitza `apt` com a gestor de paquets. Totes les comandes s'executen com a usuari `root`.

#### Transferència de Fitxers al Sistema

**Opció 1: SCP (recomanat)**
```bash
# Des d'un ordinador amb el projecte descarregat
scp -r Gestio-amb-relays-del-centre-control-DBM-1M-1T/ root@[IP_VENUS_OS]:/data/
```

**Opció 2: USB**
1. Copieu els fitxers del projecte a una memòria USB
2. Connecteu la USB al sistema Venus OS
3. Munteu i copieu els fitxers:
```bash
mount /dev/sda1 /mnt
cp -r /mnt/Gestio-amb-relays-del-centre-control-DBM-1M-1T/ /data/
umount /mnt
```

**Opció 3: Descàrrega directa (si disponible)**
```bash
cd /data
wget -O venus-pump-control.tar.gz [URL_DEL_PROJECTE]
tar -xzf venus-pump-control.tar.gz
```

#### Instal·lació de Dependències

```bash
# Canviar al directori del projecte
cd /data/Gestio-amb-relays-del-centre-control-DBM-1M-1T

# Venus OS 3.64 Large ja inclou Node.js i npm
# Verificar versions disponibles
node --version
npm --version

# Si Node-RED no està instal·lat, instal·lar-lo
npm install -g node-red

# Configurar permisos per a GPIO i I2C (ja estan habilitats a Venus OS)
# Els dispositius GPIO són accessibles directament com a root
```

### 2. Instal·lació de Dependències del Projecte

```bash
cd /data/Gestio-amb-relays-del-centre-control-DBM-1M-1T
npm install
```

### 3. Configuració del Sistema

#### MQTT (Cerbo GX)
- Assegureu-vos que el Cerbo GX té MQTT habilitat
- Configureu les sondes de nivell als canals 3 i 4
- Actualitzeu les adreces MQTT a `config-parametres-logica.json`

#### GPIO (Relés)
- Relé 3: GPIO 6
- Relé 4: GPIO 5
- Configuració: Actiu LOW (0 = relé tancat, 1 = relé obert)
- **Important**: Venus OS utilitza `node-red-node-pi-gpio` per compatibilitat

#### Email (Gmail)
Per habilitar les notificacions per email:
1. Creeu una contrasenya d'aplicació a Gmail
2. Editeu la configuració a través del dashboard o directament al fitxer JSON

### 4. Execució

```bash
# Executar Node-RED
node-red flows.json

# O amb pm2 per execució permanent (si pm2 està disponible)
npm install -g pm2
pm2 start node-red -- flows.json
pm2 save
pm2 startup

# Alternativament, crear un servei systemd per Venus OS
# Crear fitxer de servei
cat > /etc/systemd/system/dbm-pump-control.service << EOF
[Unit]
Description=DBM Pump Control Node-RED
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/data/Gestio-amb-relays-del-centre-control-DBM-1M-1T
ExecStart=/usr/bin/node-red flows.json
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Habilitar i iniciar el servei
systemctl enable dbm-pump-control
systemctl start dbm-pump-control
```

## Configuració

### Paràmetres Configurables

#### Llindars de Nivell
- **Dipòsit A Mínim**: 10-30% (per defecte: 20%)
- **Dipòsit B Mínim**: 20-89% (per defecte: 40%)
- **Dipòsit B Màxim**: 90-100% (per defecte: 95%)

#### Temporització
- **Hora d'execució**: 9:00-17:00 (per defecte: 12:00)
- **Durada màxima**: 1-5 minuts (per defecte: 3 minuts)

#### MQTT Topics (Cerbo GX)
Actualitzeu l'ID del dispositiu (b827eb123456) amb el vostre:
- Dipòsit A: `N/[DEVICE_ID]/tank/3/Level`
- Dipòsit B: `N/[DEVICE_ID]/tank/4/Level`

## Dashboard

Accediu al dashboard a: `http://[IP_RASPBERRY]:1880/ui`

### Pestanyes

1. **Monitorització**
   - Nivells actuals dels dipòsits (gauges)
   - Estat de la bomba (LED indicator)
   - Informació de l'última maniobra

2. **Configuració**
   - Llindars configurables amb validació
   - Hora d'execució i durada màxima
   - Botó per desar canvis

3. **Històric**
   - Gràfic de línies amb dades històriques
   - Selector de període (7 dies a 1 any)
   - Visualització de nivells inicials i finals

## Lògica de Funcionament

### Condicions d'Inici
1. Nivell dipòsit A ≥ llindar mínim configurat
2. Nivell dipòsit B ≤ llindar mínim configurat
3. Hora programada (execució diària)

### Condicions de Parada
1. Temps màxim de maniobra superat
2. Nivell dipòsit B ≥ llindar màxim
3. Nivell dipòsit A < llindar mínim

### Registre d'Històrics
Cada maniobra es registra a `historic-maniobres.csv` amb:
- Timestamp d'inici
- Durada en segons
- Nivells inicials i finals de tots dos dipòsits
- Motiu de finalització
- Estat de la maniobra

## Fitxers del Sistema

- `flows.json`: Flux principal de Node-RED
- `config-parametres-logica.json`: Configuració persistent
- `historic-maniobres.csv`: Registre històric de maniobres
- `package.json`: Dependències del projecte

## Consideracions Específiques per a Venus OS 3.64 Large

### Característiques del Sistema
- **Sistema operatiu**: Basat en OpenEmbedded/Yocto
- **Gestor de paquets**: `opkg` (no `apt`)
- **Usuari per defecte**: `root`
- **Directori de dades**: `/data` (persistent entre actualitzacions)
- **GPIO/I2C**: Pre-configurats i accessibles

### Estructura de Directoris Recomanada
```
/data/
├── Gestio-amb-relays-del-centre-control-DBM-1M-1T/
│   ├── flows.json
│   ├── config-parametres-logica.json
│   ├── historic-maniobres.csv
│   └── package.json
```

### Persistència de Dades
Venus OS manté el directori `/data` entre actualitzacions del firmware. Assegureu-vos que tots els fitxers del projecte estiguin ubicats dins d'aquest directori.

### Actualitzacions del Sistema
Quan actualitzeu Venus OS:
1. Les dades a `/data` es mantenen
2. Pot ser necessari reinstal·lar dependències npm globals
3. Els serveis systemd personalitzats es mantenen

## Troubleshooting

### Problemes Comuns

1. **MQTT no connecta**
   - Verificar IP del Cerbo GX
   - Comprovar que MQTT està habilitat al Cerbo GX
   - Revisar topics MQTT al fitxer de configuració

2. **Relés no funcionen**
   - Verificar connexions GPIO
   - Comprovar que el HAT PiRelay està correctament instal·lat
   - Revisar permisos GPIO

3. **Email no s'envia**
   - Verificar credencials Gmail
   - Comprovar que s'utilitza contrasenya d'aplicació
   - Revisar configuració SMTP

### Logs
```bash
# Logs de Node-RED
tail -f ~/.node-red/node-red.log

# Logs del servei systemd (si s'utilitza)
journalctl -u dbm-pump-control -f

# Logs del sistema Venus OS
journalctl -f
```

### Problemes Específics de Venus OS

1. **Node-RED no arranca**
   - Verificar que Node.js està instal·lat: `node --version`
   - Comprovar ruta del node-red: `which node-red`
   - Instal·lar si cal: `npm install -g node-red`

2. **Permisos GPIO**
   - Venus OS executa com a root, els GPIO són accessibles directament
   - Verificar dispositius: `ls -la /dev/gpio*`
   - No cal configuració addicional de permisos

3. **Memòria limitada**
   - Venus OS pot tenir restriccions de memòria
   - Monitoritzar ús: `free -h`
   - Ajustar paràmetres de Node-RED si cal

## Manteniment

- Revisar els logs regularment
- Comprovar l'estat dels fitxers de configuració
- Verificar el funcionament dels sensors
- Actualitzar el firmware del Cerbo GX segons sigui necessari

## Seguretat

- Configurar firewall adequat
- Utilitzar contrasenyes segures
- Limitar l'accés SSH
- Considerar VPN per accés remot al dashboard