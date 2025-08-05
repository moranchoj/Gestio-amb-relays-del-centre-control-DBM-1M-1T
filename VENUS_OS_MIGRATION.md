# Migració a Venus OS 3.64 Large

Aquest document descriu els canvis realitzats per adaptar el sistema DBM Pump Control per a Venus OS 3.64 Large.

## Canvis Realitzats

### 1. Eliminació de Dependències Debian/Ubuntu
- **Eliminat**: Comandes `sudo apt update && sudo apt upgrade -y`
- **Eliminat**: Instal·lació de Node.js via `curl` i `apt-get`
- **Eliminat**: Comandes `sudo` per a configuració de sistema
- **Eliminat**: `sudo raspi-config` per habilitar GPIO/I2C

### 2. Adaptació per a OpenEmbedded/Yocto
- **Afegit**: Instruccions específiques per a Venus OS
- **Afegit**: Explicació del sistema de fitxers `/data` persistent
- **Afegit**: Configuració com a usuari `root`
- **Afegit**: Gestió amb `opkg` en lloc d'`apt`

### 3. Mètodes de Transferència de Fitxers
- **Afegit**: Instruccions per SCP
- **Afegit**: Procediment per USB
- **Afegit**: Opció de descàrrega directa

### 4. Actualització de Dependències
- **Canviat**: `node-red-node-pi-gpiod` → `node-red-node-pi-gpio` per millor compatibilitat
- **Mantingut**: Totes les altres dependències sense canvis

### 5. Configuració de Serveis
- **Afegit**: Instruccions per a systemd a Venus OS
- **Afegit**: Configuració de persistència entre actualitzacions

## Beneficis de Venus OS

### Avantatges
1. **GPIO pre-configurat**: No cal configuració manual
2. **Usuari root**: Permisos complets sense sudo
3. **Persistència**: Directori `/data` es manté entre actualitzacions
4. **Integració Victron**: Optimitzat per a ecosistema Victron Energy

### Consideracions
1. **Memòria limitada**: Monitoritzar ús de recursos
2. **Sistema només lectura**: Fitxers a `/data` per persistència
3. **Actualitzacions**: Poden requerir reinstal·lació de dependències globals

## Compatibilitat

El sistema manté **compatibilitat completa** amb:
- Raspberry Pi OS tradicional
- Altres sistemes Linux amb GPIO
- Totes les funcionalitats originals del projecte

## Verificació

Utilitzeu el script `validate-system.sh` per verificar que tots els components funcionen correctament tant a Venus OS com a altres sistemes.

```bash
./validate-system.sh
```

## Documentació Actualitzada

- `INSTALACIO.md`: Instruccions completes per a Venus OS
- `README.md`: Guia ràpida amb opcions per ambdós sistemes
- `package.json`: Dependències actualitzades per compatibilitat