# Sistema de Control Automàtic de Bomba DBM

**Control automatitzat d'una bomba entre dos dipòsits utilitzant Node-RED, Raspberry Pi i Victron Cerbo GX**

## Descripció del Projecte

Aquest sistema implementa el control automàtic d'una bomba que impulsa aigua del dipòsit inferior (A) al dipòsit superior (B), utilitzant:

- **Raspberry Pi 4B** amb HAT PiRelay v2 per control de relés
- **Victron Cerbo GX** amb GX Tank 140 per lectura de nivells via MQTT
- **DBM Control 1M/1T** per gestió de la bomba
- **Node-RED** per l'automatització i dashboard de control

## Funcionalitats Principals

### 🔄 Automatització Completa
- Execució diària programada (configurable entre 9:00-17:00)
- Lectura de nivells via MQTT des del Cerbo GX
- Control de relés GPIO per activar/desactivar la bomba
- Lògica de control basada en llindars configurables

### 📊 Dashboard de Control
- **Monitorització**: Nivells actuals i estat de l'última maniobra
- **Configuració**: Paràmetres editables amb validació en temps real
- **Històric**: Gràfics amb dades de maniobres (7 dies a 1 any)

### 📧 Notificacions
- Enviament automàtic de correus via Gmail al final de cada maniobra
- Resum detallat amb nivells, durada i estat de la maniobra

### 📝 Registre Persistent
- Històric complet de maniobres en format CSV
- Configuració persistent en fitxer JSON
- Traçabilitat completa del sistema

## Estructura del Projecte

```
├── flows.json                      # Flux principal de Node-RED
├── config-parametres-logica.json   # Configuració del sistema
├── historic-maniobres.csv          # Històric de maniobres
├── package.json                    # Dependències Node.js
├── INSTALACIO.md                   # Guia d'instal·lació detallada
└── README.md                       # Aquest fitxer
```

## Instal·lació Ràpida

### Per a Venus OS 3.64 Large (recomanat)
```bash
# 1. Transferir fitxers via SCP
scp -r Gestio-amb-relays-del-centre-control-DBM-1M-1T/ root@[IP_VENUS_OS]:/data/

# 2. Connectar-se al sistema Venus OS
ssh root@[IP_VENUS_OS]

# 3. Instal·lar dependències
cd /data/Gestio-amb-relays-del-centre-control-DBM-1M-1T
npm install

# 4. Executar Node-RED
node-red flows.json
```

### Per a Raspberry Pi OS (tradicional)
```bash
# 1. Clonar el repositori
git clone https://github.com/moranchoj/Gestio-amb-relays-del-centre-control-DBM-1M-1T.git
cd Gestio-amb-relays-del-centre-control-DBM-1M-1T

# 2. Instal·lar dependències
npm install

# 3. Executar Node-RED
node-red flows.json
```

**Dashboard disponible a**: http://[IP_RASPBERRY]:1880/ui

### Mètodes de Transferència de Fitxers

Per a Venus OS, podeu utilitzar diversos mètodes:
- **SCP**: `scp -r projecte/ root@[IP_VENUS_OS]:/data/`
- **USB**: Muntatge i còpia manual de fitxers
- **Descàrrega directa**: wget o curl si està disponible

## Configuració Bàsica

### MQTT (Cerbo GX)
Editeu `config-parametres-logica.json` amb l'ID del vostre dispositiu:
```json
{
  "mqtt": {
    "topic_tankA": "N/[DEVICE_ID]/tank/3/Level",
    "topic_tankB": "N/[DEVICE_ID]/tank/4/Level"
  }
}
```

### Llindars de Control
- **Dipòsit A mínim**: 10-30% (defecte: 20%)
- **Dipòsit B mínim**: 20-89% (defecte: 40%)
- **Dipòsit B màxim**: 90-100% (defecte: 95%)

## Lògica de Funcionament

### Condicions d'Inici ✅
1. Nivell dipòsit A ≥ llindar mínim
2. Nivell dipòsit B ≤ llindar mínim
3. Hora programada assolida

### Condicions de Parada ⏹️
1. Temps màxim superat (1-5 min)
2. Dipòsit B arriba al màxim
3. Dipòsit A cau sota el mínim

## Components Tècnics

### Hardware
- **Sondes de nivell**: 4-20mA, canals 3 i 4 del Cerbo GX
- **Relés**: GPIO 6 i 5 de la Raspberry Pi
- **Bomba**: Control via DBM Control 1M/1T

### Software
- **Node-RED**: Automatització i dashboard
- **MQTT**: Comunicació amb Cerbo GX
- **GPIO**: Control de relés
- **Email**: Notificacions via Gmail

## Documentació Completa

Consulteu [INSTALACIO.md](INSTALACIO.md) per:
- Guia d'instal·lació pas a pas
- Configuració detallada de components
- Troubleshooting i manteniment
- Especificacions tècniques completes

## Compatibilitat

### Sistemes Operatius
- **Venus OS 3.64 Large** (recomanat) - Victron Energy
- **Raspberry Pi OS**: 3B+, 4B, Zero 2W
- **Altres sistemes Linux** amb suport GPIO

### Software
- **Node-RED**: v3.1.0+
- **Node.js**: v16.0+
- **Victron Cerbo GX**: Firmware 3.63+
- **HAT PiRelay**: v2 (compatible amb altres HAT de relés)

### Venus OS vs Raspberry Pi OS
| Característica | Venus OS 3.64 Large | Raspberry Pi OS |
|----------------|---------------------|-----------------|
| Usuari per defecte | `root` | `pi` |
| Gestor de paquets | `opkg` | `apt` |
| GPIO/I2C | Pre-configurat | Requereix configuració |
| Directori persistent | `/data` | `/home/pi` |
| Actualitzacions | Mantenen `/data` | Actualització completa |

## Llicència

MIT License - Lliure ús per a projectes personals i comercials

---

**Desenvolupat per al control automatitzat de sistemes de bombament DBM**
