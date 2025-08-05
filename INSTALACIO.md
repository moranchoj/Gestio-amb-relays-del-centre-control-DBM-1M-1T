# Sistema de Control Automàtic de Bomba DBM

Aquest projecte implementa un sistema automatitzat per al control d'una bomba entre dos dipòsits utilitzant Node-RED, Raspberry Pi, i components Victron Energy.

## Components del Sistema

- **Raspberry Pi 4B** amb HAT PiRelay v2 (4 relés)
- **Victron Cerbo GX** amb GX Tank 140 (firmware 3.63+)
- **2 sondes de nivell 4-20 mA**: Canal 3 (dipòsit A), Canal 4 (dipòsit B)
- **DBM Control 1M/1T** per control de bomba
- **Node-RED** amb mòduls MQTT, GPIO, email i dashboard

## Instal·lació

### 1. Preparació de la Raspberry Pi

```bash
# Actualitzar el sistema
sudo apt update && sudo apt upgrade -y

# Instal·lar Node.js i npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instal·lar Node-RED
sudo npm install -g --unsafe-perm node-red

# Habilitar I2C i GPIO
sudo raspi-config
# Interfacing Options > I2C > Yes
# Interfacing Options > GPIO > Yes
```

### 2. Instal·lació de Dependències

```bash
cd /home/pi/dbm-pump-control
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

#### Email (Gmail)
Per habilitar les notificacions per email:
1. Creeu una contrasenya d'aplicació a Gmail
2. Editeu la configuració a través del dashboard o directament al fitxer JSON

### 4. Execució

```bash
# Executar Node-RED
node-red flows.json

# O amb pm2 per execució permanent
npm install -g pm2
pm2 start node-red -- flows.json
pm2 save
pm2 startup
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

# Logs del sistema
journalctl -u node-red -f
```

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